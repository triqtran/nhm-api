import login from './login';
import getProfile from './getProfile';

const studentPath = '/student-users/';

const genURL = (param: string) => `${studentPath}${param}`;

export default {
  paths: {
    [genURL('login')]: {
      ...login,
    },
    [genURL('profile')]: {
      ...getProfile,
    },
  },
};
