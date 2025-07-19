import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

export interface DialogConfig {
  id: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  onClose?: () => void;
  disableClose?: boolean;
}

interface DialogState {
  dialogs: DialogConfig[];
  closingDialogs: Set<string>;
}

interface DialogActions {
  openDialog: (dialog: DialogConfig) => void;
  closeDialog: (id: string) => void;
  closeAllDialogs: () => void;
  markDialogClosing: (id: string) => void;
  removeDialog: (id: string) => void;
  updateDialog: (id: string, updates: Partial<DialogConfig>) => void;
}

type DialogStore = DialogState & DialogActions;

const initialState: DialogState = {
  dialogs: [],
  closingDialogs: new Set(),
};

export const useDialogStore = create<DialogStore>((set, get) => ({
  ...initialState,

  openDialog: dialog => {
    set(state => ({
      dialogs: [...state.dialogs, dialog],
    }));
  },

  closeDialog: id => {
    set(state => {
      const dialog = state.dialogs.find(d => d.id === id);
      if (dialog?.onClose) {
        dialog.onClose();
      }
      return {
        dialogs: state.dialogs.filter(d => d.id !== id),
        closingDialogs: new Set([...state.closingDialogs].filter(dialogId => dialogId !== id)),
      };
    });
  },

  markDialogClosing: id => {
    set(state => ({
      closingDialogs: new Set([...state.closingDialogs, id]),
    }));
  },

  removeDialog: id => {
    set(state => {
      const dialog = state.dialogs.find(d => d.id === id);
      if (dialog?.onClose) {
        dialog.onClose();
      }
      return {
        dialogs: state.dialogs.filter(d => d.id !== id),
        closingDialogs: new Set([...state.closingDialogs].filter(dialogId => dialogId !== id)),
      };
    });
  },

  updateDialog: (id, updates) => {
    set(state => ({
      dialogs: state.dialogs.map(dialog => (dialog.id === id ? { ...dialog, ...updates } : dialog)),
    }));
  },

  closeAllDialogs: () => {
    set(state => {
      // Call onClose for all dialogs
      state.dialogs.forEach(dialog => {
        if (dialog.onClose) {
          dialog.onClose();
        }
      });
      return {
        dialogs: [],
        closingDialogs: new Set(),
      };
    });
  },
}));

export const useDialogStoreShallow = <U>(selector: (store: DialogStore) => U) => {
  return useDialogStore(useShallow(selector));
};
