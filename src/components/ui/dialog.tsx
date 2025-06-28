import { cn } from '@/lib/utils';
import { Dialog as DialogBase } from '@base-ui-components/react/dialog';

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disableClose?: boolean;
}

const Dialog = ({ children, open, onOpenChange, disableClose }: DialogProps) => {
  // Handler to prevent close if disableClose is true
  const handleOpenChange = (nextOpen: boolean) => {
    if (disableClose && !nextOpen) return; // Prevent closing
    onOpenChange?.(nextOpen);
  };
  return (
    <DialogBase.Root open={open} onOpenChange={handleOpenChange}>
      {children}
    </DialogBase.Root>
  );
};

Dialog.Trigger = DialogBase.Trigger;
Dialog.Portal = DialogBase.Portal;
Dialog.Backdrop = DialogBase.Backdrop;
Dialog.Content = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <DialogBase.Portal>
    <DialogBase.Backdrop className="fixed inset-0 z-[100] bg-neutral-900/90 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 dark:opacity-70" />
    <DialogBase.Popup
      className={cn(
        'fixed top-1/2 left-1/2 z-[101] w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-md transition-all duration-150 outline-none data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:outline-gray-300',
        className
      )}
    >
      {children}
    </DialogBase.Popup>
  </DialogBase.Portal>
);

export default Dialog;
