import Book from 'models/Book';

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

interface IBookDAL {
  create(req: any): Promise<Book>;
  update(req: any, id: number): Promise<Book>;
  list(req: any): Promise<ListBookResponse>;
  getById(id: number): Promise<Book>;
}

class BookDAL implements IBookDAL {
  create(req: any): Promise<Book> {
    return Book.create(req)
      .then(res => {
        if (res?.dataValues) return res.dataValues as Book;
        return throwNewError('Can not create book');
      })
      .catch(throwError('create'));
  }

  update(req: any, id: number): Promise<Book> {
    return Book.update(req, {
      where: { id },
      returning: true,
      fields: [
        'name',
        'total_chapters',
        'course_id',
        'description',
        'is_trial',
        'short_description',
        'status',
        'url_file',
      ],
    })
      .then(res => {
        if (res?.length > 0 && res[1]) return res[1][0];
        return throwNewError('Can not update book!');
      })
      .catch(throwError('update'));
  }

  list(req: any): Promise<ListBookResponse> {
    return Book.findAndCountAll({
      where: req,
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
}

export default new BookDAL();
