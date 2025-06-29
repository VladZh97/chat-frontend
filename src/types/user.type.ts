import type { IAccount } from './account.type';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  externalId: string;
  picture?: string;
  accountId: IAccount['_id'];
  createdAt: Date;
  updatedAt: Date;
}
