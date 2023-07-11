import { Paging } from '@tsenv';
import Students from 'models/Students';
import Campus from 'models/Campus';
import StudentDevices from 'models/StudentDevices';

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
  addNewStudent(data: Students): Promise<Students>;
  updateStudentById(data: Partial<Students>, id: number): Promise<Students>;
  listStudents(paging: Paging): Promise<ListStudentsResponse>;
  getStudentById(id: number): Promise<Students>;
  signInStudent(email: string, password: string): Promise<Students>;
  getCampusList(): Promise<CampusListResponse>;
  upsertStudentDeviceToken(
    student_id: number,
    device_token: string
  ): Promise<StudentDevices>;
  removeStudentDeviceToken(student_id: number): Promise<number>;
  getStudentByMail(email: string): Promise<Students>;
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
        'level',
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

  upsertStudentDeviceToken(
    id: number,
    device_token: string
  ): Promise<StudentDevices> {
    return StudentDevices.findOne({
      where: { id },
    })
      .then(res => {
        if (res?.dataValues) return res.update({ device_token });
        return StudentDevices.create({
          student_id: id,
          device_token,
        }).then(created => {
          if (created?.dataValues) return created.dataValues as StudentDevices;
          return throwNewError('Can not create student devices!');
        });
      })
      .catch(throwError('updateStudentDeviceToken'));
  }

  removeStudentDeviceToken(student_id: number): Promise<number> {
    return StudentDevices.destroy({
      where: { student_id },
    })
      .then(resp => {
        return resp;
      })
      .catch(throwError('removeStudentDeviceToken'));
  }

  getStudentByMail(email: string): Promise<Students> {
    return Students.findOne({
      where: { email },
      attributes: {
        exclude: ['password'],
      },
    })
      .then(res => (res?.dataValues || null) as Students)
      .catch(throwError('getStudentByMail'));
  }
}

export default new StudentsDAL();
