import type { AWS } from "@serverless/typescript";

import createAuction from "@functions/createAuction";
import getAuctions from "@functions/getAuctions";
import getAuctionById from "@functions/getAuctionById";
import placeBid from "@functions/placeBid";
import processAuction from "@functions/processAuction";
import uploadAuctionPicture from "@functions/uploadAuctionPicture";

const serverlessConfiguration: AWS = {
  service: "auction-core-service",
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
      MAIL_QUEUE_URL: "${self:custom.MailQueueUrl}",
      AUCTION_BUCKET_NAME: "${self:custom.AuctionBucketName}",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: "sqs:SendMessage",
            Resource: "${self:custom.MailQueueArn}",
          },
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
            ],
          },
          {
            Effect: "Allow",
            Action: ["s3:PutObject"],
            Resource: "arn:aws:s3:::${self:custom.AuctionBucketName}/*",
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
    uploadAuctionPicture,
  },
  package: { individually: true },
  custom: {
    Authorizer:
      "arn:aws:lambda:${aws:region}:${aws:accountId}:function:auction-auth-service-dev-auth",
    AuctionTableName: "AwsAuctionTable",
    AuctionTable: {
      Name: "AwsAuctionTable",
      Arn: { "Fn::GetAtt": ["AwsAuctionTable", "Arn"] },
    },
    MailQueueArn: "${cf:auction-notification-service-dev.MailQueueArn}",
    MailQueueUrl: "${cf:auction-notification-service-dev.MailQueueUrl}",
    AuctionBucketName: "auction-bucket-aserm4jfiv4ut",
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
    "serverless-offline": {
      ignoreJWTSignature: true,
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
      AuctionBucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: "${self:custom.AuctionBucketName}",
          LifecycleConfiguration: {
            Rules: [
              {
                Id: "ExpirePictures_example_id",
                Status: "Enabled",
                ExpirationInDays: 1,
              },
            ],
          },
        },
      },
      //API: s3:PutBucketPolicy Access Denied
      // AuctionBucketPolicy: {
      //   Type: "AWS::S3::BucketPolicy",
      //   Properties: {
      //     Bucket: { Ref: "AuctionBucket" },
      //     PolicyDocument: {
      //       Statement: [
      //         {
      //           Sid: "ModifyBucketPolicy",
      //           Effect: "Allow",
      //           Principal: "*",
      //           Action: ["s3:GetObject"],
      //           Resource: "arn:aws:s3:::${self:custom.AuctionBucketName}/*",
      //         },
      //       ],
      //     },
      //   },
      // },
    },
  },
};

module.exports = serverlessConfiguration;
