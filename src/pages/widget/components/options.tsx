import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Download, Ellipsis, MessageSquarePlus } from 'lucide-react';
import { useState } from 'preact/hooks';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useWidgetStoreShallow } from '../store/widget.store';
import { WidgetStorage } from '@/utils/widget-storage';
import { HeywayEvent } from '../constants';

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
    const newConversationId = uuidv4();
    clearSession();
    setSessionRestored(true);
    setConversationId(newConversationId);
    if (chatbotId && visitorId) {
      WidgetStorage.startNewChat(chatbotId, visitorId, newConversationId);
    }
    setOpen(false);
  };

  const handleDownloadTranscription = () => {
    if (!chatbotId || !visitorId) return;
    const conversationId = WidgetStorage.getActiveConversationId(chatbotId, visitorId);
    if (conversationId) {
      const conversation = WidgetStorage.getConversationById(chatbotId, visitorId, conversationId);
      if (conversation) {
        window.parent.postMessage(
          {
            type: HeywayEvent.TRANSCRIPT,
            conversationId: conversation.conversationId,
            transcript: conversation.messages,
          },
          '*'
        );
      }
    }
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        className={cn(
          'flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-neutral-200',
          open && 'bg-neutral-200'
        )}
      >
        <Ellipsis className="size-5 text-neutral-700" />
      </PopoverTrigger>
      <PopoverContent className="w-52 rounded-lg bg-white p-1 shadow-lg">
        <Option onClick={handleStartNewChat}>
          <MessageSquarePlus size={16} />
          Start a new chat
        </Option>
        <Option onClick={handleDownloadTranscription}>
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
      className="flex cursor-pointer items-center gap-2.5 rounded px-2 py-1.5 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
      onClick={onClick}
    >
      {children}
    </div>
  );
};
