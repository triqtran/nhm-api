import login from './login';
import getProfile from './getProfile';
import register from './register';
import { genURLSwagger } from 'swaggerDocs/utils';

const path = '/student-users/';

export default {
  [genURLSwagger(path, 'signup')]: {
    ...register,
  },
  [genURLSwagger(path, 'login')]: {
    ...login,
  },
  [genURLSwagger(path, 'profile')]: {
    ...getProfile,
  },
};
