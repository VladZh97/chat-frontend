import api from './api';

const auth = {
  create: async () => {
    await api.post('/auth/create');
  },
};

export default auth;
