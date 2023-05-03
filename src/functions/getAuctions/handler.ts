import {formatJSONResponse, ValidatedEventAPIGatewayProxyEvent} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DynamoDB } from "aws-sdk";
import * as createHttpError from "http-errors";
import schema from "./schema";

const dynamoDB = new DynamoDB.DocumentClient();

const getAuctions: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { status } = event.queryStringParameters;

  console.log(status);
  if (!status) {
    throw new createHttpError.NotFound(
      '[F.getAuctions] missing mandatory parameter "status"'
    );
  }

  const response = await dynamoDB
    .query({
      TableName: process.env.AUCTION_TABLE_NAME,
      IndexName: "statusAndEndDate",
      KeyConditionExpression: "#status =:status",
      ExpressionAttributeValues: {
        ":status": status.toUpperCase(),
      },
      ExpressionAttributeNames: {
        "#status": "status",
      },
    })
    .promise();

  return formatJSONResponse(response.Items);
};

export const main = middyfy(getAuctions);
