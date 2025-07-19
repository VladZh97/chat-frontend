import api from './api';

export const stats = {
  chats: {
    query: async () => {
      const response = await api.get('/stats/chats');
      return response.data;
    },
    key: ['stats-chats'],
  },
  messages: {
    query: async () => {
      const response = await api.get('/stats/messages');
      return response.data;
    },
    key: ['stats-messages'],
  },
};
