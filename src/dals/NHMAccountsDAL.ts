import NHMAccounts from 'models/NHMAccounts';

const throwError = (funcName: string, errMessage: string = 'Method not implemented.') => {
  console.error(`[NHMAccountsDAL.${funcName}]`, errMessage);
  return new Error(`[NHMAccountsDAL.${funcName}] ${errMessage}`);
};

export type ListNHMAccountsResponse = {
  count: number;
  data: Array<NHMAccounts>;
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
        if (exist) throw throwError('addNewAccount', 'This account has already existed!');
        return NHMAccounts.create(req, { returning: true }).then(res => {
          if (res?.dataValues) return res.dataValues as NHMAccounts;
          throw throwError('addNewAccount', 'Can not create account!');
        });
      })
      .catch(err => {
        throw throwError('addNewAccount', err);
      });
  }
  updateAccountById(req: any, id: number): Promise<NHMAccounts> {
    return NHMAccounts.update(req, {
      where: { id },
      fields: ['email', 'name', 'password', 'phone'],
      returning: true,
    })
      .then(res => {
        if (res?.length > 0 && res[1]) return res[1][0];
        throw throwError('updateAccountById');
      })
      .catch(err => {
        throw throwError('updateAccountById', err);
      });
  }
  listAccounts(req: any): Promise<ListNHMAccountsResponse> {
    return NHMAccounts.findAndCountAll({ where: req })
      .then(res => {
        const resData = res.rows.map(item => item.dataValues);
        return { count: res.count, data: resData } as ListNHMAccountsResponse;
      })
      .catch(err => {
        throw throwError('listAccounts', err);
      });
  }
  getAccountById(id: number): Promise<NHMAccounts> {
    return NHMAccounts.findOne({ where: { id } })
      .then(res => (res?.dataValues || null) as NHMAccounts)
      .catch(err => {
        throw throwError('getAccountById', err);
      });
  }

  signInAccount(email: string, password: string): Promise<NHMAccounts> {
    return NHMAccounts.findOne({ where: { email, password } })
      .then(res => (res?.dataValues || null) as NHMAccounts)
      .catch(err => {
        throw throwError('signInAccount', err);
      });
  }
}

export default new NHMAccountsDAL();
