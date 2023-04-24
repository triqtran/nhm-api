import config from "@config";
import AxiosServices from "../services"
import {
  AyotreeAvailabilityTeacher,
  AyotreeCampus,
  AyotreeClassroom,
  AyotreeCourse,
  AyotreeLesson,
  AyotreeStudent,
  AyotreeTimezone,
  AyotreeUser,
  GetStudentViaStudentIDRequest,
  GetStudentViaStudentIDResponse,
  GetTeacherTeachingAvailabilityScheduleRequest,
  GetTeacherTeachingAvailabilityScheduleResponse,
  ListAllCampusResponse,
  ListAllTimezonesResponse,
  ListClassroomByCampusIDRequest,
  ListClassroomByCampusIDResponse,
  ListCourseByCampusTimezoneRequest,
  ListCourseByCampusTimezoneResponse,
  ListLessonsByCampusTeacherPINRequest,
  ListLessonsByCampusTeacherPINResponse,
  ListStudentsByCampusIDRequest,
  ListStudentsByCampusIDResponse,
  ListUsersByTypeRequest,
  ListUsersByTypeResponse,
} from "./AyotreeTypes";

interface IAyotreeServices {
  listAllTimezones: () => Promise<Array<AyotreeTimezone>>;
  listAllCampus: () => Promise<Array<AyotreeCampus>>;
  listClassroomsByCampusId: (
    req: ListClassroomByCampusIDRequest
  ) => Promise<Array<AyotreeClassroom>>;
  listCoursesByCampusIdAndTimezone: (
    req: ListCourseByCampusTimezoneRequest
  ) => Promise<Array<AyotreeCourse>>;
  listLessonsByCampusIdAndTeacher: (
    req: ListLessonsByCampusTeacherPINRequest
  ) => Promise<Array<AyotreeLesson>>;
  listStudentsByCampusId: (
    req: ListStudentsByCampusIDRequest
  ) => Promise<Array<AyotreeStudent>>;
  getStudentViaId: (
    req: GetStudentViaStudentIDRequest
  ) => Promise<AyotreeStudent | null>;
  getTeacherTeachingAvailabilitySchedule: (
    req: GetTeacherTeachingAvailabilityScheduleRequest
  ) => Promise<Array<AyotreeAvailabilityTeacher>>;
  listUsersByType: (
    req: ListUsersByTypeRequest
  ) => Promise<Array<AyotreeUser>>;
}

export default class AyotreeServices implements IAyotreeServices {

  private static _inst: AyotreeServices;

  request: AxiosServices;

  private constructor () {
    this.request = new AxiosServices(config.AYOTREE_API);
  }

  static inst (): AyotreeServices {
    if (!this._inst) this._inst = new AyotreeServices();
    return this._inst;
  }

  calling<T>(
    url: string,
    body?: any,
  ): Promise<T> {
    return this.request
      .post<null, T>(url, body)
      .then(res => {
        if (res.status !== 200) throw new Error("[Ayotree] Error request!");
        return res.data;
      })
      .catch(err => { throw err });
  }

  async listAllTimezones(): Promise<Array<AyotreeTimezone>> {
    return this.calling<ListAllTimezonesResponse>(
      config.AYOTREE_GET_TIMEZONES
    )
      .then(res => res.d);
  };

  async listAllCampus(): Promise<Array<AyotreeCampus>> {
    return this.calling<ListAllCampusResponse>(
      config.AYOTREE_LIST_CAMPUSES
    )
      .then(res => res.d.ListCampus || []);
  };

  async listClassroomsByCampusId(
    req: ListClassroomByCampusIDRequest
  ): Promise<Array<AyotreeClassroom>> {
    return this.calling<ListClassroomByCampusIDResponse>(
      config.AYOTREE_LIST_CLASSROOM,
      req,
    )
      .then(res => res.d.ClassRoomList || []);
  };

  async listCoursesByCampusIdAndTimezone(
    req: ListCourseByCampusTimezoneRequest
  ): Promise<Array<AyotreeCourse>> {
    return this.calling<ListCourseByCampusTimezoneResponse>(
      config.AYOTREE_LIST_COURSES_BY_CAMPUS,
      req,
    )
      .then(res => res.d.CourseList || []);
  };

  async listLessonsByCampusIdAndTeacher(
    req: ListLessonsByCampusTeacherPINRequest
  ): Promise<Array<AyotreeLesson>> {
    return this.calling<ListLessonsByCampusTeacherPINResponse>(
      config.AYOTREE_LIST_LESSONS_BY_CAMPUS_AND_TEACHER,
      req,
    )
      .then(res => res.d.LessonList || []);
  };

  async listStudentsByCampusId(
    req: ListStudentsByCampusIDRequest
  ): Promise<Array<AyotreeStudent>> {
    return this.calling<ListStudentsByCampusIDResponse>(
      config.AYOTREE_LIST_STUDENTS_BY_CAMPUS,
      req,
    )
      .then(res => res.d.studentList || []);
  };

  async getStudentViaId(
    req: GetStudentViaStudentIDRequest
  ): Promise<AyotreeStudent | null> {
    return this.calling<GetStudentViaStudentIDResponse>(
      config.AYOTREE_GET_STUDENT_ID,
      req,
    )
      .then(res => {
        if (
          res.d.studentList
          && res.d.studentList.length > 0
        ) return res.d.studentList[0];
        return null;
      });
  };

  async getTeacherTeachingAvailabilitySchedule(
    req: GetTeacherTeachingAvailabilityScheduleRequest
  ): Promise<Array<AyotreeAvailabilityTeacher>> {
    return this.calling<
      GetTeacherTeachingAvailabilityScheduleResponse
    >(
      config.AYOTREE_GET_TEACHER_TEACHING_AVAILABILITY_SCHEDULE,
      req,
    )
      .then(res => res.d.ListAvailability || []);
  };

  async listUsersByType(
    req: ListUsersByTypeRequest
  ): Promise<Array<AyotreeUser>> {
    return this.calling<ListUsersByTypeResponse>(
      config.AYOTREE_LIST_USERS_BY_TYPE,
      req,
    )
      .then(res => res.d.userList || []);
  };
}

