export default {
  components: {
    schemas: {
      Account: {
        type: 'object', // data type
        properties: {
          user_name: {
            type: 'string', // data-type
            description: 'User name of student', // desc
            example: 'test', // example of an id
          },
          password: {
            type: 'string', // data-type
            description: "Password of student", // desc
            example: 'test123', // example of a title
          },
          completed: {
            type: 'boolean', // data type
            description: 'The status of the todo', // desc
            example: false, // example of a completed value
          },
        },
      },
      Student: {
        type: 'object', //data type
        properties: {
          message: {
            type: 'string', // data type
            description: 'Error message', // desc
            example: 'Not found', // example of an error message
          },
          internal_code: {
            type: 'string', // data type
            description: 'Error internal code', // desc
            example: 'Invalid parameters', // example of an error internal code
          },
        },
      },
    },
  },
};