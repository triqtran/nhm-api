import { Request, RequestHandler, Response, NextFunction } from 'express';
import config from '@config';
import JWToken, { JwtPayload } from 'jsonwebtoken';
import { DecodedUserKind, DecodedUserType, ErrorStruct } from '@tsenv';
import StudentsDAL from 'dals/StudentsDAL';
import { NHMAccountDAL } from 'dals/index';

const throwError = (errMessage = 'Method is not permitted!'): ErrorStruct => {
  console.error('[jwtResponse}]', errMessage);
  return { code: 'error', show: errMessage, error: new Error(errMessage) };
};

const logDecode = (payload: JwtPayload, token: string): void => {
  console.log('===================== USER REQUEST =====================');
  console.log(payload);
  console.log('TOKEN:', token);
  console.log('========================================================');
};

class JwtResponse {
  static exist(id: number, type: DecodedUserKind) {
    switch (type) {
      case 'student': {
        return StudentsDAL.getStudentById(id)
          .then(existStudent => existStudent && existStudent.status !== 'suspended')
          .catch(e => {
            console.error('[jwtResponse]', e);
            return false;
          });
      }
      case 'admin':
      case 'teacher':
        return NHMAccountDAL.getAccountById(id)
          .then(existAccount => !!existAccount)
          .catch(e => {
            console.error('[jwtResponse]', e);
            return false;
          });
      default:
        return Promise.resolve(false);
    }
  }

  verify(req: Request, res: Response, next: NextFunction) {
    const authToken = req.header('Authorization') as string;
    if (!authToken || authToken.trim() === '' || !authToken.includes('Bearer'))
      return res.responseAppError(throwError('Not found authentication token!'));
    const jwtToken = authToken.substring(7);
    JWToken.verify(jwtToken, config.JWT_SECRET, (jwtErr, decode) => {
      if (jwtErr) return res.responseAppError(throwError('Invalid authentication token!'));
      req.userDecoded = decode as JwtPayload;
      logDecode(req.userDecoded, jwtToken);
      return JwtResponse.exist(req.userDecoded.id, req.userDecoded.type)
        .then(result => {
          if (!result) res.responseAppError(throwError('User is not found or has been disabled!'));
          next();
        })
        .catch((e: Error) => res.responseAppError(throwError(e.message)));
    });
  }

  generate(payload: DecodedUserType) {
    return JWToken.sign(payload, config.JWT_SECRET, {});
  }

  verifyRole(role: DecodedUserKind[]) {
    const authRole = (req: Request, res: Response, next: NextFunction) => {
      if (!req.userDecoded) {
        return res.responseAppError(throwError('Can not find valid authentication!'));
      }
      if (role.includes(req.userDecoded.type)) {
        return res.responseAppError(throwError('You can not perform this action!'));
      }
      next();
    };
    return authRole as RequestHandler<any, any>;
  }

  getLearningLevel(req: Request, res: Response, next: NextFunction) {
    StudentsDAL.getStudentViaIdIncludingCourse(req.userDecoded.id)
      .then(student => {
        if (!student) {
          res.responseAppError(throwError('Student has not had any courses yet!'));
        }
        req.userDecoded.level = student.course.LearningLevel;
        next();
      })
      .catch((e: Error) => res.responseAppError(throwError(e.message)));
  }
}
const jwtResponse = new JwtResponse();

export const authHandler = jwtResponse.verify as RequestHandler<any, any>;
export const levelHandler = jwtResponse.getLearningLevel as RequestHandler<any, any>;
export const authRoleHanlder = jwtResponse.verifyRole;
export default jwtResponse;
