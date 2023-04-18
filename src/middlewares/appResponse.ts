import { NextFunction, Request, Response } from "express";
import { ErrorResType, ErrorStruct } from "@tsenv";

const handler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {

  res.responseData = (statusCode: number, data: any): void => {
    res.status(statusCode).json(data)
  }

  res.responseError = (
    code: string,
    show: string,
    error: ErrorResType,
  ): void => {
    const err = { code, show, error } as ErrorStruct;
    if (error) {
      if (error instanceof Error) {
        console.log(error)
        err.error = error.message
      } else {
        err.error = error
        console.log(err)
      }
    }
    res.status(400).json({ success: false, error: err });
  }

  res.responseAppError = (err: ErrorStruct): void => {
    const e = {
      code: err?.code || 'ERROR_INTERNAL_SERVER',
      show: err?.show || 'Something was wrong.',
      error: err.error,
    } as ErrorStruct;
    res.status(400).json({ success: false, error: e });
  }

  res.responseFailAuth = (
    code: string,
    show: string,
    error: ErrorResType,
  ) => {
    const err = { code, show, error } as ErrorStruct;
    if (err.error) console.log(error);
    res.status(401).json({ success: false, error: err });
  }

  res.responseNoRoute = () => {
    res.status(404).json({ success: false, error: { code: "INVALID_ROUTE",show: "Invalid route"} })
  }

  res.responseSuccess = (data: any) => {
    const restData = data && data.data
      ? { success: true, ...data }
      : { success: true, data }
    res.status(200).json(restData)
  }

  res.responseSuccessMessage = (
    code: string,
    message: string,
  ) => {
    res.status(200).json({ code, message });
  }

  next();
}

export default handler;