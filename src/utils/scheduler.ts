import cron, { ScheduleOptions } from 'node-cron';
import StudentsDAL from 'dals/StudentsDAL';
import AyotreeServices from 'requests/ayotrees/AyotreeServices';
import config from '@config';
import CoursesDAL from 'dals/CoursesDAL';
import Courses from 'models/Courses';
import Lessons from 'models/Lessons';
import LessonsDAL from 'dals/LessonsDAL';

const scheduleOptions: ScheduleOptions = {
  scheduled: false,
  timezone: 'Asia/Ho_Chi_Minh',
};

const scheduleUpdateCourseAndLesionAction = async () => {
  const currentDate = new Date();
  console.log(
    `Run schedule Update Course And Lesion Action - ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`
  );

  if (currentDate.getHours() === 1) {
    const listCampus = await StudentsDAL.getCampusList();
    if (!listCampus?.length) return;
    const updateTxs = [] as Promise<void>[];
    const ayotreeService = AyotreeServices.inst();
    listCampus.forEach(campus => {
      updateTxs.push(
        ayotreeService
          .listCoursesByCampusIdAndTimezone({
            course: {
              CampusID: campus.CampusID,
              TimeZone: config.AYOTREE_TIMEZONE,
            },
          })
          .then(async courses => {
            // TODO: Update Courses into database
            //
            const upsertCoursesTxs: Promise<Courses>[] = [];

            courses.forEach(course => {
              upsertCoursesTxs.push(CoursesDAL.upsert(course));
            });

            await Promise.allSettled(upsertCoursesTxs);

            const lessonsTxs: Promise<void>[] = [];
            courses.forEach(course => {
              lessonsTxs.push(
                ayotreeService
                  .listLessonsByCampusIdAndTeacher({
                    schedule: {
                      CampusID: campus.CampusID,
                      courseInfo: {
                        courseCode: course.CourseCode,
                      },
                      TimeZone: config.AYOTREE_TIMEZONE,
                      lessonInfo: {
                        StartDate: course.StartDate,
                        EndDate: course.EndDate,
                      },
                    },
                  })
                  .then(async lessons => {
                    // TODO: Update Lessons into database
                    //
                    const upsertLessonsTxs: Promise<Lessons>[] = [];
                    lessons.forEach(lesson => {
                      upsertLessonsTxs.push(LessonsDAL.upsert(lesson));
                    });

                    await Promise.allSettled(upsertLessonsTxs);
                  })
              );
            });
            await Promise.allSettled(lessonsTxs);
          })
      );
    });
    await Promise.allSettled(updateTxs);
  }
};

const updateCourseAndLesionScheduler = cron.schedule(
  '0 * * * *',
  scheduleUpdateCourseAndLesionAction,
  scheduleOptions
);

export { updateCourseAndLesionScheduler };
