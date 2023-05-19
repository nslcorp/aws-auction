//https://json-schema.org/draft/2020-12/json-schema-validation.html#name-introduction
export default {
  type: "object",
  properties: {
    title: { type: 'string', minimum: 0}
  },
  required: ['title'],
} as const;
