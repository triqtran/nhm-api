export default {
  // method of operation
  post: {
    tags: ['Todo CRUD operations'], // operation's tag.
    description: 'Get todos', // operation's desc.
    operationId: 'getTodos', // unique operation id.
    parameters: [
      {
        name: 'user_name', // name of the param
        in: 'body', // location of the param
        schema: {
          $ref: '#/components/schemas/Account/properties/user_name', // data model of the param
        },
        required: true, // Mandatory param
        description: 'User name', // param desc.
      },
      {
        name: 'password', // name of the param
        in: 'body', // location of the param
        schema: {
          $ref: '#/components/schemas/Account/properties/password', // data model of the param
        },
        required: true, // Mandatory param
        description: 'Password', // param desc.
      },
    ], // expected params.
    // expected responses
    responses: {
      // response code
      200: {
        description: 'Todos were obtained', // response desc.
        content: {
          // content-type
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Account', // Todo model
            },
          },
        },
      },
    },
  },
};
