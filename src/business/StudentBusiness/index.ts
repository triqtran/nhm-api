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
}

class StudentBusiness implements IStudentBusiness {
  signIn(data: SignInRequest): Promise<Students> {
    return StudentsDAL.signInStudent(data.email, data.password);
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
          const splitCourse = ayotreeResult?.Course?.split('|');
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
}

export default new StudentBusiness();
