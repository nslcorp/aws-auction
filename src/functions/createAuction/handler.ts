import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { v4 as uuid } from "uuid";
// import { DynamoDB } from "aws-sdk";

import schema from './schema';
// const dynamoDB = new DynamoDB.DocumentClient();

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { title } = event.body;
  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: new Date().toISOString(),
  };

  console.log("auction", auction);
  console.log("env", process.env);

  return formatJSONResponse({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    auction,
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

export const main = middyfy(hello);
