import { NextFunction, Request, Response } from 'express';
import { IUploadControllers } from './interfaces';
import { UploadFileBusiness } from 'business';
import { ErrorStruct } from '@tsenv';
import config from '@config';

const errors = {
  MISSING_FILE: {
    code: 'error',
    show: 'Missing upload file!',
  } as ErrorStruct,
  UPLOAD_FAILED: {
    code: 'error',
    show: 'Upload file failed!',
  } as ErrorStruct,
};

class UploadControllers implements IUploadControllers {
  uploadFile(req: Request, res: Response, next: NextFunction): void {
    if (!req.file) {
      return res.responseAppError(errors.MISSING_FILE);
    }
    UploadFileBusiness.s3UploadFile(req.file)
      .then(Key => {
        if (!Key) {
          return res.responseAppError(errors.UPLOAD_FAILED);
        }
        res.responseSuccess({
          url: `${config.S3_STORAGE_PUBLIC_URL}/${Key}`,
        });
      })
      .catch(err => res.responseAppError(err));
  }
}

export default new UploadControllers();
