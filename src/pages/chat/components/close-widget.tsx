import { X } from 'lucide-react';
import { useCallback } from 'preact/hooks';

export const CloseWidget = () => {
  const handleCloseWidget = useCallback(() => {
    window.parent.postMessage({ type: 'heyway:close-widget' }, '*');
  }, []);

  return (
    <div
      className="flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-stone-200"
      onClick={handleCloseWidget}
    >
      <X className="size-5 text-stone-700" />
    </div>
  );
};
