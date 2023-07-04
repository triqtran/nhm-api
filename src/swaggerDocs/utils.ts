const genURLSwagger = (path: string, param: string) => `${path}${param}`;

const TAGS_NAME = {
  STUDENT: 'Student APIs',
  ACCOUNT: 'Account APIs',
};

export { genURLSwagger, TAGS_NAME };
