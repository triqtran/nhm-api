import Students from 'models/Students';

const throwError = (funcName: string, errMessage: string = 'Method not implemented.') => {
  console.error(`[StudentsDAL.${funcName}]`, errMessage);
  return new Error(`[StudentsDAL.${funcName}] ${errMessage}`);
};

export type ListStudentsResponse = {
  count: number;
  data: Array<Students>;
};

interface IStudentsDAL {
  addNewStudent(data: any): Promise<Students>;
  updateStudentById(data: any, id: number): Promise<Students>;
  listStudentsByCourse(paging: any): Promise<ListStudentsResponse>;
  getStudentById(id: number): Promise<Students>;
  signInStudent(email: string, password: string): Promise<Students>;
}

class StudentsDAL implements IStudentsDAL {
  addNewStudent(data: any): Promise<Students> {
    return Students.findOne({ where: { email: data.email } })
      .then(exist => {
        if (exist) throw throwError('addNewStudent', 'This student has already existed!');
        return Students.create(data, { returning: true }).then(res => {
          if (res?.dataValues) return res.dataValues as Students;
          throw throwError('addNewStudent', 'Can not create student!');
        });
      })
      .catch(err => {
        throw throwError('addNewStudent', err);
      });
  }
  updateStudentById(data: any, id: number): Promise<Students> {
    return Students.update(data, {
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
  listStudentsByCourse(paging: any): Promise<ListStudentsResponse> {
    return Students.findAndCountAll({ where: paging })
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

  signInStudent(email: string, password: string): Promise<Students> {
    return Students.findOne({ where: { email, password } })
      .then(res => (res?.dataValues || null) as Students)
      .catch(err => {
        throw throwError('getStudentById', err);
      });
  }
}

export default new StudentsDAL();
