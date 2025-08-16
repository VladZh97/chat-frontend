import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

export interface IConfig {
  avatarIcon: string;
  chatIcon: string;
  accentColor: string;
  backgroundColor: string;
  removeBranding: boolean;
  visibility: 'public' | 'private';
  rateLimitCount: number;
  rateLimitInterval: number;
  rateLimitMessage: string;
  initialMessage: string;
  conversationStarters: { id: string; value: string }[];
  collectLeads: boolean;
}

export const initState: IConfig = {
  avatarIcon: '',
  chatIcon: '',
  accentColor: '#0A0A0A',
  backgroundColor: '#0A0A0A',
  removeBranding: false,
  visibility: 'public',
  rateLimitCount: 0,
  rateLimitInterval: 0,
  rateLimitMessage: '',
  initialMessage: 'How can I help you?',
  conversationStarters: [],
  collectLeads: false,
};

interface IActions {
  setConfig: (config: Partial<IConfig>) => void;
  reset: () => void;
}

export const useConfigStore = create<IConfig & IActions>(set => ({
  ...initState,

  setConfig: config => set(state => ({ ...state, ...config })),

  reset: () => set(initState),
}));

export const useConfigStoreShallow = <U>(selector: (store: IConfig & IActions) => U) => {
  return useConfigStore(useShallow(selector));
};
