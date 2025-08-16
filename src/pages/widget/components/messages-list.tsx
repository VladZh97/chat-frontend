import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useConfigStoreShallow } from '../store';
import { MessageCirclePlus } from 'lucide-react';
import { PoweredByLabel } from './powered-by-label';

const MessagesList = () => {
  const { removeBranding, accentColor } = useConfigStoreShallow(s => ({
    removeBranding: s.removeBranding,
    accentColor: s.accentColor,
  }));

  return (
    <>
      <div className="p-6 text-center text-sm font-semibold">Messages</div>
      <ScrollArea className={cn('h-[calc(100%-164px)]', removeBranding && 'h-[calc(100%-132px)]')}>
        <div className="flex flex-1 flex-col space-y-2 px-3">
          <SingleChatPreview />
        </div>
      </ScrollArea>
      <div className="flex w-full flex-col items-center justify-center px-4">
        <button
          className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-white transition-opacity hover:opacity-80"
          style={{ backgroundColor: accentColor }}
        >
          <MessageCirclePlus size={20} />
          Start a new chat
        </button>
        <PoweredByLabel />
      </div>
    </>
  );
};

export default MessagesList;

const SingleChatPreview = () => {
  const { accentColor, avatarIcon } = useConfigStoreShallow(s => ({
    accentColor: s.accentColor,
    avatarIcon: s.avatarIcon,
  }));
  return (
    <div className="flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-all duration-300 hover:bg-stone-100">
      <div className="size-10 rounded-full bg-stone-100" style={{ backgroundColor: accentColor }}>
        {avatarIcon && <img src={avatarIcon} alt="avatar" className="size-full object-cover" />}
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-stone-900">Tell me everything about your pricing</p>
        <span className="text-xs font-normal text-stone-500">Today</span>
      </div>
    </div>
  );
};
