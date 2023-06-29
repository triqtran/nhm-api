import { Request, NextFunction, Response } from 'express';
import { StudentStatus } from 'models/Students';

export interface NHMAccountParamsReq {
  id: number;
}

export interface NHMAccountBodyReq {
  first_name: string;
  last_name: string;
  registered_user_id: number;
  status: StudentStatus;
  email: string;
  password: string;
}

export interface NHMAccountSignInBodyReq {
  email: string;
  password: string;
}

export default interface INHMAccountControllers {
  signInNHMAccount: (
    req: Request<any, NHMAccountSignInBodyReq>,
    res: Response,
    next: NextFunction
  ) => void;
  getNHMAccountOwnProfile: (req: Request, res: Response, next: NextFunction) => void;

  addNewNHMAccount: (
    req: Request<any, NHMAccountBodyReq>,
    res: Response,
    next: NextFunction
  ) => void;
  updateNHMAccount: (
    req: Request<NHMAccountParamsReq, NHMAccountBodyReq>,
    res: Response,
    next: NextFunction
  ) => void;
  listNHMAccounts: (req: Request, res: Response, next: NextFunction) => void;
  getNHMAccountById: (req: Request<NHMAccountParamsReq>, res: Response, next: NextFunction) => void;
}
