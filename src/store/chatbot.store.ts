import type { IChatbot } from '@/types/chatbot.type';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

interface IActions {
  setChatbot: (chatbot: Partial<IChatbot> & { init?: boolean }) => void;
  reset: () => void;
}

const initState: IChatbot & { changed?: boolean } = {
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

  changed: false,
};

export const useChatbotStore = create<IChatbot & IActions>(set => ({
  ...initState,
  setChatbot: chatbot => {
    const { init, ...rest } = chatbot;
    set(prev => ({ ...prev, ...rest, changed: !init }));
  },
  reset: () => set(initState),
}));

export const useChatbotStoreShallow = <U>(
  selector: (store: IChatbot & IActions & { changed?: boolean }) => U
) => {
  return useChatbotStore(useShallow(selector));
};
