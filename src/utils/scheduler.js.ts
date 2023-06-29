import cron, { ScheduleOptions } from 'node-cron';
import StudentsDAL from 'dals/StudentsDAL';

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
    console.log('listCampus', listCampus);
  }
};

const updateCourseAndLesionScheduler = cron.schedule(
  '*/10 * * * * *',
  scheduleUpdateCourseAndLesionAction,
  scheduleOptions
);

export { updateCourseAndLesionScheduler };
