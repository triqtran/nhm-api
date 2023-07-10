import StudentsDAL from 'dals/StudentsDAL';
import {
  OwnerScheduleRequest,
  OwnerCourseRequest,
  RegisterRequest,
  SignInRequest,
  OwnerProfileResponse,
  UpdateRequest,
  ListStudentsResponse,
} from './types';
import Students from 'models/Students';
import AyotreeServices from 'requests/ayotrees/AyotreeServices';
import { Paging } from '@tsenv';

interface IStudentBusiness {
  // student owner
  signIn: (data: SignInRequest) => Promise<Students>;
  register: (data: RegisterRequest) => Promise<Students>;
  getProfile: (id: number) => Promise<OwnerProfileResponse>;
  getSchedules: (data: OwnerScheduleRequest) => void;
  getCampus: (data: OwnerCourseRequest) => void;
  update: (id: number, data: UpdateRequest) => Promise<Students>;
  list: (paging: Paging) => Promise<ListStudentsResponse>;
  getById: (id: number) => Promise<Students>;
  logout: (student_id: number) => Promise<any>;
}

class StudentBusiness implements IStudentBusiness {
  signIn(data: SignInRequest): Promise<Students> {
    return StudentsDAL.signInStudent(data.user_name, data.password)
      .then(student => {
        if (student && data.device_token)
          return StudentsDAL.upsertStudentDeviceToken(
            student.id,
            data.device_token
          ).then(() => student as Students);
        return student as Students;
      })
      .catch(err => {
        throw err;
      });
  }
  register(data: RegisterRequest): Promise<Students> {
    return StudentsDAL.addNewStudent(data);
  }
  getProfile(id: number): Promise<OwnerProfileResponse> {
    return StudentsDAL.getStudentById(id).then(student => {
      const responseStudent = student as OwnerProfileResponse;
      if (
        student.status === 'suspended' ||
        !student.ayotree_student_id ||
        !student.ayotree_campus_id
      ) {
        return responseStudent;
      }

      return AyotreeServices.inst()
        .getStudentViaId({
          student: {
            StudentID: student.ayotree_student_id,
            CampusID: student.ayotree_campus_id,
          },
        })
        .then(ayotreeResult => {
          const splitCourse = ayotreeResult?.Course?.split('|')?.map(item =>
            item.trim()
          );
          let courseCode: string | undefined = '';
          if (splitCourse) courseCode = splitCourse.pop();
          if (courseCode && courseCode !== student.ayotree_course_code) {
            return StudentsDAL.updateStudentById(
              {
                ayotree_course_code: courseCode,
                ayotree_course_title: splitCourse?.join(' '),
              },
              student.id
            ).then(() => ayotreeResult);
          }
          return ayotreeResult;
        })
        .then(ayotreeResult => {
          responseStudent.ayotree_profile = ayotreeResult;
          return responseStudent;
        });
    });
  }
  getSchedules(req: OwnerScheduleRequest): void {}
  getCampus(req: OwnerCourseRequest): void {}
  update(id: number, data: UpdateRequest): Promise<Students> {
    return StudentsDAL.updateStudentById(data, id);
  }
  list(paging: Paging): Promise<ListStudentsResponse> {
    return StudentsDAL.listStudents(paging);
  }
  getById(id: number): Promise<Students> {
    return StudentsDAL.getStudentById(id);
  }
  logout(student_id: number): Promise<any> {
    return Promise.resolve(true);
  }
}

export default new StudentBusiness();
