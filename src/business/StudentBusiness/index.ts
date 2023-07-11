import StudentsDAL from 'dals/StudentsDAL';
import {
  OwnerScheduleRequest,
  OwnerCourseRequest,
  RegisterRequest,
  SignInRequest,
  OwnerProfileResponse,
  UpdateRequest,
  ListStudentsResponse,
  ConfirmPasswordRequest,
} from './types';
import Students from 'models/Students';
import AyotreeServices from 'requests/ayotrees/AyotreeServices';
import { Paging } from '@tsenv';
import BookDAL from 'dals/BookDAL';
import GameExerciseDAL from 'dals/GameExerciseDAL';
import LessonsDAL from 'dals/LessonsDAL';
import mailer from 'utils/mailer';
import helpers from 'utils/helpers';

interface IStudentBusiness {
  // student owner
  getHomeScreenData: (student: Students) => Promise<OwnerProfileResponse>;
  signIn: (data: SignInRequest) => Promise<Students>;
  register: (data: RegisterRequest) => Promise<Students>;
  getProfile: (id: number) => Promise<OwnerProfileResponse>;
  getSchedules: (data: OwnerScheduleRequest) => void;
  getCampus: (data: OwnerCourseRequest) => void;
  update: (id: number, data: UpdateRequest) => Promise<Students>;
  list: (paging: Paging) => Promise<ListStudentsResponse>;
  getById: (id: number) => Promise<Students>;
  logout: (student_id: number) => Promise<number>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (data: ConfirmPasswordRequest) => Promise<any>;
}

class StudentBusiness implements IStudentBusiness {
  getHomeScreenData(student: Students): Promise<OwnerProfileResponse> {
    const responseStudent = student as OwnerProfileResponse;
    if (!student || student.status === 'suspended') {
      return Promise.resolve(responseStudent);
    }
    return Promise.allSettled([
      BookDAL.getBookStudentLatest(student.id),
      GameExerciseDAL.getGameStudentLatest(student.id),
      LessonsDAL.getUpcomingClass(student.ayotree_course_code),
    ]).then(([book, game_exercise, lessons]) => {
      responseStudent.learning_journey = {
        latest_book: null,
        latest_exercise: null,
        short_schedule: null,
      };

      responseStudent.learning_journey.latest_book = (() => {
        if (book.status === 'fulfilled' && book.value) {
          return {
            id: book.value.book_id,
            title: book.value.book_info.name,
            image: book.value.book_info.background_image,
          };
        }
        return null;
      })();

      responseStudent.learning_journey.latest_exercise = (() => {
        if (game_exercise.status === 'fulfilled' && game_exercise.value) {
          return {
            id: game_exercise.value.game_exercise_id,
            title: game_exercise.value.game_info.name,
            image: game_exercise.value.game_info.background_image,
          };
        }
        return null;
      })();

      responseStudent.learning_journey.short_schedule = (() => {
        if (lessons.status === 'fulfilled' && lessons.value) {
          return {
            course_title: lessons.value.CourseTitle,
            date: helpers.getDateString(lessons.value.LessonStart),
            time: helpers.getTimeString(lessons.value.LessonStart),
          };
        }
        return null;
      })();

      return responseStudent;

      // if (!student.ayotree_student_id || !student.ayotree_campus_id) {
      //   return responseStudent;
      // }

      // return AyotreeServices.inst()
      //   .getStudentViaId({
      //     student: {
      //       StudentID: student.ayotree_student_id,
      //       CampusID: student.ayotree_campus_id,
      //     },
      //   })
      //   .then(ayotreeResult => {
      //     const splitCourse = ayotreeResult?.Course?.split('|')?.map(item =>
      //       item.trim()
      //     );
      //     let courseCode: string | undefined = '';
      //     if (splitCourse) courseCode = splitCourse.pop();
      //     if (courseCode && courseCode !== student.ayotree_course_code) {
      //       return StudentsDAL.updateStudentById(
      //         {
      //           ayotree_course_code: courseCode,
      //           ayotree_course_title: splitCourse?.join(' '),
      //         },
      //         student.id
      //       ).then(() => ayotreeResult);
      //     }
      //     return ayotreeResult;
      //   })
      //   .then(ayotreeResult => {
      //     responseStudent.ayotree_profile = ayotreeResult;
      //     return responseStudent;
      //   });
    });
  }

  signIn(data: SignInRequest): Promise<OwnerProfileResponse> {
    return StudentsDAL.signInStudent(data.user_name, data.password)
      .then(student => {
        const responseData = this.getHomeScreenData(student);
        if (student && data.device_token)
          return StudentsDAL.upsertStudentDeviceToken(
            student.id,
            data.device_token
          ).then(() => responseData);
        return responseData;
      })
      .catch(err => {
        throw err;
      });
  }
  register(data: RegisterRequest): Promise<Students> {
    return StudentsDAL.addNewStudent(data);
  }
  getProfile(id: number): Promise<OwnerProfileResponse> {
    return StudentsDAL.getStudentById(id).then(student =>
      this.getHomeScreenData(student)
    );
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
  logout(student_id: number): Promise<number> {
    return StudentsDAL.removeStudentDeviceToken(student_id);
  }

  forgotPassword(email: string): Promise<string> {
    if (!email) return Promise.reject('Can not found email!');
    return mailer
      .sendEmailForgotPassword(email)
      .then(() => 'Your new password is sent into your email');
  }

  resetPassword({
    email,
    confirm_code,
    password,
  }: ConfirmPasswordRequest): Promise<any> {
    return StudentsDAL.getStudentByMail(email).then(student => {
      if (!student)
        return Promise.reject('Can not find student for this email!');
      if (student.confirm_code === confirm_code) {
        return Promise.reject('Your verified code is invalid!');
      }
      return StudentsDAL.updateStudentById(
        {
          password,
        },
        student.id
      );
    });
  }
}

export default new StudentBusiness();
