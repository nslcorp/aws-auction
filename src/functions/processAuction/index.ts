import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  // events: [
  //   {
  //     // schedule: "rate(1 minute)",
  //     // schedule: "chron",
  //   },
  // ],
};
