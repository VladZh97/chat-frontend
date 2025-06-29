import type { IAccount } from '@/types/account.type';
import api from './api';
import queryClient from '@/lib/query';

const account = {
  get: async (): Promise<IAccount> => {
    const response = await api.get('/account');
    queryClient.setQueryData(['account'], response.data);
    return response.data;
  },
  update: async (data: Partial<IAccount>) => {
    const response = await api.put('/account', data);
    queryClient.setQueryData(['account'], response.data);
    return response.data;
  },
};

export default account;
