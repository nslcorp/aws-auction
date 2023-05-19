import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getAuctionById } from "@functions/getAuctionById/helpers/getAuctionById";

const getAuctions = async (event: APIGatewayProxyEvent) => {
  const { id } = event.pathParameters;
  const auction = await getAuctionById(id);

  formatJSONResponse(auction);
  //
};

export const main = middyfy(getAuctions);
