//https://json-schema.org/draft/2020-12/json-schema-validation.html#name-introduction
export default {
  type: "object",
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        status: { type: 'string', minimum: 1}
      }
    }
  },
  required: ['status'],
} as const;
