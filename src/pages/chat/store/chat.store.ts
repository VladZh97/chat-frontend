import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

export interface IChat {
  view: 'chat' | 'history';
}

const initState: IChat = {
  view: 'chat',
};

interface IActions {
  setView: (view: 'chat' | 'history') => void;
}

export const useChatStore = create<IChat & IActions>(set => ({
  ...initState,
  setView: view => set(prev => ({ ...prev, view })),
}));

export const useChatStoreShallow = <U>(selector: (store: IChat & IActions) => U) => {
  return useChatStore(useShallow(selector));
};
