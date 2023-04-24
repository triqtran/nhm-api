import StudentUsersDAL from "dals/StudentUsersDAL";

type SignInRequest = {
  username: string;
  password: string;
}

interface IStudentBusiness {
  signIn: (req: SignInRequest) => void;
}

class StudentBusiness implements IStudentBusiness {
  signIn(req: SignInRequest): void {}
}

export default new StudentBusiness();