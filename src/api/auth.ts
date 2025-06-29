import type { IUser } from '@/types/user.type';
import api from './api';
import type { IAccount } from '@/types/account.type';
import queryClient from '@/lib/query';

const auth = {
  create: async (): Promise<{
    user: IUser;
    account: IAccount;
  }> => {
    const response = await api.post('/auth/create');
    queryClient.setQueryData(['user'], response.data.user);
    queryClient.setQueryData(['account'], response.data.account);
    return response.data;
  },
};

export default auth;
