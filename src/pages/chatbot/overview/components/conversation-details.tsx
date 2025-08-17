import { messages } from '@/api/messages';
import { Button } from '@/components/ui/button';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Calendar,
  Download,
  Loader2,
  Mail,
  MessageSquareText,
  RefreshCw,
  Trash,
  X,
} from 'lucide-react';
import { createPortal, useMemo } from 'preact/compat';
import type { TConversation } from '../../types';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { TMessage } from '@/types/message.type';
import moment from 'moment';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import queryClient from '@/lib/query';
import { useTextOnAccent } from '@/hooks/use-accent-colors';

export const ConversationDetails = ({
  selectedConversation,
  setSelectedConversation,
  chatbotId,
}: {
  selectedConversation: TConversation;
  setSelectedConversation: (conversation: TConversation | null) => void;
  chatbotId: string;
}) => {
  const { data, refetch, isLoading, isRefetching } = useQuery({
    queryKey: messages.getMessages.key(chatbotId, selectedConversation.conversationId),
    queryFn: () => messages.getMessages.query(chatbotId, selectedConversation.conversationId),
  });

  const { mutate: deleteConversation, isPending: isDeleting } = useMutation({
    mutationFn: () =>
      messages.deleteConversation.query(chatbotId, selectedConversation.conversationId),
    onSuccess: () => {
      toast.success('Conversation deleted successfully');
      setSelectedConversation(null);
      queryClient.setQueryData(messages.getConversations.key(chatbotId), (old: TConversation[]) =>
        old.filter(c => c.conversationId !== selectedConversation.conversationId)
      );
      queryClient.invalidateQueries({
        queryKey: messages.getMessages.key(chatbotId, selectedConversation.conversationId),
      });
    },
    onError: () => {
      toast.error('Failed to delete conversation');
    },
  });

  const messagesWithInitial = useMemo(() => {
    return [...(data || []).map((m: TMessage) => ({ role: m.sender, content: m.message }))];
  }, [data]);

  const groupedMessages = useMemo(() => {
    const groups: Array<{ role: 'user' | 'assistant'; messages: string[] }> = [];
    for (const m of messagesWithInitial) {
      const last = groups[groups.length - 1];
      if (last && last.role === m.role) {
        last.messages.push(m.content);
      } else {
        groups.push({ role: m.role, messages: [m.content] });
      }
    }
    return groups;
  }, [messagesWithInitial]);

  const handleExport = () => {
    if (!data || !Array.isArray(data)) return;
    const lines = data
      .map((msg: TMessage) => {
        const date = msg.createdAt ? moment(msg.createdAt).format('YYYY-MM-DD HH:mm:ss') : '';
        const role = msg.sender === 'assistant' ? 'assistant' : 'user';
        const content = msg.message || '';
        return `[${date}] ${role}: ${content}`;
      })
      .join('\n');
    const blob = new Blob([lines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedConversation.conversationId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return createPortal(
    <div className="fixed top-2 right-2 flex h-[calc(100vh-16px)] w-[564px] flex-col rounded-xl bg-white p-6 shadow-xl">
      <div className="group absolute top-3 right-3 cursor-pointer">
        <X
          className="size-4 text-stone-900 transition-colors group-hover:text-stone-500"
          onClick={() => setSelectedConversation(null)}
        />
      </div>
      <span className="mb-4 block text-lg font-semibold text-stone-950">Chat details</span>
      <div
        className={cn(
          'mb-8 grid grid-cols-[auto_auto_auto] gap-4 border-b border-stone-200 pb-8',
          !selectedConversation.visitorEmail && 'grid-cols-[auto_auto]'
        )}
      >
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-normal text-stone-500">
            <Calendar className="size-4 text-stone-500" />
            Date
          </div>
          <span className="text-sm font-medium text-stone-950">
            {moment(selectedConversation.date).local().format('MMMM D, YYYY • hh:mm A')}
          </span>
        </div>
        {selectedConversation.visitorEmail && (
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-normal text-stone-500">
              <Mail className="size-4 text-stone-500" />
              Email
            </div>
            <span className="block max-w-44 truncate text-sm font-medium text-stone-950">
              {selectedConversation.visitorEmail}
            </span>
          </div>
        )}
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-normal text-stone-500">
            <MessageSquareText className="size-4 text-stone-500" />
            Messages
          </div>
          <span className="text-sm font-medium text-stone-950">
            {selectedConversation.totalMessages}
          </span>
        </div>
      </div>
      <span className="mb-4 block text-lg font-semibold text-stone-950">Chatlog</span>
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="grow">
          <div className="space-y-4 p-6">
            {isLoading || isRefetching ? (
              <SkeletonMessages />
            ) : (
              groupedMessages.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-1">
                  {group.role === 'assistant'
                    ? group.messages.map((msg, idx) => <BotMessage key={idx} message={msg} />)
                    : group.messages.map((msg, idx) => <UserMessage key={idx} message={msg} />)}
                </div>
              ))
            )}
          </div>
        </div>
      </ScrollArea>

      <div className="flex gap-2 pt-2">
        <Button
          variant="destructive"
          className={cn('mr-auto', isDeleting && 'cursor-default')}
          onClick={() => {
            if (isDeleting) return;
            deleteConversation();
          }}
        >
          {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash className="size-4" />}
          Delete conversation
        </Button>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="size-4" />
          Refresh
        </Button>
        <Button onClick={handleExport}>
          <Download className="size-4" />
          Export
        </Button>
      </div>
    </div>,
    document.body
  );
};

const BotMessage = ({ message }: { message: string }) => {
  const { accentColor, avatar } = useChatbotStoreShallow(s => ({
    accentColor: s.accentColor,
    avatar: s.avatarIcon,
  }));
  if (!message) return null;
  return (
    <div
      className="flex items-end gap-2"
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      <div
        className="size-6 shrink-0 overflow-hidden rounded-full"
        style={{ backgroundColor: accentColor }}
      >
        {avatar && <img src={avatar} alt="avatar" className="size-full object-cover" />}
      </div>
      <div className="flex flex-col">
        <div
          className="prose rounded-2xl rounded-bl-none bg-[var(--accent-color)]/10 px-4 py-3 text-sm font-normal text-stone-900"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </div>
    </div>
  );
};

const UserMessage = ({ message }: { message: string }) => {
  const { accentColor } = useChatbotStoreShallow(s => ({
    accentColor: s.accentColor,
  }));
  const textOnAccent = useTextOnAccent(accentColor);
  return (
    <div className="flex justify-end">
      <p
        className="rounded-2xl rounded-br-none px-4 py-3 text-sm font-normal"
        style={{ backgroundColor: accentColor, color: textOnAccent.color }}
      >
        {message}
      </p>
    </div>
  );
};

const SkeletonBotMessage = () => {
  return (
    <div className="flex animate-pulse items-end gap-2">
      <div className="size-6 shrink-0 overflow-hidden rounded-full bg-stone-200" />
      <div className="flex flex-col">
        <div className="h-11 w-44 rounded-2xl rounded-bl-none bg-stone-200 px-4 py-3" />
      </div>
    </div>
  );
};

const SkeletonUserMessage = () => {
  return (
    <div className="flex animate-pulse justify-end">
      <div className="h-11 w-40 rounded-2xl rounded-br-none bg-stone-200 px-4 py-3 text-sm font-normal text-white" />
    </div>
  );
};

const SkeletonMessages = () => {
  return (
    <>
      <SkeletonUserMessage />
      <SkeletonBotMessage />
      <SkeletonUserMessage />
      <SkeletonBotMessage />
    </>
  );
};
