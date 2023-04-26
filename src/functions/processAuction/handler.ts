import { getEndedAuctions } from "@functions/processAuction/helpers/getEndedAuctions";

const processAuction = async () => {
  const data = await getEndedAuctions();
  console.log("[processAuction] executed", new Date().toISOString());
  console.log(data);

};

export const main = processAuction;
