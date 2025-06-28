import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

interface IState {
  websiteUrl: string;
}

interface IActions {
  setWebsiteUrl: (value: string) => void;
  reset: () => void;
}

const initState: IState = {
  websiteUrl: '',
};

export const useKnowledgeStore = create<IState & IActions>((set, get) => ({
  ...initState,
  setWebsiteUrl: url => set({ websiteUrl: url }),
  reset: () => set(initState),
}));

export const useKnowledgeStoreShallow = <U>(selector: (store: IState & IActions) => U) => {
  return useKnowledgeStore(useShallow(selector));
};
