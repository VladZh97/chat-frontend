import type { IChatbot } from '@/types/chatbot.type';
import api from './api';
import queryClient from '@/lib/query';
import { useChatbotStore } from '@/store/chatbot.store';

const chatbot = {
  create: async (data: Partial<IChatbot>) => {
    const { data: chatbot } = await api.post<IChatbot>('/chatbot', data);
    queryClient.setQueryData(['chatbots'], (oldData: IChatbot[] | undefined) => {
      if (!oldData) return [chatbot];
      return [...oldData, chatbot];
    });
    return chatbot;
  },
  get: async () => {
    const { data: chatbots } = await api.get<IChatbot[]>('/chatbot');
    return chatbots;
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
  },
};

export default chatbot;
