//https://json-schema.org/draft/2020-12/json-schema-validation.html#name-introduction
export default {
  title: "Product",
  description: "A product from Acme's catalog",
  type: "object",
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        status: {
          type: "string",
          description: "Order status",
          enum: ["OPEN", "CLOSED"],
          // default: "OPEN",
        },
      },
      required: ['status']
    },
  },
  required: ["queryStringParameters"],
} as const;
