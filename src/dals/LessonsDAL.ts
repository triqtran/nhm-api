import Lessons from 'models/Lessons';
import { Op } from 'sequelize';

const throwError =
  (funcName: string) =>
  (errMessage = 'Method not implemented.') => {
    console.error(`[LessonsDAL.${funcName}]`, errMessage);
    throw errMessage;
  };

const throwNewError = (err = 'Error not implemented.') => {
  throw new Error(err);
};

interface ILessonsDAL {
  getUpcomingClass(course_code?: string): Promise<Lessons[]>;
  upsert(data: any): Promise<Lessons>;
}

class LessonsDAL implements ILessonsDAL {
  getUpcomingClass(course_code?: string): Promise<Lessons[]> {
    if (!course_code) throwNewError('Not find course code');
    return Lessons.findAll({
      where: {
        CourseCode: course_code,
        LessonStart: {
          [Op.gt]: new Date(),
        },
      },
      limit: 3,
      order: [['LessonStart', 'desc']],
    }).catch(throwError('getUpcomingClass'));
  }

  upsert(data: any): Promise<Lessons> {
    return Lessons.upsert(data)
      .then(lesson => {
        if (lesson.length > 0 && lesson[0]) return lesson[0];
        return throwNewError('Can not upsert lessons');
      })
      .catch(throwError('upsert'));
  }
}

export default new LessonsDAL();
