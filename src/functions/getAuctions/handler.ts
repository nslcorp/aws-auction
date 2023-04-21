import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DynamoDB } from "aws-sdk";
// import createError from "http-errors";
import * as process from "process";

const dynamoDB = new DynamoDB.DocumentClient();

const getAuctions = async () => {


  // throw createError(402, 'Faile message')
  // console.log(event)
  const response = await dynamoDB
    .scan({ TableName: process.env.AUCTION_TABLE_NAME })
    .promise();

  return formatJSONResponse({
    message: `Success`,
    data: response,
    env: process.env
  });

  // try {
  //   const dynamoResponse = await dynamoDB
  //       .put({
  //         TableName: "AwsAuctionTable",
  //         Item: auction,
  //       })
  //       .promise();
  //
  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify({
  //       env: process.env,
  //       auction,
  //     }),
  //   };
  // } catch (error) {
  //   // console.error(error);
  //   console.error(error.message);
  // }
};

export const main = middyfy(getAuctions);
