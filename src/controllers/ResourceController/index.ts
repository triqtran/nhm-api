import { Request, Response, NextFunction } from 'express';
import IResourceControllers from './interfaces';
import { ErrorStruct } from '@tsenv';
import jwtResponse from 'middlewares/jwtResponse';
import { ParsedQs } from 'qs';
import { ResourceBusiness } from 'business';

const errors = {};

class ResourceController implements IResourceControllers {
  listContinue(req: Request, res: Response, next: NextFunction): void {
    ResourceBusiness.listContinue(req.userDecoded.id)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }
  listEbook(req: Request, res: Response, next: NextFunction): void {
    ResourceBusiness.listEbook(req.userDecoded.id)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }
  listGame(req: Request, res: Response, next: NextFunction): void {
     ResourceBusiness.listGame(req.userDecoded.id)
       .then(result => res.responseSuccess(result))
       .catch(err => res.responseAppError(err));
  }
}

export default new ResourceController();
