import { NextFunction, Request, Response } from 'express';

export interface IUploadControllers {
  uploadFile(req: Request, res: Response, next: NextFunction): any;
}
