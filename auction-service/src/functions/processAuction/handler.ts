import { getEndedAuctions } from "@functions/processAuction/helpers/getEndedAuctions";
import { closeAuction } from "@functions/processAuction/helpers/closeAuction";
import * as createHttpError from "http-errors";

const processAuction = async () => {
  const data = await getEndedAuctions();
  console.log("[processAuction] executed", new Date().toISOString());
  console.log(data);

  try {
    await Promise.all(data.map((record) => closeAuction(record.id)));
  } catch (error) {
    console.error(error);
    throw createHttpError.UnprocessableEntity(error.message);
  }
};

export const main = processAuction;
