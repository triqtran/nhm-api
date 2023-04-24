import path from "path";
import dotenv from "dotenv";
import { Dialect } from "sequelize";

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  PORT: number
  DB_HOST: string
  DB_PORT: number
  DB_DRIVER: Dialect
  DB_USER: string
  DB_PASS: string
  DB_SCHEMA: string

  // JWT
  JWT_SECRET: string
  JWT_EXPIRED_DAY: number

  // AWS S3 - Storage Cloud
  S3_AWS_DEFAULT_REGION: string
  S3_ACCESS_KEY_ID: string
  S3_SECRET_ACCESS_KEY: string
  S3_IMAGE_STORAGE_NAME: string
  S3_STORAGE_PUBLIC_URL: string

  // Ayotree - config
  AYOTREE_KEY: string
  AYOTREE_SECRET: string
  AYOTREE_API: string

  // Ayotree - Campuses, classrooms, courses and lessons via APIs
  AYOTREE_LIST_CAMPUSES: string
  AYOTREE_LIST_CLASSROOM: string
  AYOTREE_LIST_COURSES_BY_CAMPUS: string
  AYOTREE_LIST_LESSONS_BY_CAMPUS_AND_TEACHER: string

  // Ayotree - users, students via APIs
  AYOTREE_LIST_USERS_BY_TYPE: string
  AYOTREE_GET_USER_INVOICE: string
  AYOTREE_ADD_NEW_STUDENT: string
  AYOTREE_LIST_STUDENTS_BY_CAMPUS: string
  AYOTREE_GET_STUDENT_ID: string
  AYOTREE_UPDATE_STUDENT_STATUS_BY_ID_AND_CAMPUS: string

  // Ayotree - get teachers
  AYOTREE_GET_TEACHER_TEACHING_AVAILABILITY_SCHEDULE: string

  // Ayotree - get setting timeZones
  AYOTREE_GET_TIMEZONES: string
}

interface Config {
  PORT: number
  DB_HOST: string
  DB_PORT: number
  DB_DRIVER: Dialect
  DB_USER: string
  DB_PASS: string
  DB_SCHEMA: string

  // JWT
  JWT_SECRET: string
  JWT_EXPIRED_DAY: number

  // AWS S3 - Storage Cloud
  S3_AWS_DEFAULT_REGION: string
  S3_ACCESS_KEY_ID: string
  S3_SECRET_ACCESS_KEY: string
  S3_IMAGE_STORAGE_NAME: string
  S3_STORAGE_PUBLIC_URL: string

  // Ayotree - config
  AYOTREE_KEY: string
  AYOTREE_SECRET: string
  AYOTREE_API: string

  // Ayotree - Campuses, classrooms, courses and lessons via APIs
  AYOTREE_LIST_CAMPUSES: string
  AYOTREE_LIST_CLASSROOM: string
  AYOTREE_LIST_COURSES_BY_CAMPUS: string
  AYOTREE_LIST_LESSONS_BY_CAMPUS_AND_TEACHER: string

  // Ayotree - users, students via APIs
  AYOTREE_LIST_USERS_BY_TYPE: string
  AYOTREE_GET_USER_INVOICE: string
  AYOTREE_ADD_NEW_STUDENT: string
  AYOTREE_LIST_STUDENTS_BY_CAMPUS: string
  AYOTREE_GET_STUDENT_ID: string
  AYOTREE_UPDATE_STUDENT_STATUS_BY_ID_AND_CAMPUS: string

  // Ayotree - get teachers
  AYOTREE_GET_TEACHER_TEACHING_AVAILABILITY_SCHEDULE: string

  // Ayotree - get setting timeZones
  AYOTREE_GET_TIMEZONES: string
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    PORT: process.env.PORT ? Number(process.env.PORT) : 3214,
    DB_HOST: process.env.DB_HOST as string,
    DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    DB_DRIVER: process.env.DB_DRIVER as Dialect,
    DB_USER: process.env.DB_USER as string,
    DB_PASS: process.env.DB_PASS as string,
    DB_SCHEMA: process.env.DB_SCHEMA as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRED_DAY: process.env.JWT_EXPIRED_DAY ? Number(process.env.JWT_EXPIRED_DAY) : 30,
    S3_AWS_DEFAULT_REGION: process.env.S3_AWS_DEFAULT_REGION as string,
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID as string,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY as string,
    S3_IMAGE_STORAGE_NAME: process.env.S3_IMAGE_STORAGE_NAME as string,
    S3_STORAGE_PUBLIC_URL: process.env.S3_STORAGE_PUBLIC_URL as string,
    AYOTREE_KEY: process.env.AYOTREE_KEY as string,
    AYOTREE_SECRET: process.env.AYOTREE_SECRET as string,
    AYOTREE_API: process.env.AYOTREE_API as string,
    AYOTREE_LIST_CAMPUSES: process.env.AYOTREE_LIST_CAMPUSES as string,
    AYOTREE_LIST_CLASSROOM: process.env.AYOTREE_LIST_CLASSROOM as string,
    AYOTREE_LIST_COURSES_BY_CAMPUS: process.env.AYOTREE_LIST_COURSES_BY_CAMPUS as string,
    AYOTREE_LIST_LESSONS_BY_CAMPUS_AND_TEACHER: process.env.AYOTREE_LIST_LESSONS_BY_CAMPUS_AND_TEACHER as string,
    AYOTREE_LIST_USERS_BY_TYPE: process.env.AYOTREE_LIST_USERS_BY_TYPE as string,
    AYOTREE_GET_USER_INVOICE: process.env.AYOTREE_GET_USER_INVOICE as string,
    AYOTREE_ADD_NEW_STUDENT: process.env.AYOTREE_ADD_NEW_STUDENT as string,
    AYOTREE_LIST_STUDENTS_BY_CAMPUS: process.env.AYOTREE_LIST_STUDENTS_BY_CAMPUS as string,
    AYOTREE_GET_STUDENT_ID: process.env.AYOTREE_GET_STUDENT_ID as string,
    AYOTREE_UPDATE_STUDENT_STATUS_BY_ID_AND_CAMPUS: process.env.AYOTREE_UPDATE_STUDENT_STATUS_BY_ID_AND_CAMPUS as string,
    AYOTREE_GET_TEACHER_TEACHING_AVAILABILITY_SCHEDULE: process.env.AYOTREE_GET_TEACHER_TEACHING_AVAILABILITY_SCHEDULE as string,
    AYOTREE_GET_TIMEZONES: process.env.AYOTREE_GET_TIMEZONES as string,
  };
};

// Throwing an Error if any field was undefined we don't 
// want our app to run if it can't connect to DB and ensure 
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type 
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in .env`);
    }
  }
  return config as Config;
};

const sanitizedConfig = getConfig();

const config = getSanitzedConfig(sanitizedConfig);

export default config;