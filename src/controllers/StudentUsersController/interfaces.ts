import { Request, NextFunction, Response } from 'express';
import { StudentStatus } from 'models/Students';

export interface StudentUserParamsReq {
  id: number;
}

export interface StudentUserBodyReq {
  first_name: string;
  last_name: string;
  email: string;
  user_name: string;
  password: string;
  phone: string;
  birthday: string;
  status?: StudentStatus;
  ayotree_student_id?: number;
  ayotree_campus_id?: number;
  ayotree_course_title?: string;
  ayotree_course_code?: string;
}

export interface StudentUserSignInBodyReq {
  user_name: string;
  password: string;
  email?: string;
}

export default interface IStudentControllers {
  // from mobile
  signInStudent: (
    req: Request<any, StudentUserSignInBodyReq>,
    res: Response,
    next: NextFunction
  ) => void;
  signUpStudent: (
    req: Request<any, StudentUserBodyReq>,
    res: Response,
    next: NextFunction
  ) => void;
  getStudentOwnProfile: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;

  // from portal
  addNewStudent: (
    req: Request<any, StudentUserBodyReq>,
    res: Response,
    next: NextFunction
  ) => void;
  updateStudent: (
    req: Request<StudentUserParamsReq, StudentUserBodyReq>,
    res: Response,
    next: NextFunction
  ) => void;
  listStudents: (req: Request, res: Response, next: NextFunction) => void;
  getStudentById: (
    req: Request<StudentUserParamsReq>,
    res: Response,
    next: NextFunction
  ) => void;
  logout: (req: Request, res: Response, next: NextFunction) => void;

  forgotPassword: (req: Request, res: Response, next: NextFunction) => void;
}
