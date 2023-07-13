import { TAGS_NAME } from 'swaggerDocs/utils';

export default {
  post: {
    tags: [TAGS_NAME.ACCOUNT],
    description: 'Login',
    operationId: 'login',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                example: 'test',
              },
              password: {
                type: 'string',
                example: 'test123',
              },
            },
          },
        },
      },
    },

    // expected responses
    responses: {
      // response code
      // 200: {
      //   description: 'Login successful', // response desc.
      //   content: {
      //     'application/json': {
      //       schema: {
      //         type: 'object',
      //         properties: {
      //           success: {
      //             type: 'boolean',
      //             example: 'true',
      //           },
      //           data: {
      //             type: 'object',
      //             example: {
      //               id: 1,
      //               first_name: 'Test',
      //               last_name: 'Nguyen',
      //               birthday: '01/01/2010',
      //               email: '....@....com',
      //               phone: '0654721145',
      //               status: 'registered',
      //               user_name: 'test',
      //               ayotree_student_id: 12345,
      //               ayotree_campus_id: 5694,
      //               ayotree_course_code: 'Code001',
      //               ayotree_course_title: 'Title Course',
      //               created_at: '2023-07-01 01:05:24',
      //               updated_at: '2023-07-03 14:41:11',
      //             },
      //           },
      //           token: {
      //             type: 'string',
      //             example: 'eyJhbGciOiJIUzI1NiIsI...',
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
      // 400: {
      //   description: 'Login fail',
      //   content: {
      //     'application/json': {
      //       schema: {
      //         type: 'object',
      //         properties: {
      //           success: {
      //             type: 'boolean',
      //             example: 'false',
      //           },
      //           error: {
      //             type: 'object',
      //             example: {
      //               code: 'error',
      //               show: 'Your user_name or password is wrong',
      //               error: 'Your user_name or password is wrong',
      //             },
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
    },
  },
};
