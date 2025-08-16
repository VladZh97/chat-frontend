import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

export interface IWidget {
  view: 'chat' | 'history';
}

const initState: IWidget = {
  view: 'chat',
};

interface IActions {
  setView: (view: 'chat' | 'history') => void;
}

export const useWidgetStore = create<IWidget & IActions>(set => ({
  ...initState,
  setView: view => set(prev => ({ ...prev, view })),
}));

export const useWidgetStoreShallow = <U>(selector: (store: IWidget & IActions) => U) => {
  return useWidgetStore(useShallow(selector));
};
