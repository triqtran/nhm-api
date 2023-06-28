import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ErrorResType, ErrorStruct } from '@tsenv';

const handler = (req: Request, res: Response, next: NextFunction): void => {
  res.responseData = (statusCode: number, data: any): void => {
    res.status(statusCode).json(data);
  };

  res.responseError = (
    code: string,
    show: string,
    error: ErrorResType
  ): void => {
    const err = { code, show, error } as ErrorStruct;
    if (error) {
      if (error instanceof Error) {
        console.log(error);
        err.error = error.message;
      } else {
        err.error = error;
        console.log(err);
      }
    }
    res.responseData(400, { success: false, error: err });
  };

  res.responseAppError = (err: any): void => {
    const e = {
      code: err?.code || 'ERROR_INTERNAL_SERVER',
      show: err?.show || 'Something was wrong.',
      error: err?.show ? err.show : err?.error || err,
    } as ErrorStruct;
    res.responseError(e.code, e.show, e.error);
  };

  res.responseFailAuth = (code: string, show: string, error: ErrorResType) => {
    const err = { code, show, error } as ErrorStruct;
    if (err.error) console.log(error);
    res.responseData(401, { success: false, error: err });
  };

  res.responseNoRoute = () => {
    res.responseData(404, {
      success: false,
      error: { code: 'INVALID_ROUTE', show: 'Invalid route' } as ErrorStruct,
    });
  };

  res.responseSuccess = (data: any) => {
    const restData =
      data && data.data ? { success: true, ...data } : { success: true, data };
    res.responseData(200, restData);
  };

  res.responseSuccessMessage = (code: string, message: string) => {
    res.status(200).json({ code, message });
  };

  next();
};

const noRoute = (req: Request, res: Response, next: NextFunction): void => {
  res.responseNoRoute();
};

export const noRouteHandler = noRoute as RequestHandler;

export default handler;
