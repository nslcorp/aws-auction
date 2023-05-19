import { DynamoDB } from "aws-sdk";
import { Auction, MessageQueueRecord } from "@src/types";
import { SQS } from "aws-sdk";
import * as process from "process";

const dynamodb = new DynamoDB.DocumentClient();
const sqs = new SQS();

export const closeAuction = async (id: string) => {
  const data = await dynamodb
    .update({
      TableName: process.env.AUCTION_TABLE_NAME,
      Key: { id },
      UpdateExpression: "set #status = :status",
      ExpressionAttributeValues: { ":status": "CLOSED" },
      ExpressionAttributeNames: { "#status": "status" },
    })
    .promise();

  const { title, seller, highestBid } = data.Attributes as Auction;
  console.log("closeAuction:data", data);

  if (highestBid.amount === 0) {
    await sqs
      .sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subjectText: `There was no any BID at you auction.`,
          bodyText: `Oh no. Your item ${title} did't get any bids`,
          recipients: [seller],
        } as MessageQueueRecord),
      })
      .promise();
  }

  const notifySeller = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subjectText: `Your auction was sold.`,
        bodyText: `Greetings. Your item was sold for price $${highestBid.amount}`,
        recipients: [seller],
      } as MessageQueueRecord),
    })
    .promise();

  const notifyBidder = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subjectText: `You won the auction`,
        bodyText: `What a great deal. You just got a ${title} from ${highestBid.amount}`,
        recipients: [highestBid.bidder],
      } as MessageQueueRecord),
    })
    .promise();

  return Promise.all([notifyBidder, notifySeller]);
};
