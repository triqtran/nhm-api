import cron, { ScheduleOptions } from 'node-cron';
import StudentsDAL from 'dals/StudentsDAL';
import AyotreeServices from 'requests/ayotrees/AyotreeServices';
import config from '@config';
import { AyotreeLesson } from 'requests/ayotrees/AyotreeTypes';

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
    listCampus.forEach(campus => {
      updateTxs.push(
        AyotreeServices.inst()
          .listCoursesByCampusIdAndTimezone({
            course: {
              CampusID: campus.CampusID,
              TimeZone: config.AYOTREE_TIMEZONE,
            },
          })
          .then(async courses => {
            // TODO: Update Courses into database
            //
            //

            const lessonsTxs = [] as Promise<void>[];
            courses.forEach(course => {
              lessonsTxs.push(
                AyotreeServices.inst()
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
                  .then(lessons => {
                    // TODO: Update Lessons into database
                    //
                    //
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
  '*/10 * * * * *',
  scheduleUpdateCourseAndLesionAction,
  scheduleOptions
);

export { updateCourseAndLesionScheduler };
