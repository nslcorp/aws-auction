import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "POST",
        path: "/auction/{id}/picture",
        authorizer: "${self:custom.Authorizer}",
      },
    },
  ],
};
