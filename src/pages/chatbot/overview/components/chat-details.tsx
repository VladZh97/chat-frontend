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
import { useMutation, useInfiniteQuery } from '@tanstack/react-query';
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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useInfiniteQuery({
      queryKey: messages.getConversations.key(id!),
      queryFn: ({ pageParam = 1 }) => messages.getConversations.query(id!, pageParam),
      getNextPageParam: (lastPage, allPages) => {
        // Check if lastPage has the expected structure (new format)
        if (lastPage && typeof lastPage === 'object' && 'hasMore' in lastPage) {
          return lastPage.hasMore ? allPages.length + 1 : undefined;
        }

        // Fallback for array response (old format)
        if (Array.isArray(lastPage)) {
          // If we got a full page (2 items), there might be more
          return lastPage.length === 2 ? allPages.length + 1 : undefined;
        }

        return undefined;
      },
      initialPageParam: 1,
    });

  const conversations =
    data?.pages.flatMap(page => {
      // Handle new paginated response format
      if (page && typeof page === 'object' && 'conversations' in page) {
        return page.conversations;
      }
      // Handle old array format as fallback
      return Array.isArray(page) ? page : [];
    }) || [];

  if (error) {
    console.error('API Error:', error);
  }
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
          <span className={cn(TABLE_SIZES.INITIAL_MESSAGE, 'px-3')}>Welcome message</span>
          <span className={cn(TABLE_SIZES.EMAIL, 'px-3')}>Email</span>
          <span className={cn(TABLE_SIZES.MESSAGES, 'px-3')}>Messages</span>
          <span className={cn(TABLE_SIZES.DATE, 'px-3')}>Date</span>
          <span className={cn(TABLE_SIZES.ACTIONS, 'px-3')}></span>
        </div>
        {!isLoading &&
          conversations?.map((conversation: TConversation) => (
            <Row
              key={conversation.conversationId}
              conversation={conversation}
              onSelectConversation={handleSelectConversation}
              chatbotId={id!}
            />
          ))}
        {isLoading && Array.from({ length: 5 }).map((_, index) => <SkeletonRow key={index} />)}
        {!isLoading && conversations?.length === 0 && <EmptyState />}
        {!isLoading && conversations?.length > 0 && hasNextPage && (
          <div className="flex h-[54px] items-center justify-center">
            {isFetchingNextPage && (
              <div className="flex items-center gap-1 text-xs text-stone-400">
                <Loader2 className="size-4 animate-spin" />
                Loading more conversations...
              </div>
            )}
            {!isFetchingNextPage && hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                className="cursor-pointer text-xs text-stone-400 transition-colors hover:text-stone-600"
              >
                Load more conversations
              </button>
            )}
          </div>
        )}
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
      // Update infinite query cache by removing the deleted conversation from all pages
      queryClient.setQueryData(messages.getConversations.key(chatbotId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            conversations: (page.conversations || page).filter(
              (c: TConversation) => c.conversationId !== conversation.conversationId
            ),
          })),
        };
      });
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
      <span className={cn(TABLE_SIZES.EMAIL, 'truncate px-3')}>
        {conversation.visitorEmail || ''}
      </span>
      <span className={cn(TABLE_SIZES.MESSAGES, 'px-3')}>{conversation.totalMessages}</span>
      <span className={cn(TABLE_SIZES.DATE, 'px-3')}>
        {moment(conversation.date).local().format('MMM D, YYYY • hh:mm A')}
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

const SkeletonRow = () => {
  return (
    <div className="flex h-[54px] items-center text-sm font-medium text-stone-500 transition-colors last:rounded-b-md">
      <span className={cn(TABLE_SIZES.STATUS, 'px-3')}>
        <div className="h-[22px] w-16 animate-pulse rounded-md bg-stone-100" />
      </span>
      <div className={cn(TABLE_SIZES.INITIAL_MESSAGE, 'px-3')}>
        <span className="block h-3 w-48 animate-pulse rounded-md bg-stone-100"></span>
      </div>
      <span className={cn(TABLE_SIZES.MESSAGES, 'px-3')}>
        <span className="block h-4 w-2 animate-pulse rounded-md bg-stone-100"></span>
      </span>
      <span className={cn(TABLE_SIZES.DATE, 'px-3')}>
        <span className="block h-3 w-44 animate-pulse rounded-md bg-stone-100"></span>
      </span>
      <span className={cn(TABLE_SIZES.ACTIONS, 'px-3')}>
        <span className="flex size-8 cursor-pointer items-center justify-center rounded-md text-stone-900 transition-colors hover:bg-stone-200">
          <Ellipsis className="size-4 animate-pulse text-stone-500" />
        </span>
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
