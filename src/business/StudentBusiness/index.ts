import StudentsDAL from 'dals/StudentsDAL';
import {
  OwnerScheduleRequest,
  OwnerCourseRequest,
  RegisterRequest,
  SignInRequest,
  OwnerProfileResponse,
  UpdateRequest,
  ListStudentsResponse,
  HomeResponse,
} from './types';
import Students from 'models/Students';
import AyotreeServices from 'requests/ayotrees/AyotreeServices';
import { Paging } from '@tsenv';
import BookDAL from 'dals/BookDAL';
import GameExerciseDAL from 'dals/GameExerciseDAL';
import LessonsDAL from 'dals/LessonsDAL';

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
  logout: (student_id: number) => Promise<number>;
  getHomeResource: (id: number) => Promise<any>;
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
  logout(student_id: number): Promise<number> {
    return StudentsDAL.removeStudentDeviceToken(student_id);
  }

  getHomeResource(id: number): Promise<HomeResponse> {
    return StudentsDAL.getStudentById(id).then(student => {
      return Promise.allSettled([
        BookDAL.getBookStudentLastest(id),
        GameExerciseDAL.getGameStudentLastest(id),
        LessonsDAL.getUpcomingClass(student.ayotree_course_code),
      ]).then(([book, game_exercise, lessons]) => {
        const data = {
          book: null,
          game_exercise: null,
          lessons: null,
        } as HomeResponse;
        // book
        if (book.status === 'fulfilled' && book.value) {
          const bookData = book.value;
          data.book = {
            book_id: bookData?.book_id,
            name: bookData?.book_info.name,
            url_file: bookData?.book_info.url_file,
            background_image: bookData?.book_info.background_image,
            level: bookData?.book_info.level,
          };
          if (bookData?.book_info.total_chapters)
            data.book.process =
              (bookData.current_chapter / bookData.book_info.total_chapters) *
              100;
        }

        // game exercise
        if (game_exercise.status === 'fulfilled' && game_exercise.value) {
          const gameData = game_exercise.value;
          data.game_exercise = {
            game_exercise_id: gameData?.game_exercise_id,
            name: gameData?.game_info.name,
            background_image: gameData?.game_info.background_image,
            type: gameData?.game_info.type,
            gameLevel: gameData?.game_info.level,
            currentLevel: gameData?.level,
          };
          if (gameData?.game_info.stars_to_win)
            data.game_exercise.process =
              (gameData.total_correct_answers /
                gameData.game_info.stars_to_win) *
              100;
        }

        // lessons
        if (lessons.status === 'fulfilled' && lessons.value) {
          const lessonData = lessons.value;
          data.lessons = {
            course_title: lessonData.CourseTitle,
            course_code: lessonData.CourseCode,
            lesson_start: lessonData.LessonStart,
          };
        }
        return data;
      });
    });
  }
}

export default new StudentBusiness();
