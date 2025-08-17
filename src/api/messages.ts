import api from './api';

export const messages = {
  getConversations: {
    query: async (chatbotId: string, page: number = 1, limit: number = 20) => {
      const { data } = await api.get(`/messages/${chatbotId}/conversations`, {
        params: { page, limit },
      });
      return data;
    },
    key: (chatbotId: string) => ['conversations', chatbotId],
  },
  getMessages: {
    query: async (chatbotId: string, conversationId: string) => {
      const { data: messages } = await api.get(
        `/messages/${chatbotId}/conversations/${conversationId}/messages`
      );
      return messages;
    },
    key: (chatbotId: string, conversationId: string) => ['messages', chatbotId, conversationId],
  },
  deleteConversation: {
    query: async (chatbotId: string, conversationId: string) => {
      await api.delete('/messages/conversations', {
        data: {
          chatbotId,
          conversationId,
        },
      });
    },
    key: (chatbotId: string, conversationId: string) => [
      'conversations',
      chatbotId,
      conversationId,
    ],
  },
};
