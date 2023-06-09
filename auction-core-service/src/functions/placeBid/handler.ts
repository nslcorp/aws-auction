import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DynamoDB } from "aws-sdk";
import schema from "./schema";
import { getAuctionById } from "@functions/getAuctionById/helpers/getAuctionById";
import * as createHttpError from "http-errors";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";

const dynamoDB = new DynamoDB.DocumentClient();

const placeBid: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const { id } = event.pathParameters;
  const { amount } = event.body;
  const { email } = event.requestContext.authorizer;

  if (!amount) {
    return formatJSONResponse({ message: "Missing 'amount' parameter" }, 400);
  }

  const auction = await getAuctionById(id);

  if (auction.status !== "OPEN") {
    throw new createHttpError.Forbidden("[placeBid] you can place a bid only at status:OPEN auction"
    );
  }

  if (auction.seller === email) {
    throw new createHttpError.Forbidden(
      "[placeBid] you can not bid your own auction."
    );
  }

  if (auction.highestBid.bidder === email) {
    throw new createHttpError.Forbidden(
        "[placeBid] you are already the highest bidder."
    );
  }

  if (amount <= auction.highestBid.amount) {
    throw new createHttpError.Forbidden(
      `[placeBid] Your bid must be higher than ${auction.highestBid.amount}.`
    );
  }

  //
  try {
    const response = await dynamoDB
      .update({
        TableName: process.env.AUCTION_TABLE_NAME,
        Key: { id },
        UpdateExpression:
          "set highestBid.amount = :amount, highestBid.bidder = :bidder",
        ExpressionAttributeValues: { ":amount": amount, ":bidder": email },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return formatJSONResponse(response.Attributes);
  } catch (error) {
    return formatJSONResponse(
      {
        message: error.message,
      },
      400
    );
  }
};

export const main = middyfy(placeBid).use(
  validator({ eventSchema: transpileSchema(schema) })
);
