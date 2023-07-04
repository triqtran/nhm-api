export default {
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        in: 'header',
        name: 'Authorization',
        description: 'Need only token',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Student: {
        type: 'object',
        properties: {
          first_name: {
            type: 'string',
            description: 'First Name',
            example: 'Donald',
          },
          last_name: {
            type: 'string',
            description: 'Last Name',
            example: 'Trump',
          },
          birthday: {
            type: 'date',
            description: 'Birthday',
            example: '03/02/2009',
          },
          email: {
            type: 'string',
            description: 'Email',
            example: '@',
          },
          phone: {
            type: 'string',
            description: 'Phone',
            example: '012345679',
          },
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
    },
  },
  security: [{ bearerAuth: [] }],
};
