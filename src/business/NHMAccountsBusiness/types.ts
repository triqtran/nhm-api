import NHMAccounts, { NHM_Account_Type } from 'models/NHMAccounts';

export type ListNHMAccountResponse = {
  data: NHMAccounts[];
  count: number;
};

export type AddNewAccountRequest = {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: NHM_Account_Type;
  created_at: Date;
  updated_at?: Date;
};

export type UpdateAccountRequest = {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: NHM_Account_Type;
};

export type SignInRequest = {
  email: string;
  password: string;
};
