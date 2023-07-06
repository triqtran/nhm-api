import { Request, Response, NextFunction } from 'express';
import IResourceControllers, { ResourceParamsReq } from './interfaces';
import { ErrorStruct } from '@tsenv';
import jwtResponse from 'middlewares/jwtResponse';
import { ParsedQs } from 'qs';

const errors = {};

class ResourceController implements IResourceControllers {
  listContinue(req: Request, res: Response, next: NextFunction): void {
    
  };
}

export default new ResourceController();
