import { Dialect } from "sequelize";
import * as Express from "express";

declare namespace NodeJS {
  interface ProcessEnv {
    // Database
    readonly DB_HOST: string
    readonly DB_PORT: number
    readonly DB_DRIVER: Dialect
    readonly DB_USER: string
    readonly DB_PASS: string
    readonly DB_NAME: string
    readonly DB_SCHEMA: string

    // JWT
    readonly JWT_SECRET: string
    readonly JWT_EXPIRED_DAY: number

    // AWS S3 - Storage Cloud
    readonly S3_AWS_DEFAULT_REGION: string
    readonly S3_ACCESS_KEY_ID: string
    readonly S3_SECRET_ACCESS_KEY: string
    readonly S3_IMAGE_STORAGE_NAME: string
    readonly S3_STORAGE_PUBLIC_URL: string

    // Ayotree - config
    readonly AYOTREE_KEY: string
    readonly AYOTREE_SECRET: string
    readonly AYOTREE_API: string

    // Ayotree - Campuses, classrooms, courses and lessons via APIs
    readonly AYOTREE_LIST_CAMPUSES: string
    readonly AYOTREE_LIST_CLASSROOM: string
    readonly AYOTREE_LIST_COURSES_BY_CAMPUS: string
    readonly AYOTREE_LIST_LESSONS_BY_CAMPUS_AND_TEACHER: string

    // Ayotree - users, students via APIs
    readonly AYOTREE_GET_USER_PROFILE: string
    readonly AYOTREE_GET_USER_INVOICE: string
    readonly AYOTREE_ADD_NEW_STUDENT: string
    readonly AYOTREE_LIST_STUDENTS_BY_CAMPUS: string
    readonly AYOTREE_GET_STUDENT_ID: string
    readonly AYOTREE_UPDATE_STUDENT_STATUS_BY_ID_AND_CAMPUS: string

    // Ayotree - get setting timeZones
    readonly AYOTREE_GET_TIMEZONES: string
  }
}

type ErrorResType = Error | string | undefined;
type ErrorStruct = {
  code: string
  show: string;
  error: ErrorResType;
}
type ErrorResponse = ErrorStruct | ErrorResType;

type DecodedUserKind = 'student' | 'register' | 'nhm_account';
interface DecodedUserType {
  id: number;
  type: DecodedUserKind;
  name: string;
  phone?: string;
  email?: string;
}

declare module "Express" {
  interface Response {
    responseData: (
      statusCode: number,
      data: {
        success: boolean;
        data?: any;
        error?: ErrorResponse;
      }
    ) => void;
    responseError: (
      code: string,
      show: string,
      error: ErrorResType,
    ) => void;
    responseAppError: (err: ErrorStruct) => void;
    responseFailAuth: (
      code: string,
      show: string,
      error: ErrorResType,
    ) => void;
    responseNoRoute: () => void;
    responseSuccess: (data: any) => void;
    responseSuccessMessage: (code: string, message: string) => void;
  }
  interface Request {
    userDecoded: DecodedUserType;
  }
}

declare module "JsonWebToken" {
  interface JwtPayload extends DecodedUserType {}
}