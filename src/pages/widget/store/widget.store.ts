import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type { IWidgetMessage, IWidgetSession } from '@/utils/widget-storage';

export interface IWidget {
  view: 'chat' | 'history';
  visitorId: string | null;
  conversationId: string | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  messages: IWidgetMessage[];
  isSessionRestored: boolean;
}

const initState: IWidget = {
  view: 'chat',
  visitorId: null,
  conversationId: null,
  isAuthenticated: false,
  isAuthLoading: true,
  authError: null,
  messages: [],
  isSessionRestored: false,
};

interface IActions {
  setView: (view: 'chat' | 'history') => void;
  setVisitorId: (visitorId: string) => void;
  setConversationId: (conversationId: string) => void;
  setAuthState: (state: {
    isAuthenticated: boolean;
    isAuthLoading: boolean;
    authError: string | null;
  }) => void;
  setMessages: (messages: IWidgetMessage[]) => void;
  addMessage: (message: IWidgetMessage) => void;
  restoreSession: (session: IWidgetSession) => void;
  clearSession: () => void;
  setSessionRestored: (restored: boolean) => void;
}

export const useWidgetStore = create<IWidget & IActions>(set => ({
  ...initState,
  setView: view => set(prev => ({ ...prev, view })),
  setVisitorId: visitorId => set(prev => ({ ...prev, visitorId })),
  setConversationId: conversationId => set(prev => ({ ...prev, conversationId })),
  setAuthState: authState => set(prev => ({ ...prev, ...authState })),
  setMessages: messages => set(prev => ({ ...prev, messages })),
  addMessage: message => set(prev => ({ ...prev, messages: [...prev.messages, message] })),
  restoreSession: session =>
    set(prev => ({
      ...prev,
      visitorId: session.visitorId,
      conversationId: session.conversationId,
      messages: session.messages,
      isSessionRestored: true,
    })),
  clearSession: () =>
    set(prev => ({
      ...prev,
      messages: [],
      conversationId: null,
      isSessionRestored: false,
    })),
  setSessionRestored: restored => set(prev => ({ ...prev, isSessionRestored: restored })),
}));

export const useWidgetStoreShallow = <U>(selector: (store: IWidget & IActions) => U) => {
  return useWidgetStore(useShallow(selector));
};
