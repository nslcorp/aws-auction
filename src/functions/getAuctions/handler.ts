import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DynamoDB } from "aws-sdk";
import * as process from "process";

const dynamoDB = new DynamoDB.DocumentClient();

const getAuctions = async () => {


  const response = await dynamoDB
    .scan({ TableName: process.env.AUCTION_TABLE_NAME })
    .promise();

  return formatJSONResponse(response.Items);

};

export const main = middyfy(getAuctions);
