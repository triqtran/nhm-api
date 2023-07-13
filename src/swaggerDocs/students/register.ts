import { TAGS_NAME } from "swaggerDocs/utils";

export default {
  post: {
    tags: [TAGS_NAME.STUDENT],
    description: 'Register student',
    operationId: 'registerStudent',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Student',
          },
        },
      },
    },
    responses: {},
  },
};
