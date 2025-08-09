import type { IChatbot } from '@/types/chatbot.type';
import api from './api';
import queryClient from '@/lib/query';
import { useChatbotStore } from '@/store/chatbot.store';
import { stats } from './stats';

const chatbot = {
  create: async (data: Partial<IChatbot>) => {
    const { data: chatbot } = await api.post<IChatbot>('/chatbot', data);
    queryClient.setQueryData(['chatbots'], (oldData: IChatbot[] | undefined) => {
      if (!oldData) return [chatbot];
      return [...oldData, chatbot];
    });
    return chatbot;
  },
  get: {
    query: async () => {
      const { data: chatbots } = await api.get<IChatbot[]>('/chatbot');
      return chatbots;
    },
    key: ['chatbots'],
  },
  getById: async (id: string) => {
    const { data: chatbot } = await api.get<IChatbot>(`/chatbot/${id}`);
    useChatbotStore.getState().setChatbot(chatbot);
    return chatbot;
  },
  update: async (id: string, data: Partial<IChatbot>) => {
    const { data: chatbot } = await api.put<IChatbot>(`/chatbot/${id}`, data);
    queryClient.setQueryData(['chatbots'], (oldData: IChatbot[] | undefined) => {
      if (!oldData) return [chatbot];
      return oldData.map(item => (item._id === id ? chatbot : item));
    });
  },
  delete: async (id: string) => {
    await api.delete(`/chatbot/${id}`);
    queryClient.setQueryData(['chatbots'], (oldData: IChatbot[] | undefined) => {
      if (!oldData) return [];
      return oldData.filter(chatbot => chatbot._id !== id);
    });
    queryClient.setQueryData(stats.chats.key(), (oldData: IChatbot[] | undefined) => {
      if (!oldData) return [];
      return oldData.filter(chatbot => chatbot._id !== id);
    });
  },
  playground: {
    sendMessage: async (
      chatbotId: string,
      messages: { role: 'user' | 'bot'; content: string }[],
      instructions: string
    ) => {
      const { data } = await api.post('/chatbot/playground/send-message', {
        messages,
        chatbotId,
        instructions,
      });
      return data;
    },
  },
};

export default chatbot;
