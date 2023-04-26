import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { v4 as uuid } from "uuid";
import { DynamoDB } from "aws-sdk";
import schema from "./schema";
const dynamoDB = new DynamoDB.DocumentClient();

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const { title } = event.body;
  const currentTime = new Date();
  const endingAt = new Date();
  endingAt.setHours(currentTime.getHours() + 3)

  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: currentTime.toISOString(),
    endingAt: endingAt,
    highestBid: {
      amount: 0
    }
  };

  try {
    await dynamoDB
      .put({
        TableName: process.env.AUCTION_TABLE_NAME,
        Item: auction,
      })
      .promise();

    return formatJSONResponse({
      message: `Success. ${title} was created.`,
    });
  } catch (error) {
    console.error(error);
    formatJSONResponse(
      {
        message: error.message,
      },
      400
    );
  }
};

export const main = middyfy(hello);
