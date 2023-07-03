import NHMAccountsDAL from 'dals/NHMAccountsDAL';

import {
  SignInRequest,
  ListNHMAccountResponse,
  UpdateAccountRequest,
  AddNewAccountRequest,
} from './types';

import { Paging } from '@tsenv';
import NHMAccounts from 'models/NHMAccounts';

interface INHMAccountBusiness {
  signIn: (data: SignInRequest) => Promise<NHMAccounts>;
  listAccount: (paging: Paging) => Promise<ListNHMAccountResponse>;
  updateAccountById: (
    id: number,
    data: UpdateAccountRequest
  ) => Promise<NHMAccounts>;
  addNewAccount: (data: AddNewAccountRequest) => Promise<NHMAccounts>;
  getAccountById: (id: number) => Promise<NHMAccounts>;
}

class NHMAccountBusiness implements INHMAccountBusiness {
  signIn(data: SignInRequest): Promise<NHMAccounts> {
    return NHMAccountsDAL.signInAccount(data.email, data.password);
  }
  listAccount(paging: Paging): Promise<ListNHMAccountResponse> {
    return NHMAccountsDAL.listAccounts(paging);
  }
  updateAccountById(
    id: number,
    data: UpdateAccountRequest
  ): Promise<NHMAccounts> {
    return NHMAccountsDAL.updateAccountById(data, id);
  }
  addNewAccount(data: AddNewAccountRequest): Promise<NHMAccounts> {
    return NHMAccountsDAL.addNewAccount(data);
  }
  getAccountById(id: number): Promise<NHMAccounts> {
    return NHMAccountsDAL.getAccountById(id);
  }
}

export default new NHMAccountBusiness();
