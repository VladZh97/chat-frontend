import type { IUser } from '@/types/user.type';
import api from './api';
import queryClient from '@/lib/query';

const user = {
  get: async () => {
    const response = await api.get('/user');
    queryClient.setQueryData(['user'], response.data);
    return response.data;
  },
  update: async ({ _id, data }: { _id: string; data: Partial<IUser> }) => {
    const response = await api.put(`/user/${_id}`, data);
    queryClient.setQueryData(['user'], response.data);
    return response.data;
  },
};

export default user;
