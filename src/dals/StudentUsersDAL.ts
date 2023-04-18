import StudentUsers from "models/StudentUsers";

const throwError = (
  funcName: string,
  errMessage: string = 'Method not implemented.',
) => {
  console.error('[StudentUsersDAL.${funcName}]', errMessage);
  return new Error(`[StudentUsersDAL.${funcName}] ${errMessage}`)
};

export type ListStudentUsersResponse = {
  count: number;
  data: Array<StudentUsers>;
}

interface IStudentUsersDAL {
  addNewStudent (req: any): Promise<StudentUsers>;
  updateStudentById (req: any, id: number): Promise<StudentUsers>;
  listStudentsByCourse (req: any): Promise<ListStudentUsersResponse>;
  getStudentById (id: number): Promise<StudentUsers>;
}

class StudentUsersDAL implements IStudentUsersDAL {
  addNewStudent(req: any): Promise<StudentUsers> {
    return StudentUsers.create(req, { returning: true })
      .then(res => {
        if (res?.dataValues) return res.dataValues as StudentUsers;
        throw throwError('addNewStudent');
      })
      .catch(err => {
        throw throwError('addNewStudent', err);
      });
  }
  updateStudentById(req: any, id: number): Promise<StudentUsers> {
    return StudentUsers.update(req, {
      where: { id },
      fields: [
        'first_name',
        'last_name',
        'kind',
        'registered_user_id',
        'status',
        'user_name',
        'password',
        'updated_at',
      ],
      returning: true,
    })
      .then(res => {
        if (res?.length > 0 && res[1]) return res[1][0];
        throw throwError('updateStudentById');
      })
      .catch(err => {
        throw throwError('updateStudentById', err);
      });
  }
  listStudentsByCourse(req: any): Promise<ListStudentUsersResponse> {
    return StudentUsers.findAndCountAll({ where: req })
      .then(res => {
        const resData = res.rows.map(item => item.dataValues);
        return { count: res.count, data: resData } as ListStudentUsersResponse;
      })
      .catch(err => {
        throw throwError('listStudentsByCourse', err);
      });
  }
  getStudentById(id: number): Promise<StudentUsers> {
    return StudentUsers.findOne({ where: { id } })
      .then(res => (res?.dataValues || null) as StudentUsers)
      .catch(err => {
        throw throwError('getStudentById', err);
      });
  }
  
}

export default new StudentUsersDAL();

