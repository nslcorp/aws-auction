import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: "${self:custom.MailQueueArn}",
        batchSize: 1,  // process only (N) records form queue
      },
    },
  ],
};
