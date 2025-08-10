import api from './api';

export const messages = {
  getConversations: {
    query: async (chatbotId: string) => {
      const { data: conversations } = await api.get(`/messages/${chatbotId}/conversations`);
      return conversations;
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
