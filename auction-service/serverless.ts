import type { AWS } from "@serverless/typescript";

import createAuction from "@functions/createAuction";
import getAuctions from "@functions/getAuctions";
import getAuctionById from "@functions/getAuctionById";
import placeBid from "@functions/placeBid";
import processAuction from "@functions/processAuction";

const serverlessConfiguration: AWS = {
  service: "aws-auction",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    region: "eu-central-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      AUCTION_TABLE_NAME: "${self:custom.AuctionTableName}",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:Scan",
              "dynamodb:PutItem",
              "dynamodb:GetItem",
              "dynamodb:UpdateItem",
              "dynamodb:Query",
            ],
            Resource: [
              "${self:custom.AuctionTable.Arn}",
              {
                "Fn::Join": [
                  "/",
                  [
                    "${self:custom.AuctionTable.Arn}",
                    "index",
                    "statusAndEndDate",
                  ],
                ],
              },
              // "arn:aws:dynamodb:eu-central-1:663503730313:table/AwsAuctionTable/index/statusAndEndDate"
            ],
            // "arn:aws:dynamodb:eu-central-1:663503730313:table/AwsAuctionTable",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: {
    createAuction,
    getAuctions,
    getAuctionById,
    placeBid,
    processAuction,
  },
  package: { individually: true },
  custom: {
    Authorizer: "arn:aws:lambda:${aws:region}:${aws:accountId}:function:auction-auth-service-dev-auth",
    AuctionTableName: "AwsAuctionTable",
    AuctionTable: {
      Name: "AwsAuctionTable",
      Arn: { "Fn::GetAtt": ["AwsAuctionTable", "Arn"] },
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      AwsAuctionTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "AwsAuctionTable",
          BillingMode: "PAY_PER_REQUEST",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
            {
              AttributeName: "status",
              AttributeType: "S",
            },
            {
              AttributeName: "endingAt",
              AttributeType: "S",
            },
          ],
          KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
          GlobalSecondaryIndexes: [
            {
              IndexName: "statusAndEndDate",
              KeySchema: [
                {
                  AttributeName: "status",
                  KeyType: "HASH",
                },
                {
                  AttributeName: "endingAt",
                  KeyType: "RANGE",
                },
              ],
              Projection: {
                ProjectionType: "ALL",
              },
            },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
