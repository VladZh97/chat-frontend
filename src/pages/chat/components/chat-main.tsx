import { useConfigStoreShallow } from '../store';
import { useMemo } from 'preact/hooks';
import { useEffect } from 'preact/hooks';
import { useRef } from 'preact/hooks';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AssistantMessage } from './assistant-message';
import { UserMessage } from './user-message';
import { StarterMessages } from './starter-messages';
import { AssistantMessageLoading } from './assistant-message-loading';

export const ChatMain = ({
  messages,
  setMessages,
  isStreaming,
  streamingHtml,
}: {
  messages: { role: 'user' | 'assistant'; content: string }[];
  setMessages: (message: { role: 'user' | 'assistant'; content: string }) => void;
  isStreaming: boolean;
  streamingHtml: string;
}) => {
  const { initialMessage, removeBranding } = useConfigStoreShallow(s => ({
    initialMessage: s.initialMessage,
    removeBranding: s.removeBranding,
  }));

  const messagesWithInitial = useMemo(() => {
    const seed: { role: 'user' | 'assistant'; content: string }[] = [];
    if (initialMessage) seed.push({ role: 'assistant', content: initialMessage });
    return [...seed, ...messages];
  }, [initialMessage, messages]);

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

  // Ref for the scrollable area
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current.closest(
        '[data-slot="scroll-area-viewport"]'
      ) as HTMLDivElement;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [groupedMessages.length, isStreaming, streamingHtml]);

  return (
    <ScrollArea className={cn('h-[calc(100%-164px)]', removeBranding && 'h-[calc(100%-132px)]')}>
      <div className="flex flex-1 flex-col" ref={scrollRef}>
        <div className="space-y-4 p-6">
          {groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-1">
              {group.role === 'assistant'
                ? group.messages.map((msg, idx) => <AssistantMessage key={idx} message={msg} />)
                : group.messages.map((msg, idx) => <UserMessage key={idx} message={msg} />)}
            </div>
          ))}
          {isStreaming &&
            (streamingHtml ? (
              <AssistantMessage message={streamingHtml} />
            ) : (
              <AssistantMessageLoading />
            ))}
        </div>
        <StarterMessages
          hasMessages={messages.length > 0}
          onSelect={starter => {
            setMessages({ role: 'user', content: starter });
          }}
        />
      </div>
    </ScrollArea>
  );
};
