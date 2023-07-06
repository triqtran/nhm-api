import { Request, NextFunction, Response } from 'express';

export interface ResourceParamsReq {
  student_id: number;
  course_id: number;
}

export interface ResourceParamsBody {}

export default interface IResourceControllers {
  listContinue: (req: Request, res: Response, next: NextFunction) => void;
}
