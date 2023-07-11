import { Request, NextFunction, Response } from 'express';

export interface ResourceParamsReq {
  student_id: number;
  course_id: number;
}

export interface ResourceParamsBody {}

export default interface IResourceControllers {
  listContinue: (req: Request, res: Response, next: NextFunction) => void;
  listEbook: (req: Request, res: Response, next: NextFunction) => void;
  listGame: (req: Request, res: Response, next: NextFunction) => void;
  listLevelsOfGame: (req: Request, res: Response, next: NextFunction) => void;
  listQuestionsOfLevel: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;
  saveChapterOfBook: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;
}
