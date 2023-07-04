export default {
  components: {
    schemas: {
      LogInRequest: {
        type: 'object',
        properties: {
          user_name: {
            type: 'string',
            description: 'Username',
            example: 'test',
          },
          password: {
            type: 'string',
            description: 'Password',
            example: 'test123',
          },
        },
      },
      LogInResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                example: 1,
              },
              first_name: {
                type: 'string',
                example: 'Test',
              },
              last_name: {
                type: 'string',
                example: 'Nguyen',
              },
              birthday: {
                type: 'string',
                example: '01/01/2010',
              },
              email: {
                type: 'string',
                example: '@',
              },
              phone: {
                type: 'string',
                example: '0654721145',
              },
              status: {
                type: 'string',
                example: 'registered',
              },
              user_name: {
                type: 'string',
                example: 'test',
              },
              ayotree_student_id: {
                type: 'integer',
                example: 13245,
              },
              ayotree_campus_id: {
                type: 'integer',
                example: 5604,
              },
              ayotree_course_code: {
                type: 'string',
                example: 'Code001',
              },
              ayotree_course_title: {
                type: 'string',
                example: 'Title Course',
              },
              created_at: {
                type: 'time',
                example: '2023-07-01 01:05:24',
              },
              updated_at: {
                type: 'time',
                example: '2023-07-03 14:41:11',
              },
            },
          },
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsI...',
          },
        },
      },
      LogInReponseError: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                example: 'error',
              },
              error: {
                type: 'string',
                example: 'Your user_name or password is wrong',
              },
              show: {
                type: 'string',
                example: 'Your user_name or password is wrong',
              },
            },
          },
        },
      },
    },
  },
};
