import { MessageCirclePlus, MessagesSquare } from 'lucide-react';
import { useConfigStoreShallow } from '../store';

export const WidgetAuthErrorMessage = () => {
  const { accentColor } = useConfigStoreShallow(s => ({
    accentColor: s.accentColor,
  }));
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <MessagesSquare className="mb-5 text-neutral-500" size={32} />
      <p className="mb-2 text-center text-sm font-medium text-neutral-900">
        Unable to connect to chat
      </p>
      <p className="mb-8 text-center text-xs text-neutral-500">Please try again.</p>
      <button
        className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-white transition-opacity hover:opacity-80"
        style={{ backgroundColor: accentColor }}
        onClick={() => window.location.reload()}
      >
        <MessageCirclePlus size={20} />
        Try again
      </button>
    </div>
  );
};
