export default {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        amount: { type: "number" },
      },
      required: ["amount"],
    },
    pathParameters: {
      type: "object",
      properties: {
        id: { type: "string" },
      },
      required: ["id"],
      errorMessage: 'abcd error'
    },
  },
  required: ["body", "pathParameters"],
} as const;
