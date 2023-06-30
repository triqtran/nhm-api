import { Request, Response, NextFunction } from 'express';
import { StudentsDAL } from 'dals';
import IStudentControllers, {
  StudentUserBodyReq,
  StudentUserParamsReq,
  StudentUserSignInBodyReq,
} from './interfaces';
import { ErrorStruct } from '@tsenv';
import jwtResponse from 'middlewares/jwtResponse';
import AyotreeServices from 'requests/ayotrees/AyotreeServices';

const errors = {
  STUDENT_USER_IS_DISABLED: {
    code: 'error',
    show: 'This student was disabled!',
  } as ErrorStruct,
  WRONG_EMAIL_OR_PASSWORD: {
    code: 'error',
    show: 'Your email or password is wrong',
  } as ErrorStruct,
  MISSING_EMAIL_OR_PASSWORD: {
    code: 'error',
    show: 'Missing email or password',
  } as ErrorStruct,
  CAN_NOT_SIGN_UP_NEW_STUDENT: {
    code: 'error',
    show: 'Can not sign up new student',
  } as ErrorStruct,
  CAN_NOT_PERFORM_THIS_ACTION: {
    code: 'error',
    show: 'You can not perform this action',
  } as ErrorStruct,
};

class StudentUsersController implements IStudentControllers {
  signInStudent(
    req: Request<any, StudentUserSignInBodyReq>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): void {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.responseAppError(errors.MISSING_EMAIL_OR_PASSWORD);
    }
    StudentsDAL.signInStudent(email, password)
      .then(student => {
        if (!student) {
          return res.responseAppError(errors.WRONG_EMAIL_OR_PASSWORD);
        }
        if (student.status === 'suspended') {
          return res.responseAppError(errors.STUDENT_USER_IS_DISABLED);
        }
        const token = jwtResponse.generate({
          id: student.id,
          name: `${student.first_name} ${student.last_name}`,
          type: 'student',
          email: student.email,
          phone: student.phone,
        });

        res.responseSuccess({ data: student, token });
      })
      .catch(err => res.responseAppError(err));
  }

  signUpStudent(
    req: Request<any, StudentUserBodyReq>,
    res: Response,
    next: NextFunction
  ): void {
    const data = req.body;
    StudentsDAL.addNewStudent(data)
      .then(student => {
        if (!student) {
          return res.responseAppError(errors.CAN_NOT_SIGN_UP_NEW_STUDENT);
        }
        const token = jwtResponse.generate({
          id: student.id,
          name: `${student.first_name} ${student.last_name}`,
          type: 'student',
          email: student.email,
          phone: student.phone,
        });
        res.responseSuccess({ data: student, token });
      })
      .catch(err => res.responseAppError(err));
  }
  getStudentOwnProfile(req: Request, res: Response, next: NextFunction): void {
    StudentsDAL.getStudentById(req.userDecoded.id)
      .then(student => {
        if (student.status === 'suspended') {
          return res.responseAppError(errors.STUDENT_USER_IS_DISABLED);
        }
        if (student.ayotree_student_id && student.ayotree_campus_id) {
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
            .then(ayotreeResult =>
              res.responseSuccess({
                ...student,
                ayotree_profile: ayotreeResult,
              })
            );
        }
        res.responseSuccess(student);
      })
      .catch(err => res.responseAppError(err));
  }
  addNewStudent(req: Request, res: Response, next: NextFunction): void {
    StudentsDAL.addNewStudent(req)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }

  updateStudent(
    req: Request<StudentUserParamsReq, StudentUserBodyReq>,
    res: Response,
    next: NextFunction
  ): void {
    if (
      req.params.id != req.userDecoded.id &&
      !['teacher', 'admin'].includes(req.userDecoded.type)
    ) {
      return res.responseAppError(errors.CAN_NOT_PERFORM_THIS_ACTION);
    }
    StudentsDAL.updateStudentById(req?.body, req.params.id)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }

  listStudents(req: Request, res: Response, next: NextFunction): void {
    StudentsDAL.listStudentsByCourse(req.paging)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }

  getStudentById(
    req: Request<StudentUserParamsReq>,
    res: Response,
    next: NextFunction
  ): void {
    StudentsDAL.getStudentById(req.params.id)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }
}

export default new StudentUsersController();
