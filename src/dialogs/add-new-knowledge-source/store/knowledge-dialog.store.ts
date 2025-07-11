import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

interface IState {
  type: 'links' | 'files' | 'text-snippet';
  websiteUrl: string;
  open: boolean;
  textSnippet: {
    title: string;
    content: string;
  };
}

interface IActions {
  setWebsiteUrl: (value: string) => void;
  setTextSnippet: (value: { title: string; content: string }) => void;
  setType: (value: 'links' | 'files' | 'text-snippet') => void;
  setOpen: (value: boolean) => void;
  reset: () => void;
}

const initState: IState = {
  type: 'links',
  websiteUrl: '',
  open: false,
  textSnippet: {
    title: '',
    content: '',
  },
};

export const useKnowledgeDialogStore = create<IState & IActions>((set, get) => ({
  ...initState,
  setWebsiteUrl: url => set({ websiteUrl: url }),
  setTextSnippet: snippet => set({ textSnippet: snippet }),
  setType: type => {
    const { open, ...rest } = initState;
    set({ ...rest, type });
  },
  setOpen: open => set({ ...initState, open }),
  reset: () => set(initState),
}));

export const useKnowledgeDialogStoreShallow = <U>(selector: (store: IState & IActions) => U) => {
  return useKnowledgeDialogStore(useShallow(selector));
};
