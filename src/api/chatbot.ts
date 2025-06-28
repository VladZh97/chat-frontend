import type { IChatbot } from '@/types/chatbot.type';
import api from './api';
import queryClient from '@/lib/query';

const chatbot = {
  create: async (data: Partial<IChatbot>) => {
    const { data: chatbot } = await api.post<IChatbot>('/chatbot', data);
    queryClient.invalidateQueries({ queryKey: ['chatbots'] });
    return chatbot;
  },
  get: async () => {
    const { data: chatbots } = await api.get<IChatbot[]>('/chatbot');
    return chatbots;
  },
  getById: async (id: string) => {
    const { data: chatbot } = await api.get<IChatbot>(`/chatbot/${id}`);
    return chatbot;
  },
};

export default chatbot;
