import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

interface IState {
  type: 'links' | 'files' | 'text-snippet';
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
  hiddenTabs: boolean;
}

interface IActions {
  setWebsiteUrl: (value: string) => void;
  setTextSnippet: (value: { title: string; content: string }) => void;
  setType: (value: 'links' | 'files' | 'text-snippet') => void;
  setDisableClose: (value: boolean) => void;
  setSelectedFile: (file: { file: File; metadata: Record<string, unknown> } | null) => void;
  editTextSnippet: (value: { title: string; content: string }) => void;
  reset: () => void;
}

const initState: IState = {
  type: 'links',
  websiteUrl: '',
  disableClose: false,
  textSnippet: {
    title: '',
    content: '',
  },
  selectedFile: null,
  hiddenTabs: false,
};

export const useKnowledgeDialogStore = create<IState & IActions>(set => ({
  ...initState,
  setWebsiteUrl: url => set({ websiteUrl: url }),
  setDisableClose: disableClose => set({ disableClose }),
  setTextSnippet: snippet => set({ textSnippet: snippet }),
  setSelectedFile: file => set({ selectedFile: file }),
  editTextSnippet: snippet => set({ textSnippet: snippet, hiddenTabs: true, type: 'text-snippet' }),
  setType: type => {
    set({ ...initState, type });
  },
  reset: () => set(initState),
}));

export const useKnowledgeDialogStoreShallow = <U>(selector: (store: IState & IActions) => U) => {
  return useKnowledgeDialogStore(useShallow(selector));
};
