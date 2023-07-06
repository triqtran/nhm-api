import config from '@config';
import { S3 } from 'aws-sdk';
import path from 'path';

export interface IUploadBusiness {
  guidGenerator(): string;

  getNameUpload(folder?: string): string;

  s3UploadFile(file: Express.Multer.File): Promise<S3.ManagedUpload.SendData>;
}

class UploadBusiness implements IUploadBusiness {
  s3 = new S3({
    signatureVersion: 'v4',
    region: config.S3_AWS_DEFAULT_REGION,
    accessKeyId: config.S3_ACCESS_KEY_ID,
    secretAccessKey: config.S3_SECRET_ACCESS_KEY,
  });

  guidGenerator(): string {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000 || 0).toString(16).substring(1);
    };
    return `${S4()}-${S4()}`;
  }

  getNameUpload(folder = 'uploads'): string {
    const now = new Date();
    const dateForm = `${now.getFullYear()}${
      now.getMonth() + 1
    }${now.getDate()}`;
    const timeForm = `${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
    return `${folder}/${dateForm}/${timeForm}_${this.guidGenerator()}`;
  }

  s3UploadFile(file: Express.Multer.File): Promise<S3.ManagedUpload.SendData> {
    const fileExtension = path.extname(file.originalname);
    const uploadParams = {
      Bucket: config.S3_IMAGE_STORAGE_NAME,
      Key: `${this.getNameUpload()}${fileExtension}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    return this.s3.upload(uploadParams).promise();
  }
}

export default new UploadBusiness();
