import { Request, Response, NextFunction } from 'express';
import IStudentControllers, {
  StudentUserBodyReq,
  StudentUserParamsReq,
  StudentUserSignInBodyReq,
} from './interfaces';
import { ErrorStruct } from '@tsenv';
import jwtResponse from 'middlewares/jwtResponse';
import { StudentBusiness } from 'business';
import { RegisterRequest } from 'business/StudentBusiness/types';

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
  MISSING_INPUT: {
    code: 'error',
    show: 'Missing input',
  } as ErrorStruct,
  MISSING_USER_NAME_OR_PASSWORD: {
    code: 'error',
    show: 'Missing user_name or password',
  } as ErrorStruct,
  WRONG_USER_NAME_OR_PASSWORD: {
    code: 'error',
    show: 'Your user_name or password is wrong',
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
    const { user_name, password, device_token } = req.body;
    if (!user_name || !password) {
      return res.responseAppError(errors.MISSING_USER_NAME_OR_PASSWORD);
    }
    StudentBusiness.signIn({ user_name, password, device_token })
      .then(student => {
        if (!student) {
          return res.responseAppError(errors.WRONG_USER_NAME_OR_PASSWORD);
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
    if (!data.user_name || !data.password) {
      return res.responseAppError(errors.MISSING_USER_NAME_OR_PASSWORD);
    }
    StudentBusiness.register(data)
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
    StudentBusiness.getProfile(req.userDecoded.id)
      .then(student => {
        if (student.status === 'suspended') {
          return res.responseAppError(errors.STUDENT_USER_IS_DISABLED);
        }
        res.responseSuccess(student);
      })
      .catch(err => res.responseAppError(err));
  }
  addNewStudent(req: Request, res: Response, next: NextFunction): void {
    const data: RegisterRequest = req.body;
    if (
      !data.user_name ||
      !data.password ||
      !data.email ||
      !data.first_name ||
      !data.last_name
    ) {
      return res.responseAppError(errors.MISSING_INPUT);
    }
    StudentBusiness.register(data)
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
    StudentBusiness.update(req.params.id, req?.body)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }

  listStudents(req: Request, res: Response, next: NextFunction): void {
    StudentBusiness.list(req.paging)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }

  getStudentById(
    req: Request<StudentUserParamsReq>,
    res: Response,
    next: NextFunction
  ): void {
    StudentBusiness.getById(req.params.id)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }

  homeResource(req: Request, res: Response, next: NextFunction): void {
    StudentBusiness.getHomeResource(req.userDecoded.id)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }

  logout(req: Request, res: Response, next: NextFunction): void {
    StudentBusiness.logout(req.userDecoded.id)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }
}

export default new StudentUsersController();
