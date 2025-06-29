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
  avatarIcon: '',
  chatIcon: '',
  accentColor: '',
  backgroundColor: '',
  removeBranding: false,
  visibility: 'public',
  rateLimitCount: 0,
  rateLimitInterval: 0,
  rateLimitMessage: '',
  initialMessage: '',
  conversationStarters: [],
  promptOption: '',
  promptValue: '',
  instructions: '',
  createdAt: '',
  updatedAt: '',
};

export const useChatbotStore = create<IChatbot & IActions>((set, get) => ({
  ...initState,
  setChatbot: chatbot => set(prev => ({ ...prev, ...chatbot })),
  reset: () => set(initState),
}));

export const useChatbotStoreShallow = <U>(selector: (store: IChatbot & IActions) => U) => {
  return useChatbotStore(useShallow(selector));
};
