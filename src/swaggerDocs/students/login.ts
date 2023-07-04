export default {
  // method of operation
  post: {
    tags: ['Todo CRUD operations'], // operation's tag.
    description: 'Get todos', // operation's desc.
    operationId: 'getTodos', // unique operation id.
    // parameters: [
    //   {
    //     name: 'user_name', // name of the param
    //     in: 'body', // location of the param
    //     schema: {
    //       $ref: '#/components/schemas/Account/properties/user_name', // data model of the param
    //     },
    //     required: true, // Mandatory param
    //     description: 'User name', // param desc.
    //   },
    //   {
    //     name: 'password', // name of the param
    //     in: 'body', // location of the param
    //     schema: {
    //       $ref: '#/components/schemas/Account/properties/password', // data model of the param
    //     },
    //     required: true, // Mandatory param
    //     description: 'Password', // param desc.
    //   },
    // ], // expected params.
    requestBody: {
      require: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/LogInRequest',
          },
        },
      },
    },
    // expected responses
    responses: {
      // response code
      200: {
        description: 'Login successful', // response desc.
        content: {
          // content-type
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LogInResponse', // Todo model
            },
          },
        },
      },
      400: {
        description: 'Login fail',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LogInReponseError',
            },
          },
        },
      },
    },
  },
};
