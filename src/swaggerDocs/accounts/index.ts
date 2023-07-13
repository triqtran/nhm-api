import login from './login';
import getProfile from './getProfile';
import { genURLSwagger } from 'swaggerDocs/utils';

const path = '/nhm-accounts/';

export default {
  [genURLSwagger(path, 'login')]: {
    ...login,
  },
  [genURLSwagger(path, 'profile')]: {
    ...getProfile,
  },
};
