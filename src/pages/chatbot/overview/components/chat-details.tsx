import { cn } from '@/lib/utils';
import {
  Ellipsis,
  Loader2,
  MessageCircle,
  MessageSquareMore,
  MessageSquareText,
  Trash,
} from 'lucide-react';
import { TABLE_SIZES } from '../constants';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { messages } from '@/api/messages';
import { useState } from 'preact/hooks';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import moment from 'moment';
import { ConversationDetails } from './conversation-details';
import type { TConversation } from '../../types';
import { toast } from 'sonner';
import queryClient from '@/lib/query';

const ChatDetails = () => {
  const { id } = useParams();
  const [selectedConversation, setSelectedConversation] = useState<TConversation | null>(null);
  const { data: conversations } = useQuery({
    queryKey: messages.getConversations.key(id!),
    queryFn: () => messages.getConversations.query(id!),
  });
  const handleSelectConversation = (conversation: TConversation) => {
    setSelectedConversation(conversation);
  };
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow">
      <div className="pb-6">
        <div className="mb-1 flex items-center gap-2 text-base font-semibold text-stone-900">
          <MessageSquareText className="size-4 text-stone-500" />
          Chats details
        </div>
        <span className="text-sm text-stone-700">Showing recent chats and its details</span>
      </div>
      <div className="divide-y divide-stone-200 rounded-md border border-stone-200 bg-white shadow-sm">
        <div className="flex h-10 items-center text-sm font-medium text-stone-500">
          <span className={cn(TABLE_SIZES.STATUS, 'px-3')}>Status</span>
          <span className={cn(TABLE_SIZES.INITIAL_MESSAGE, 'px-3')}>Initial message</span>
          <span className={cn(TABLE_SIZES.MESSAGES, 'px-3')}>Messages</span>
          <span className={cn(TABLE_SIZES.DATE, 'px-3')}>Date</span>
          <span className={cn(TABLE_SIZES.ACTIONS, 'px-3')}></span>
        </div>
        {conversations?.map((conversation: TConversation) => (
          <Row
            key={conversation.conversationId}
            conversation={conversation}
            onSelectConversation={handleSelectConversation}
            chatbotId={id!}
          />
        ))}
        {conversations?.length === 0 && <EmptyState />}
      </div>
      {selectedConversation && (
        <ConversationDetails
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          chatbotId={id!}
        />
      )}
    </div>
  );
};

export default ChatDetails;

const Row = ({
  conversation,
  onSelectConversation,
  chatbotId,
}: {
  conversation: TConversation;
  onSelectConversation: (conversation: TConversation) => void;
  chatbotId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const status =
    moment().diff(moment(conversation.lastMessageTime), 'minutes') > 5 ? 'Finished' : 'Live';

  const { mutate: deleteConversation, isPending } = useMutation({
    mutationFn: () => messages.deleteConversation.query(chatbotId, conversation.conversationId),
    onSuccess: () => {
      toast.success('Conversation deleted successfully');
      queryClient.setQueryData(messages.getConversations.key(chatbotId), (old: TConversation[]) =>
        old.filter(c => c.conversationId !== conversation.conversationId)
      );
      queryClient.invalidateQueries({
        queryKey: messages.getMessages.key(chatbotId, conversation.conversationId),
      });
    },
    onError: () => {
      toast.error('Failed to delete conversation');
    },
  });

  return (
    <div
      className={cn(
        'flex h-[54px] items-center text-sm font-medium text-stone-500 transition-colors last:rounded-b-md hover:bg-stone-50',
        isOpen && 'bg-stone-50'
      )}
    >
      <span className={cn(TABLE_SIZES.STATUS, 'px-3')}>
        <span
          className={cn(
            'inline-flex h-[22px] items-center justify-center rounded-md bg-stone-100 px-2.5 text-xs font-semibold text-stone-700',
            status === 'Live' && 'bg-green-200 text-green-800'
          )}
        >
          {status}
        </span>
      </span>
      <div className={cn(TABLE_SIZES.INITIAL_MESSAGE, 'px-3')}>
        <div
          className="max-w-80 truncate [&>*]:inline"
          dangerouslySetInnerHTML={{ __html: conversation.firstMessage.message }}
        />
      </div>
      <span className={cn(TABLE_SIZES.MESSAGES, 'px-3')}>{conversation.totalMessages}</span>
      <span className={cn(TABLE_SIZES.DATE, 'px-3')}>
        {moment(conversation.date).local().format('MMMM D, YYYY • hh:mm A')}
      </span>
      <span className={cn(TABLE_SIZES.ACTIONS, 'px-3')}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger>
            <span
              className={cn(
                'flex size-8 cursor-pointer items-center justify-center rounded-md text-stone-900 transition-colors hover:bg-stone-200',
                isOpen && 'bg-stone-200'
              )}
            >
              <Ellipsis className="size-4" />
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-48 space-y-1 rounded-lg bg-white p-2 shadow-lg">
            <div
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-stone-900 hover:bg-stone-100"
              onClick={() => {
                setIsOpen(false);
                onSelectConversation(conversation);
              }}
            >
              <MessageSquareMore className="size-4" />
              Chat details
            </div>
            <div
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-red-600 hover:bg-red-50',
                isPending && 'cursor-default'
              )}
              onClick={() => {
                if (isPending) return;
                deleteConversation();
              }}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash className="size-4" />
              )}
              Delete conversation
            </div>
          </PopoverContent>
        </Popover>
      </span>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted mb-4 rounded-full p-4">
        <MessageCircle className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">No chats yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        You'll see all your chat conversations here once users start chatting with your chatbot.
      </p>
    </div>
  );
};
