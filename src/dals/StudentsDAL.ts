import { Paging } from '@tsenv';
import Students from 'models/Students';
import Campus from 'models/Campus';

const throwError =
  (funcName: string) =>
  (errMessage = 'Method not implemented.') => {
    console.error(`[StudentsDAL.${funcName}]`, errMessage);
    throw errMessage;
  };

const throwNewError = (err = 'Error not implemented.') => {
  throw new Error(err);
};

type CampusListResponse = Campus[] | null;

export type ListStudentsResponse = {
  count: number;
  data: Students[];
};
interface IStudentsDAL {
  addNewStudent(data: any): Promise<Students>;
  updateStudentById(data: any, id: number): Promise<Students>;
  listStudents(paging: any): Promise<ListStudentsResponse>;
  getStudentById(id: number): Promise<Students>;
  signInStudent(email: string, password: string): Promise<Students>;
  getCampusList(): Promise<CampusListResponse>;
}

class StudentsDAL implements IStudentsDAL {
  addNewStudent(data: any): Promise<Students> {
    return Students.findOne({ where: { email: data.email } })
      .then(exist => {
        if (exist) throwNewError('This student has already existed!');
        return Students.create(data, { returning: true }).then(res => {
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
        'ayotree_student_id',
        'ayotree_campus_id',
        'ayotree_course_code',
        'ayotree_course_title',
        'password',
        'updated_at',
      ],
      returning: true,
    })
      .then(res => {
        if (res?.length > 0 && res[1]) return res[1][0];
        return throwNewError('Cannot update student');
      })
      .catch(throwError('updateStudentById'));
  }
  listStudents(paging: Paging): Promise<ListStudentsResponse> {
    return Students.findAndCountAll({
      where: paging.filters,
      limit: paging.limit,
      offset: (paging.page - 1) * paging.limit,
    })
      .then(res => {
        const resData = res.rows.map(item => item.dataValues);
        return { count: res.count, data: resData } as ListStudentsResponse;
      })
      .catch(throwError('listStudentsByCourse'));
  }
  getStudentById(id: number): Promise<Students> {
    return Students.findOne({
      where: { id },
      attributes: {
        exclude: ['password'],
      },
    })
      .then(res => (res?.dataValues || null) as Students)
      .catch(throwError('getStudentById'));
  }

  signInStudent(user_name: string, password: string): Promise<Students> {
    return Students.findOne({
      where: { user_name, password },
      attributes: {
        exclude: ['password'],
      },
    })
      .then(res => (res?.dataValues || null) as Students)
      .catch(throwError('signInStudent'));
  }

  getCampusList(): Promise<CampusListResponse> {
    return Campus.findAll()
      .then(resp => resp.map(item => item.dataValues) as CampusListResponse)
      .catch(throwError('getCampusList'));
  }
}

export default new StudentsDAL();
