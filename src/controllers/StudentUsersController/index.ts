import { Request, Response, NextFunction } from "express";
import { StudentUsersDAL } from 'dals';
import IStudentControllers, {
  StudentUserBodyReq,
  StudentUserParamsReq,
  StudentUserSignInBodyReq,
} from "./interfaces";
import { ErrorStruct } from "@tsenv";

const errors = {
  STUDENT_USER_IS_DISABLED: {
    code: 'error',
    show: 'This student was disabled!',
  } as ErrorStruct
}

class StudentUsersController implements IStudentControllers {
  signInStudent(
    req: Request<any, StudentUserSignInBodyReq>,
    res: Response<any, Record<string, any>>,
    next: NextFunction,
  ): void {

  };
  signUpStudent(
    req: Request<any, StudentUserBodyReq>,
    res: Response,
    next: NextFunction,
  ): void {

  };
  getStudentOwnProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    StudentUsersDAL.getStudentById(req.userDecoded.id)
      .then(student => {
        if (student.status === 'disabled') {
          return res.responseAppError(errors.STUDENT_USER_IS_DISABLED)
        }
        res.responseSuccess(student)
      })
      .catch(err => res.responseAppError(err));
  };
  addNewStudent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    StudentUsersDAL.addNewStudent(req)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  };

  updateStudent(
    req: Request<StudentUserParamsReq, StudentUserBodyReq>,
    res: Response,
    next: NextFunction
  ): void {
    StudentUsersDAL.updateStudentById(req?.body, req.params.id)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  };

  listStudents(req: Request, res: Response, next: NextFunction): void {
    StudentUsersDAL.listStudentsByCourse(req)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  };

  getStudentById(
    req: Request<StudentUserParamsReq>,
    res: Response,
    next: NextFunction,
  ): void {
    StudentUsersDAL.getStudentById(req.params.id)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  };
}

export default new StudentUsersController();