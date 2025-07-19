import { useCallback } from 'react';
import { useDialogStore } from '@/store/dialog.store';
import type { DialogConfig } from '@/store/dialog.store';

export const useDialog = () => {
  const { openDialog, markDialogClosing, removeDialog, closeAllDialogs, updateDialog } =
    useDialogStore();

  const showDialog = useCallback(
    (
      id: string,
      component: React.ComponentType<any>,
      props?: Record<string, any>,
      onClose?: () => void,
      disableClose?: boolean
    ) => {
      openDialog({
        id,
        component,
        props,
        onClose,
        disableClose,
      });
    },
    [openDialog]
  );

  const closeDialog = useCallback(
    (id: string) => {
      // Mark as closing to start exit animation
      markDialogClosing(id);
      // Remove from store after animation completes
      setTimeout(() => {
        removeDialog(id);
      }, 200); // Match the animation duration
    },
    [markDialogClosing, removeDialog]
  );

  const updateDialogConfig = useCallback(
    (id: string, updates: Partial<DialogConfig>) => {
      updateDialog(id, updates);
    },
    [updateDialog]
  );

  return {
    showDialog,
    closeDialog,
    closeAllDialogs,
    updateDialog: updateDialogConfig,
  };
};
