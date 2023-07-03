import NHMAccounts from 'models/NHMAccounts';

const throwError =
  (funcName: string) =>
  (errMessage = 'Method not implemented.') => {
    console.error(`[StudentsDAL.${funcName}]`, errMessage);
    throw errMessage;
  };

const throwNewError = (err = 'Error not implemented.') => {
  throw new Error(err);
};

export type ListNHMAccountsResponse = {
  count: number;
  data: NHMAccounts[];
};

interface INHMAccountsDAL {
  addNewAccount(req: any): Promise<NHMAccounts>;
  updateAccountById(req: any, id: number): Promise<NHMAccounts>;
  listAccounts(req: any): Promise<ListNHMAccountsResponse>;
  signInAccount(email: string, password: string): Promise<NHMAccounts>;
  getAccountById(id: number): Promise<NHMAccounts>;
}

class NHMAccountsDAL implements INHMAccountsDAL {
  addNewAccount(req: any): Promise<NHMAccounts> {
    return NHMAccounts.findOne({ where: { email: req.email } })
      .then(exist => {
        if (exist) return throwNewError('This account has already existed!');
        return NHMAccounts.create(req, { returning: true }).then(res => {
          if (res?.dataValues) return res.dataValues as NHMAccounts;
          return throwNewError('Can not create account!');
        });
      })
      .catch(throwError('addNewAccount'));
  }
  updateAccountById(req: any, id: number): Promise<NHMAccounts> {
    return NHMAccounts.update(req, {
      where: { id },
      fields: ['email', 'name', 'password', 'phone'],
      returning: true,
    })
      .then(res => {
        if (res?.length > 0 && res[1]) return res[1][0];
        return throwNewError('updateAccountById');
      })
      .catch(throwError('updateAccountById'));
  }
  listAccounts(req: any): Promise<ListNHMAccountsResponse> {
    return NHMAccounts.findAndCountAll({ where: req })
      .then(res => {
        const resData = res.rows.map(item => item.dataValues);
        return { count: res.count, data: resData } as ListNHMAccountsResponse;
      })
      .catch(throwError('listAccounts'));
  }
  getAccountById(id: number): Promise<NHMAccounts> {
    return NHMAccounts.findOne({ where: { id } })
      .then(res => (res?.dataValues || null) as NHMAccounts)
      .catch(throwError('getAccountById'));
  }

  signInAccount(email: string, password: string): Promise<NHMAccounts> {
    return NHMAccounts.findOne({ where: { email, password } })
      .then(res => (res?.dataValues || null) as NHMAccounts)
      .catch(throwError('signInAccount'));
  }
}

export default new NHMAccountsDAL();
