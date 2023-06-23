import { Request, Response, NextFunction } from 'express';
import { NHMAccountDAL } from 'dals';
import INHMAccountControllers, {
  NHMAccountBodyReq,
  NHMAccountParamsReq,
  NHMAccountSignInBodyReq,
} from './interfaces';
import { ErrorStruct } from '@tsenv';
import jwtResponse from 'middlewares/jwtResponse';

const errors = {
  STUDENT_USER_IS_DISABLED: {
    code: 'error',
    show: 'This account was disabled!',
  } as ErrorStruct,
  WRONG_EMAIL_OR_PASSWORD: {
    code: 'error',
    show: 'Your email or password is wrong',
  } as ErrorStruct,
  MISSING_EMAIL_OR_PASSWORD: {
    code: 'error',
    show: 'Missing email or password',
  } as ErrorStruct,
};

class NHMAccountController implements INHMAccountControllers {
  signInNHMAccount(
    req: Request<any, NHMAccountSignInBodyReq>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): void {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.responseAppError(errors.MISSING_EMAIL_OR_PASSWORD);
    }
    NHMAccountDAL.signInAccount(email, password)
      .then(account => {
        if (!account) {
          return res.responseAppError(errors.WRONG_EMAIL_OR_PASSWORD);
        }
        // TODO: Create JWT:
        //
        const token = jwtResponse.generate({
          id: account.id,
          name: account.name,
          type: account.role || 'teacher',
          email: account.email,
          phone: account.phone,
        });
        res.responseSuccess({ data: account, token });
      })
      .catch(err => res.responseAppError(err));
  }

  getNHMAccountOwnProfile(req: Request, res: Response, next: NextFunction): void {
    NHMAccountDAL.getAccountById(req.userDecoded.id)
      .then(student => {
        res.responseSuccess(student);
      })
      .catch(err => res.responseAppError(err));
  }
  addNewNHMAccount(req: Request, res: Response, next: NextFunction): void {
    NHMAccountDAL.addNewAccount(req)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }

  updateNHMAccount(
    req: Request<NHMAccountParamsReq, NHMAccountBodyReq>,
    res: Response,
    next: NextFunction
  ): void {
    NHMAccountDAL.updateAccountById(req?.body, req.params.id)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }

  listNHMAccounts(req: Request, res: Response, next: NextFunction): void {
    NHMAccountDAL.listAccounts(req)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }

  getNHMAccountById(req: Request<NHMAccountParamsReq>, res: Response, next: NextFunction): void {
    NHMAccountDAL.getAccountById(req.params.id)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }
}

export default new NHMAccountController();
