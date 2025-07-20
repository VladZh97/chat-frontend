import api from './api';

export const stats = {
  chats: {
    query: async (chatbotId?: string) => {
      const response = await api.get('/stats/chats', {
        params: {
          chatbotId,
        },
      });
      return response.data;
    },
    key: ['stats-chats'],
  },
  messages: {
    query: async (chatbotId?: string) => {
      const response = await api.get('/stats/messages', {
        params: {
          chatbotId,
        },
      });
      return response.data;
    },
    key: ['stats-messages'],
  },
};
