import { Request, Response, NextFunction } from 'express';
import IResourceControllers from './interfaces';
import { ErrorStruct } from '@tsenv';
import jwtResponse from 'middlewares/jwtResponse';
import { ParsedQs } from 'qs';

const errors = {};

class ResourceController implements IResourceControllers {
  listContinue(req: Request, res: Response, next: NextFunction): void {
    console.log('student id', req.userDecoded)
  };
}

export default new ResourceController();
