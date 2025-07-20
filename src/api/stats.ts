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
    key: (chatbotId?: string) => ['stats-chats', chatbotId],
  },
  chatsOverTime: {
    query: async (dateFrom: string, dateTo: string, chatbotId?: string) => {
      const response = await api.get('/stats/chats-over-time', {
        params: {
          chatbotId,
          dateFrom,
          dateTo,
        },
      });
      return response.data;
    },
    key: (dateFrom: string, dateTo: string, chatbotId?: string) => [
      'stats-chats-over-time',
      dateFrom,
      dateTo,
      chatbotId,
    ],
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
    key: (chatbotId?: string) => ['stats-messages', chatbotId],
  },
  messagesOverTime: {
    query: async (dateFrom: string, dateTo: string, chatbotId?: string) => {
      const response = await api.get('/stats/messages-over-time', {
        params: {
          chatbotId,
          dateFrom,
          dateTo,
        },
      });
      return response.data;
    },
    key: (dateFrom: string, dateTo: string, chatbotId?: string) => [
      'stats-messages-over-time',
      dateFrom,
      dateTo,
      chatbotId,
    ],
  },
};
