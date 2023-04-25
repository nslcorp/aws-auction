export default {
  type: "object",
  properties: {
    amount: { type: 'number', error: ' amount abcd error' }
  },
  required: ['amount'],
  error: "amount some error here"
} as const;
