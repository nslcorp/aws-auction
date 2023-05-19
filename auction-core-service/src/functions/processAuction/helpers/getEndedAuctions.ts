import { DynamoDB } from "aws-sdk";
import * as process from "process";
import {Auction} from "@src/types";
const dynamodb = new DynamoDB.DocumentClient();
export const getEndedAuctions = async (): Promise<Auction[]> => {
  const response = await dynamodb
    .query({
      TableName: process.env.AUCTION_TABLE_NAME,
      IndexName: "statusAndEndDate",
      KeyConditionExpression: "#status = :status AND endingAt <= :now",
      ExpressionAttributeValues: {
        ":status": "OPEN",
        ":now": new Date().toISOString(),
      },
      ExpressionAttributeNames: {
        "#status": "status",
      },
    })
    .promise();

  return response.Items as Auction[];
};
