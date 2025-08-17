import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type { IConversationPreview, IWidgetSession } from '@/utils/widget-storage';

export interface IHistoryState {
  conversations: IConversationPreview[];
  selectedConversation: IWidgetSession | null;
  isLoading: boolean;
  error: string | null;
}

const initState: IHistoryState = {
  conversations: [],
  selectedConversation: null,
  isLoading: false,
  error: null,
};

interface IHistoryActions {
  setConversations: (conversations: IConversationPreview[]) => void;
  setSelectedConversation: (conversation: IWidgetSession | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<IHistoryState & IHistoryActions>(set => ({
  ...initState,
  setConversations: conversations => set(prev => ({ ...prev, conversations })),
  setSelectedConversation: selectedConversation => set(prev => ({ ...prev, selectedConversation })),
  setLoading: isLoading => set(prev => ({ ...prev, isLoading })),
  setError: error => set(prev => ({ ...prev, error })),
  clearHistory: () => set(prev => ({ ...prev, ...initState })),
}));

export const useHistoryStoreShallow = <U>(
  selector: (store: IHistoryState & IHistoryActions) => U
) => {
  return useHistoryStore(useShallow(selector));
};
