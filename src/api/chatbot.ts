import type { IChatbot } from '@/types/chatbot.type';
import api from './api';
import queryClient from '@/lib/query';
import { useChatbotStore } from '@/store/chatbot.store';
import { stats } from './stats';
import type { ChatStreamEvent } from './widget';
import { auth } from '@/lib/auth';

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
  // Playground streaming (editor view) – sends messages array and instructions, no auth
  sendPlaygroundMessageStream: async (
    chatbotId: string,
    messages: { role: 'user' | 'assistant'; content: string }[],
    instructions: string,
    onEvent: (evt: ChatStreamEvent) => void
  ): Promise<void> => {
    const authToken = await auth.currentUser?.getIdToken();
    const response = await fetch(`${api.defaults.baseURL}/chatbot/playground/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ chatbotId, messages, instructions, stream: true }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (!response.body) {
      throw new Error('No response body available');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.startsWith(':')) continue;
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          try {
            const evt: ChatStreamEvent = JSON.parse(data);
            onEvent(evt);
          } catch (error) {
            console.error('Failed to parse stream event:', error);
          }
        }
      }
    }
  },
};

export default chatbot;
