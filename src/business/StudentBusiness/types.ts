import Students, { StudentStatus } from 'models/Students';
import { AyotreeStudent } from 'requests/ayotrees/AyotreeTypes';

/* eslint-disable @typescript-eslint/ban-types */
export type OwnerProfileRequest = {};

export type OwnerProfileResponse = Students & {
  ayotree_profile?: AyotreeStudent | null;
};

export type OwnerScheduleRequest = {};

export type OwnerCourseRequest = {};

export type RegisterRequest = {
  first_name: string;
  last_name: string;
  email: string;
  user_name: string;
  password: string;
  phone: string;
  birthday: string;
};

export type SignInRequest = {
  email?: string;
  password: string;
  user_name: string;
  device_token: string;
};

export type UpdateRequest = {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  phone?: string;
  birthday?: string;
  status?: StudentStatus;
  ayotree_student_id?: number;
  ayotree_campus_id?: number;
  ayotree_course_title?: string;
  ayotree_course_code?: string;
};

export type ListStudentsResponse = {
  data: Students[];
  count: number;
};

export type HomeResponse = {
  book: any;
  game_exercise: any;
  lessons: any;
};
