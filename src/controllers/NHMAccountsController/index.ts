import { Request, Response, NextFunction } from 'express';
import { AccountBusiness } from 'business';
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
    AccountBusiness.signIn({ email, password })
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

  getNHMAccountOwnProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    AccountBusiness.getAccountById(req.userDecoded.id)
      .then(student => {
        res.responseSuccess(student);
      })
      .catch(err => res.responseAppError(err));
  }
  addNewNHMAccount(req: Request, res: Response, next: NextFunction): void {
    AccountBusiness.addNewAccount(req.body)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }

  updateNHMAccount(
    req: Request<NHMAccountParamsReq, NHMAccountBodyReq>,
    res: Response,
    next: NextFunction
  ): void {
    AccountBusiness.updateAccountById(req.params.id, req?.body)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }

  listNHMAccounts(req: Request, res: Response, next: NextFunction): void {
    AccountBusiness.listAccount(req.paging)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }

  getNHMAccountById(
    req: Request<NHMAccountParamsReq>,
    res: Response,
    next: NextFunction
  ): void {
    AccountBusiness.getAccountById(req.params.id)
      .then(result => res.responseSuccess(result))
      .catch(err => res.responseAppError(err));
  }
}

export default new NHMAccountController();
