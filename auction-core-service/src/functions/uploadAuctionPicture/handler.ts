import { middyfy } from "@libs/lambda";
import * as createError from "http-errors";
import { S3, DynamoDB } from "aws-sdk";
import { getAuctionById } from "@functions/getAuctionById/helpers/getAuctionById";

const s3 = new S3();
const dynamodb = new DynamoDB.DocumentClient();
const uploadAuctionPicture = async (event) => {
  const { id } = event.pathParameters;
  // const { email } = event.requestContext.authorizer;
  const auction = await getAuctionById(id);
  console.log(auction)
  // console.log(email)

  // Validate auction ownership
  // if (auction.seller !== email) {
  //   throw new createError.Forbidden(`You are not the seller of this auction!`);
  // }

  const base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  let updatedAuction;
  const key = auction.id + ".jpg";

  try {
    const result = await s3
      .upload({
        Bucket: process.env.AUCTION_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentEncoding: "base64",
        ContentType: "image/jpeg",
      })
      .promise();

    const pictureUrl = result.Location;

    updatedAuction = await dynamodb
      .update({
        TableName: process.env.AUCTION_TABLE_NAME,
        Key: { id },
        UpdateExpression: "set pictureUrl = :pictureUrl",
        ExpressionAttributeValues: {
          ":pictureUrl": pictureUrl,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
};

export const main = middyfy(uploadAuctionPicture);
