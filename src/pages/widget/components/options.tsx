import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Download, Ellipsis, MessageSquarePlus } from 'lucide-react';
import { useState } from 'preact/hooks';
import { useParams } from 'react-router-dom';
import { useWidgetStoreShallow } from '../store/widget.store';
import { WidgetStorage } from '@/utils/widget-storage';

export const Options = () => {
  const [open, setOpen] = useState(false);
  const { id: chatbotId } = useParams();
  const { clearSession, visitorId } = useWidgetStoreShallow(s => ({
    clearSession: s.clearSession,
    visitorId: s.visitorId,
  }));

  const handleStartNewChat = () => {
    clearSession();
    if (chatbotId && visitorId) {
      WidgetStorage.clearConversation(chatbotId, visitorId);
    }
    setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        className={cn(
          'flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-stone-200',
          open && 'bg-stone-200'
        )}
      >
        <Ellipsis className="size-5 text-stone-700" />
      </PopoverTrigger>
      <PopoverContent className="w-52 rounded-lg bg-white p-1 shadow-lg">
        <Option onClick={handleStartNewChat}>
          <MessageSquarePlus size={16} />
          Start a new chat
        </Option>
        <Option>
          <Download size={16} />
          Download transcription
        </Option>
      </PopoverContent>
    </Popover>
  );
};

const Option = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => {
  return (
    <div
      className="flex cursor-pointer items-center gap-2.5 rounded px-2 py-1.5 text-sm text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
      onClick={onClick}
    >
      {children}
    </div>
  );
};
