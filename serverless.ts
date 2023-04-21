import type { AWS } from '@serverless/typescript';

import createAuction from 'src/functions/createAuction';
import getAuctions from 'src/functions/getAuctions';

const serverlessConfiguration: AWS = {
  service: 'aws-auction',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    region: "eu-central-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      AUCTION_TABLE_NAME: "${self:custom.AuctionTableName}",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
                "dynamodb:PutItem",
                "dynamodb:Scan",
            ],
            Resource: "arn:aws:dynamodb:eu-central-1:663503730313:table/AwsAuctionTable"
          }
        ]
      }
    }
  },
  // import the function via paths
  functions: { createAuction, getAuctions },
  package: { individually: true },
  custom: {
    AuctionTableName: 'AwsAuctionTable',
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
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
              AttributeType: "S"
            }
          ],
          KeySchema: [
            {AttributeName: "id", KeyType: "HASH"}
          ]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
