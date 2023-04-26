import StudentUsersDAL from "dals/StudentUsersDAL";
import {
  OwnerProfileRequest,
  OwnerScheduleRequest,
  OwnerCourseRequest,
  RegisterRequest,
  SignInRequest,
} from "./types";

interface IStudentBusiness {
  // student owner
  signIn: (req: SignInRequest) => void;
  register: (req: RegisterRequest) => void;
  getProfile: (req: OwnerProfileRequest) => void;
  getSchedules: (req: OwnerScheduleRequest) => void;
  getCampus: (req: OwnerCourseRequest) => void;
}

class StudentBusiness implements IStudentBusiness {
  signIn(req: SignInRequest): void {};
  register(req: RegisterRequest): void {};
  getProfile(req: OwnerProfileRequest): void {};
  getSchedules(req: OwnerScheduleRequest): void {};
  getCampus(req: OwnerCourseRequest): void {};
}

export default new StudentBusiness();