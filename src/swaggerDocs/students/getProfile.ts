import { TAGS_NAME } from 'swaggerDocs/utils';

export default {
  get: {
    tags: [TAGS_NAME.STUDENT],
    description: 'Get Profile',
    operationId: 'getProfile',
    security: [{ studentAuth: [] }],
    // expected responses
    responses: {
      //   // response code
      //   200: {
      //     description: 'Get student profile successful', // response desc.
      //     content: {
      //       'application/json': {
      //         schema: {
      //           type: 'object',
      //           properties: {
      //             success: {
      //               type: 'boolean',
      //               example: 'true',
      //             },
      //             data: {
      //               type: 'object',
      //               example: {
      //                 id: 1,
      //                 first_name: 'Test',
      //                 last_name: 'Nguyen',
      //                 birthday: '01/01/2010',
      //                 email: '....@....com',
      //                 phone: '0654721145',
      //                 status: 'registered',
      //                 user_name: 'test',
      //                 ayotree_student_id: 12345,
      //                 ayotree_campus_id: 5694,
      //                 ayotree_course_code: 'Code001',
      //                 ayotree_course_title: 'Title Course',
      //                 created_at: '2023-07-01 01:05:24',
      //                 updated_at: '2023-07-03 14:41:11',
      //                 ayotree_profile: {
      //                   UserID: 12345,
      //                   StudentID: 5694,
      //                   PIN: '131231',
      //                   TimeZone: 'SE Asia Standard Time',
      //                   Title: '',
      //                   AvataURL: 'url',
      //                   FirstName: 'Test',
      //                   MiddleInitail: '',
      //                   LastName: 'Nguyen',
      //                   FullName: 'Nguyen Test',
      //                   Email: '@',
      //                   Phone: '',
      //                   Gender: 'Male',
      //                   Birthday: 'Dec 21, 1991',
      //                   TaxNumber: '',
      //                   AdditionalContact: '',
      //                   Nationality: 'Vietnam',
      //                   Address1: '',
      //                   Address2: '',
      //                   Country: '',
      //                   City: '',
      //                   State: '',
      //                   ZipCode: '',
      //                   Course: 'itle Course` | Code001',
      //                   Package: '',
      //                   Status: 'Active',
      //                 },
      //               },
      //             },
      //           },
      //         },
      //       },
      //     },
      //   },
      //   400: {
      //     description: 'Get student profile fail',
      //     content: {
      //       'application/json': {
      //         schema: {
      //           type: 'object',
      //           properties: {
      //             success: {
      //               type: 'boolean',
      //               example: 'false',
      //             },
      //             error: {
      //               type: 'object',
      //               example: {
      //                 code: 'error',
      //                 show: 'Not found authentication token!',
      //                 error: 'Not found authentication token!',
      //               },
      //             },
      //           },
      //         },
      //       },
      //     },
      //   },
    },
  },
};
