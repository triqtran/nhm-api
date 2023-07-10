import Lessons from 'models/Lessons';
import { Op } from 'sequelize';

interface ILessonsDAL {
  getUpcomingClass(course_code?: string): Promise<Lessons[]>;
}

class LessonsDAL implements ILessonsDAL {
  getUpcomingClass(course_code?: string): Promise<Lessons[]> {
    if (!course_code) return Promise.resolve([]);
    return Lessons.findAll({
      where: {
        CourseCode: course_code,
        LessonStart: {
          [Op.gt]: new Date(),
        },
      },
      limit: 3,
      order: [['LessonStart', 'desc']],
    });
  }
}

export default new LessonsDAL();
