import type { AWS } from "@serverless/typescript";

import sendEmail from "src/functions/sendEmail";

const serverlessConfiguration: AWS = {
  service: "auction-notification-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "eu-central-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: "ses:SendEmail",
            Resource: "arn:aws:ses:*",
          },
          {
            Effect: "Allow",
            Action: ["sqs:ReceiveMessage"],
            // Resource: '!GetAtt MailQueue.Arn',
            Resource: "${self:custom.MailQueueArn}",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { sendEmail },
  package: { individually: true },
  custom: {
    MailQueueName: 'MailQueue',
    MailQueueArn: { "Fn::GetAtt": ["MailQueue", "Arn"] },
    MailQueueUrl: {Ref: 'MailQueue'},
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
      MailQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "MailQueue",
        },
      },
    },
    Outputs: {
      MailQueueArn: {
        Value: "${self:custom.MailQueueArn}",
        Export: {
          Name: "${self:custom.MailQueueName}-Arn",
        }
      },
      MailQueueUrl: {
        Value: "${self:custom.MailQueueUrl}",
        Export: {
          Name:"${self:custom.MailQueueName}-Url",
        }
      },
    },
  },
};

module.exports = serverlessConfiguration;
