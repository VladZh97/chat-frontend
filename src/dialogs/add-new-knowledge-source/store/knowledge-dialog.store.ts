import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

interface IState {
  type: 'links' | 'files' | 'text-snippet';
  open: boolean;
  disableClose: boolean;

  websiteUrl: string;
  textSnippet: {
    title: string;
    content: string;
  };
  selectedFile: {
    file: File;
    metadata: Record<string, unknown>;
  } | null;
}

interface IActions {
  setWebsiteUrl: (value: string) => void;
  setTextSnippet: (value: { title: string; content: string }) => void;
  setType: (value: 'links' | 'files' | 'text-snippet') => void;
  setOpen: (value: boolean) => void;
  setDisableClose: (value: boolean) => void;
  setSelectedFile: (file: { file: File; metadata: Record<string, unknown> } | null) => void;
  reset: () => void;
}

const initState: IState = {
  type: 'links',
  websiteUrl: '',
  open: false,
  disableClose: false,
  textSnippet: {
    title: '',
    content: '',
  },
  selectedFile: null,
};

export const useKnowledgeDialogStore = create<IState & IActions>(set => ({
  ...initState,
  setWebsiteUrl: url => set({ websiteUrl: url }),
  setDisableClose: disableClose => set({ disableClose }),
  setTextSnippet: snippet => set({ textSnippet: snippet }),
  setSelectedFile: file => set({ selectedFile: file }),
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
