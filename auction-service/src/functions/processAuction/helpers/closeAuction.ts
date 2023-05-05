import { DynamoDB } from "aws-sdk";
const dynamodb = new DynamoDB.DocumentClient();
export const closeAuction = (id: string) => {
  return dynamodb
    .update({
      TableName: process.env.AUCTION_TABLE_NAME,
      Key: { id },
      UpdateExpression: "set #status = :status",
      ExpressionAttributeValues: { ":status": "CLOSED" },
      ExpressionAttributeNames: { "#status": "status" },
    })
    .promise();
};
