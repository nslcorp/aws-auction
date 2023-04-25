import { handlerPath } from '@libs/handler-resolver';
import schema from "./schema";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'PATCH',
        path: '/auction/{id}/bid',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};