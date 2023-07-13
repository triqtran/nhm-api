import Courses from 'models/Courses';

const throwError =
  (funcName: string) =>
  (errMessage = 'Method not implemented.') => {
    console.error(`[CoursesDAL.${funcName}]`, errMessage);
    throw errMessage;
  };

const throwNewError = (err = 'Error not implemented.') => {
  throw new Error(err);
};

interface ICoursesDAL {
  upsert(data: any): Promise<Courses>;
}

class CoursesDAL implements ICoursesDAL {
  upsert(data: any): Promise<Courses> {
    return Courses.upsert(data)
      .then(course => {
        if (course.length > 0 && course[0]) return course[0];
        return throwNewError('Can not upsert courses');
      })
      .catch(throwError('upsert'));
  }
}

export default new CoursesDAL();
