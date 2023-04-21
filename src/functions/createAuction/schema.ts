export default {
  type: "object",
  properties: {
    title: { type: 'string', error: 'abcd error' }
  },
  required: ['title'],
  error: "some error here"
} as const;
