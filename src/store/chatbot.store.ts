import type { IChatbot } from '@/types/chatbot.type';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

interface IActions {
  setChatbot: (chatbot: Partial<IChatbot>) => void;
  reset: () => void;
}

const initState: IChatbot = {
  _id: '',
  name: '',
  publicName: '',
  accountId: '',
  avatarIcon: '',
  chatIcon: '',
  accentColor: '',
  backgroundColor: '',
  removeBranding: false,
  visibility: 'public',
  initialMessage: '',
  conversationStarters: [],
  promptPreset: '',
  prompt: '',
  createdAt: '',
  updatedAt: '',
  collectLeads: false,
};

export const useChatbotStore = create<IChatbot & IActions>(set => ({
  ...initState,
  setChatbot: chatbot => set(prev => ({ ...prev, ...chatbot })),
  reset: () => set(initState),
}));

export const useChatbotStoreShallow = <U>(selector: (store: IChatbot & IActions) => U) => {
  return useChatbotStore(useShallow(selector));
};
