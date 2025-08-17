import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Download, Ellipsis, MessageSquarePlus } from 'lucide-react';
import { useState } from 'preact/hooks';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useWidgetStoreShallow } from '../store/widget.store';
import { WidgetStorage } from '@/utils/widget-storage';

export const Options = () => {
  const [open, setOpen] = useState(false);
  const { id: chatbotId } = useParams();
  const { clearSession, setConversationId, visitorId, setSessionRestored } = useWidgetStoreShallow(
    s => ({
      clearSession: s.clearSession,
      setConversationId: s.setConversationId,
      visitorId: s.visitorId,
      setSessionRestored: s.setSessionRestored,
    })
  );

  const handleStartNewChat = () => {
    // Generate a new conversation ID immediately
    const newConversationId = uuidv4();

    // Clear the current session from store
    clearSession();

    // Immediately set session as restored to prevent useRestoreSession from running
    setSessionRestored(true);

    // Set the new conversation ID
    setConversationId(newConversationId);

    // Set the new conversation as active in localStorage
    if (chatbotId && visitorId) {
      WidgetStorage.setActiveConversationId(chatbotId, visitorId, newConversationId);
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
