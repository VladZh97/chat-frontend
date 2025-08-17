import { useEffect } from 'preact/hooks';
import moment from 'moment';
import { MessageCirclePlus, MessagesSquare } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useConfigStoreShallow, useHistoryStoreShallow } from '../store';
import { useWidgetStoreShallow } from '../store/widget.store';
import { WidgetStorage, type IConversationPreview } from '@/utils/widget-storage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PoweredByLabel } from './powered-by-label';
import { cn } from '@/lib/utils';

export const ConversationList = ({ startNewChat }: { startNewChat: () => void }) => {
  const { id: chatbotId } = useParams();

  const { conversations, setConversations, setLoading, isLoading } = useHistoryStoreShallow(s => ({
    conversations: s.conversations,
    setConversations: s.setConversations,
    setLoading: s.setLoading,
    isLoading: s.isLoading,
  }));

  const { accentColor, avatarIcon, removeBranding } = useConfigStoreShallow(s => ({
    accentColor: s.accentColor,
    avatarIcon: s.avatarIcon,
    removeBranding: s.removeBranding,
  }));

  const { visitorId, setView, restoreSession } = useWidgetStoreShallow(s => ({
    visitorId: s.visitorId,
    setView: s.setView,
    restoreSession: s.restoreSession,
  }));

  // Load conversations when component mounts
  useEffect(() => {
    if (visitorId) {
      setLoading(true);
      try {
        const allConversations = WidgetStorage.getAllConversations(visitorId);
        setConversations(allConversations);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [visitorId, setConversations, setLoading]);

  const handleConversationClick = (conversation: IConversationPreview) => {
    // Load the specific conversation
    if (chatbotId && visitorId) {
      const session = WidgetStorage.getConversationById(
        conversation.chatbotId,
        visitorId,
        conversation.conversationId
      );
      if (session) {
        // Set this conversation as the active one
        WidgetStorage.setActiveConversationId(chatbotId, visitorId, conversation.conversationId);

        // Restore the conversation in the widget store
        restoreSession(session);
      }
    }
    setView('chat');
  };

  const handleNewChatClick = () => {
    startNewChat();
    setView('chat');
  };

  if (conversations?.length === 0 && !isLoading) {
    return (
      <div className="h-full">
        <Header />
        <div
          className={cn(
            'flex h-[calc(100%-108px)] flex-col items-center justify-center',
            removeBranding && 'h-[calc(100%-68px)]'
          )}
        >
          <EmptyState handleNewChatClick={handleNewChatClick} />
        </div>
        {!removeBranding && <PoweredByLabel />}
      </div>
    );
  }

  return (
    <div className="h-full">
      <Header />

      <ScrollArea className={cn('h-[calc(100%-152px)]', removeBranding && 'h-[calc(100%-120px)]')}>
        <div className="space-y-1 p-4">
          {conversations?.map(conversation => (
            <div
              onClick={() => handleConversationClick(conversation)}
              key={`${conversation.chatbotId}-${conversation.conversationId}`}
              className="flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-colors hover:bg-stone-100"
            >
              <div
                className="size-10 shrink-0 rounded-full bg-stone-100"
                style={{ backgroundColor: accentColor }}
              >
                {avatarIcon && (
                  <img src={avatarIcon} alt="avatar" className="size-full object-cover" />
                )}
              </div>
              <div className="grid space-y-0.5">
                <div className="truncate text-sm font-medium text-stone-900">
                  {conversation.lastMessage.replace(/<[^>]+>/g, '')}
                </div>
                <span className="text-xs font-normal text-stone-500">
                  {formatDate(conversation.lastActivity)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <Footer accentColor={accentColor} handleNewChatClick={handleNewChatClick} />
    </div>
  );
};

const Header = () => {
  return <div className="p-6 text-center text-sm font-semibold text-stone-900">Messages</div>;
};

const Footer = ({
  accentColor,
  handleNewChatClick,
}: {
  accentColor: string;
  handleNewChatClick: () => void;
}) => {
  return (
    <div className="flex w-full flex-col items-center justify-center px-4">
      <button
        onClick={handleNewChatClick}
        className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-white transition-opacity hover:opacity-80"
        style={{ backgroundColor: accentColor }}
      >
        <MessageCirclePlus size={20} />
        Start a new chat
      </button>
      <PoweredByLabel />
    </div>
  );
};

const EmptyState = ({ handleNewChatClick }: { handleNewChatClick: () => void }) => {
  const { accentColor } = useConfigStoreShallow(s => ({
    accentColor: s.accentColor,
  }));
  return (
    <div className="flex flex-col items-center justify-center">
      <MessagesSquare className="mb-5 text-stone-500" size={32} />
      <p className="mb-2 text-center text-sm font-medium text-stone-900">No chats yet</p>
      <p className="mb-8 text-center text-xs text-stone-500">
        Start a conversation and your chats <br /> will show up here.
      </p>
      <button
        className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-white transition-opacity hover:opacity-80"
        style={{ backgroundColor: accentColor }}
        onClick={handleNewChatClick}
      >
        <MessageCirclePlus size={20} />
        Start a new chat
      </button>
    </div>
  );
};

const formatDate = (timestamp: number) => {
  const date = moment(timestamp);
  const today = moment().startOf('day');
  const targetDay = date.startOf('day');
  const diffInDays = today.diff(targetDay, 'days');

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays === 2) return '2 days ago';
  return date.format('MMM D, YYYY');
};
