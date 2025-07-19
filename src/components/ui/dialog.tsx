import { useDialogStoreShallow } from '@/store/dialog.store';
import { AnimatePresence, motion } from 'motion/react';
import { createPortal } from 'preact/compat';
import { useDialog } from '@/hooks';

const Dialog = () => {
  const dialogs = useDialogStoreShallow(state => state.dialogs);
  const closingDialogs = useDialogStoreShallow(state => state.closingDialogs);
  const { closeDialog } = useDialog();

  if (dialogs.length === 0) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {dialogs.map(dialog => {
        const DialogComponent = dialog.component;
        const isClosing = closingDialogs.has(dialog.id);
        const canClose = !isClosing && !dialog.disableClose;

        return (
          <motion.div
            key={dialog.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: isClosing ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="fixed inset-0 z-[9999] grid place-items-center bg-neutral-900/90 dark:opacity-70"
            onClick={() => canClose && closeDialog(dialog.id)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{
                opacity: isClosing ? 0 : 1,
                scale: isClosing ? 0.95 : 1,
                y: isClosing ? 20 : 0,
              }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="rounded-2xl bg-white shadow-md dark:outline-gray-300"
              onClick={e => e.stopPropagation()}
            >
              <DialogComponent {...dialog.props} />
            </motion.div>
          </motion.div>
        );
      })}
    </AnimatePresence>,
    document.body
  );
};

export default Dialog;
