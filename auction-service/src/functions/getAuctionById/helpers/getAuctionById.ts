import { DynamoDB } from "aws-sdk";
import * as createError from "http-errors";
import { Auction } from "@src/types";
import * as createHttpError from "http-errors";
const dynamoDB = new DynamoDB.DocumentClient();

export const getAuctionById = async (id: string): Promise<Auction> => {
  try {
    const response = await dynamoDB
      .get({ TableName: process.env.AUCTION_TABLE_NAME, Key: { id } })
      .promise();

    if (!response.Item) {
      throw new createHttpError.NotFound(
        `[GetAuctionByID] auction: ${id} was not found`
      );
    }

    return response.Item as Auction;
  } catch (error) {
    if (createError.isHttpError(error)) {
      throw error;
    }
    if (error.message) {
      throw new createError.BadRequest(error.message);
    }
    console.error(error);

    throw new createError.InternalServerError();
  }
};
