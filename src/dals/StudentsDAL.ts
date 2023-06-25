import Students from 'models/Students';

const throwError =
  (funcName: string) =>
  (errMessage: string = 'Method not implemented.') => {
    console.error(`[StudentsDAL.${funcName}]`, errMessage);
    throw errMessage;
  };

const throwNewError = (err: string = 'Error not implemented.') => {
  throw new Error(err);
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
      .then((exist) => {
        if (exist) throwNewError('This student has already existed!');
        return Students.create(data, { returning: true }).then((res) => {
          if (res?.dataValues) return res.dataValues as Students;
          return throwNewError('Can not create student!');
        });
      })
      .catch(throwError('addNewStudent'));
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
      .then((res) => {
        if (res?.length > 0 && res[1]) return res[1][0];
        return throwNewError('updateStudentById');
      })
      .catch(throwError('updateStudentById'));
  }
  listStudentsByCourse(paging: any): Promise<ListStudentsResponse> {
    return Students.findAndCountAll({ where: paging })
      .then((res) => {
        const resData = res.rows.map((item) => item.dataValues);
        return { count: res.count, data: resData } as ListStudentsResponse;
      })
      .catch(throwError('listStudentsByCourse'));
  }
  getStudentById(id: number): Promise<Students> {
    return Students.findOne({ where: { id } })
      .then((res) => (res?.dataValues || null) as Students)
      .catch(throwError('getStudentById'));
  }

  signInStudent(email: string, password: string): Promise<Students> {
    return Students.findOne({ where: { email, password } })
      .then((res) => (res?.dataValues || null) as Students)
      .catch(throwError('signInStudent'));
  }
}

export default new StudentsDAL();
