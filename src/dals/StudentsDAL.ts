import Students from "models/Students";

const throwError = (
  funcName: string,
  errMessage: string = 'Method not implemented.',
) => {
  console.error('[StudentsDAL.${funcName}]', errMessage);
  return new Error(`[StudentsDAL.${funcName}] ${errMessage}`)
};

export type ListStudentsResponse = {
  count: number;
  data: Array<Students>;
}

interface IStudentsDAL {
  addNewStudent (req: any): Promise<Students>;
  updateStudentById (req: any, id: number): Promise<Students>;
  listStudentsByCourse (req: any): Promise<ListStudentsResponse>;
  getStudentById (id: number): Promise<Students>;
}

class StudentsDAL implements IStudentsDAL {
  addNewStudent(req: any): Promise<Students> {
    return Students.create(req, { returning: true })
      .then(res => {
        if (res?.dataValues) return res.dataValues as Students;
        throw throwError('addNewStudent');
      })
      .catch(err => {
        throw throwError('addNewStudent', err);
      });
  }
  updateStudentById(req: any, id: number): Promise<Students> {
    return Students.update(req, {
      where: { id },
      fields: [
        'first_name',
        'last_name',
        'birthday',
        'email',
        'phone',
        'status',
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
  listStudentsByCourse(req: any): Promise<ListStudentsResponse> {
    return Students.findAndCountAll({ where: req })
      .then(res => {
        const resData = res.rows.map(item => item.dataValues);
        return { count: res.count, data: resData } as ListStudentsResponse;
      })
      .catch(err => {
        throw throwError('listStudentsByCourse', err);
      });
  }
  getStudentById(id: number): Promise<Students> {
    return Students.findOne({ where: { id } })
      .then(res => (res?.dataValues || null) as Students)
      .catch(err => {
        throw throwError('getStudentById', err);
      });
  }
  
}

export default new StudentsDAL();

