import Book from 'models/Book';
import BookStudent from 'models/BookStudents';
import { Op, col } from 'sequelize';

const logError = (funcName: string, err: string) =>
  `BookDAL.${funcName}: ${err}`;

const throwError =
  (funcName: string) =>
  (errMessage = 'Method not implemented.') => {
    console.error(`[BookDAL.${funcName}]`, errMessage);
    throw errMessage;
  };

const throwNewError = (err = 'Error not implemented.') => {
  throw new Error(err);
};

type ListBookResponse = {
  data: Book[];
  count: number;
};

type BookStudentResponseIncludeBook = BookStudent & { book_info: Book };

type BookResponseIncludeBookStudent = Book & { book_student: BookStudent };

interface IBookDAL {
  create(data: Book): Promise<Book>;
  update(data: Partial<Book>, id: number): Promise<Book>;
  list(where: any): Promise<ListBookResponse>;
  getById(id: number): Promise<Book>;
  upsertBookStudent(data: BookStudent): Promise<boolean>;
  listBookStudentByStudentId(
    student_id: number,
    is_trial?: boolean
  ): Promise<BookStudentResponseIncludeBook[]>;

  getBookStudentLatest(
    student_id: number
  ): Promise<BookStudentResponseIncludeBook | null>;
  listBookWithoutPaging(where: any): Promise<BookResponseIncludeBookStudent[]>;
}

class BookDAL implements IBookDAL {
  create(data: Book): Promise<Book> {
    return Book.create(data)
      .then(res => {
        if (res?.dataValues) return res.dataValues as Book;
        return throwNewError('Can not create book');
      })
      .catch(throwError('create'));
  }

  update(data: Partial<Book>, id: number): Promise<Book> {
    return Book.update(data, {
      where: { id },
      returning: true,
      fields: [
        'name',
        'total_chapters',
        'level',
        'description',
        'is_trial',
        'short_description',
        'status',
        'url_file',
        'background_image',
      ],
    })
      .then(res => {
        if (res?.length > 0 && res[1]) return res[1][0];
        return throwNewError('Can not update book!');
      })
      .catch(throwError('update'));
  }

  list(where: any): Promise<ListBookResponse> {
    return Book.findAndCountAll({
      where,
    })
      .then(res => {
        const resData = res.rows.map(item => item.dataValues);
        return { count: res.count, data: resData } as ListBookResponse;
      })
      .catch(throwError('list'));
  }

  getById(id: number): Promise<Book> {
    return Book.findOne({
      where: { id },
    })
      .then(res => {
        if (res?.dataValues) return res.dataValues as Book;
        return throwNewError('Can not find this book');
      })
      .catch(throwError('getById'));
  }

  upsertBookStudent(data: BookStudent): Promise<boolean> {
    return BookStudent.upsert(data)
      .then(() => true)
      .catch(throwError('upsertBookStudent'));
  }

  listBookStudentByStudentId(
    student_id: number,
    is_trial = false
  ): Promise<BookStudentResponseIncludeBook[]> {
    return BookStudent.findAll({
      where: {
        student_id,
        current_chapter: {
          [Op.lt]: col('book_info`.`total_chapters'),
        },
      },
      include: {
        model: Book,
        as: 'book_info',
        required: true,
        where: { is_trial },
      },
    })
      .then(res => {
        if (res?.length > 0)
          return res.map(
            item => item.dataValues
          ) as BookStudentResponseIncludeBook[];
        logError(
          'listBookStudentByStudentId',
          'Student has not read any book yet'
        );
        return [];
      })
      .catch(throwError('listBookStudentByStudentId'));
  }

  getBookStudentLatest(
    student_id: number
  ): Promise<BookStudentResponseIncludeBook | null> {
    return BookStudent.findOne({
      where: {
        student_id,
      },
      order: [['updated_at', 'desc']],
      include: [
        {
          model: Book,
          as: 'book_info',
          required: true,
          attributes: [
            'id',
            'name',
            'url_file',
            'total_chapters',
            'background_image',
            'level',
          ],
        },
      ],
    })
      .then(result => {
        if (!result?.dataValues) return null;
        return result.dataValues as BookStudentResponseIncludeBook;
      })
      .catch(throwError('getBookStudentLastest'));
  }
  listBookWithoutPaging(
    filters: any
  ): Promise<BookResponseIncludeBookStudent[]> {
    return Book.findAll({
      where: filters,
      include: {
        model: BookStudent,
        as: 'book_student',
        required: false,
      },
    })
      .then(resp => {
        if (resp.length <= 0) {
          logError('listBookWithoutPaging', 'Not found any book');
          return [];
        }
        return resp.map(
          item => item.dataValues as BookResponseIncludeBookStudent
        );
      })
      .catch(throwError('listBookWithoutPaging'));
  }
}

export default new BookDAL();
