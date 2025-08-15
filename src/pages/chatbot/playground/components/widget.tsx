import {
  ArrowLeft,
  ArrowUp,
  Copy,
  Ellipsis,
  RefreshCw,
  Smile,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import PoveredBy from '@/assets/povered-by.svg?react';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState, type Dispatch } from 'preact/hooks';
import { useMemo } from 'preact/hooks';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from '@/components/ui/emoji-picker';
import type { SetStateAction } from 'preact/compat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePlayground } from '../../hooks';
import React from 'preact/compat';

const Widget = () => {
  const { messages, inputValue, setInputValue, handleSendMessage, isStreaming, streamingHtml } =
    usePlayground();

  return (
    <div className="flex h-full max-h-[600px] w-[416px] grow flex-col rounded-3xl bg-white pb-2 shadow-xl">
      <Header messages={messages} />
      <Main
        messages={messages}
        setMessages={handleSendMessage}
        isStreaming={isStreaming}
        streamingHtml={streamingHtml}
      />
      <Footer
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Widget;

const Header = ({ messages }: { messages: { role: 'user' | 'bot'; content: string }[] }) => {
  const firstMessage = messages[0];

  return (
    <div className="flex items-center justify-between p-6">
      <ArrowLeft className="size-5 text-stone-700" />
      <span className="max-w-[calc(100%-100px)] truncate text-sm font-semibold text-stone-900">
        {!firstMessage ? 'New chat' : firstMessage.content}
      </span>
      <Ellipsis className="size-5 text-stone-700" />
    </div>
  );
};

const Main = ({
  messages,
  setMessages,
  isStreaming,
  streamingHtml,
}: {
  messages: { role: 'user' | 'bot'; content: string }[];
  setMessages: (message: { role: 'user' | 'bot'; content: string }) => void;
  isStreaming: boolean;
  streamingHtml: string;
}) => {
  const { initialMessage, removeBranding } = useChatbotStoreShallow(s => ({
    initialMessage: s.initialMessage,
    removeBranding: s.removeBranding,
  }));

  const messagesWithInitial = useMemo(() => {
    const seed: { role: 'user' | 'bot'; content: string }[] = [];
    if (initialMessage) seed.push({ role: 'bot', content: initialMessage });
    return [...seed, ...messages];
  }, [initialMessage, messages]);

  const groupedMessages = useMemo(() => {
    const groups: Array<{ role: 'user' | 'bot'; messages: string[] }> = [];
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
              {group.role === 'bot'
                ? group.messages.map((msg, idx) => <BotMessage key={idx} message={msg} />)
                : group.messages.map((msg, idx) => <UserMessage key={idx} message={msg} />)}
            </div>
          ))}
          {isStreaming &&
            (streamingHtml ? <BotMessage message={streamingHtml} /> : <BotMessageLoading />)}
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
        <div className="mt-2 flex items-center gap-2">
          <span className="group cursor-pointer">
            <RefreshCw className="size-[14px] text-stone-500 transition-colors group-hover:text-stone-900" />
          </span>
          <span className="group cursor-pointer">
            <Copy className="size-[14px] text-stone-500 transition-colors group-hover:text-stone-900" />
          </span>
          <span className="group cursor-pointer">
            <ThumbsUp className="size-[14px] text-stone-500 transition-colors group-hover:text-stone-900" />
          </span>
          <span className="group cursor-pointer">
            <ThumbsDown className="size-[14px] text-stone-500 transition-colors group-hover:text-stone-900" />
          </span>
        </div>
      </div>
    </div>
  );
};

const BotMessageLoading = () => {
  const { accentColor, avatar } = useChatbotStoreShallow(s => ({
    accentColor: s.accentColor,
    avatar: s.avatarIcon,
  }));
  return (
    <div
      className="flex items-end gap-2"
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      <div className="size-6 overflow-hidden rounded-full" style={{ backgroundColor: accentColor }}>
        {avatar && <img src={avatar} alt="avatar" className="size-full object-cover" />}
      </div>
      <p className="py- flex h-11 items-center gap-1 rounded-2xl rounded-bl-none bg-[var(--accent-color)]/10 px-4">
        <span className="sr-only">Assistant is typing…</span>
        <span className="inline-block size-1.5 animate-bounce rounded-full bg-stone-900 [animation-delay:-0.3s]"></span>
        <span className="inline-block size-1.5 animate-bounce rounded-full bg-stone-900 [animation-delay:-0.15s]"></span>
        <span className="inline-block size-1.5 animate-bounce rounded-full bg-stone-900"></span>
      </p>
    </div>
  );
};

const UserMessage = ({ message }: { message: string }) => {
  const { accentColor } = useChatbotStoreShallow(s => ({
    accentColor: s.accentColor,
  }));
  return (
    <div className="flex justify-end">
      <p
        className="rounded-2xl rounded-br-none px-4 py-3 text-sm font-normal text-white"
        style={{ backgroundColor: accentColor }}
      >
        {message}
      </p>
    </div>
  );
};

const Footer = ({
  inputValue,
  setInputValue,
  handleSendMessage,
}: {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  handleSendMessage: (message: { role: 'user' | 'bot'; content: string }) => void;
}) => {
  return (
    <div className="flex flex-col px-4">
      <InputContainer
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
      />
      <PoweredBy />
    </div>
  );
};

const InputContainer = ({
  inputValue,
  setInputValue,
  handleSendMessage,
}: {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  handleSendMessage: (message: { role: 'user' | 'bot'; content: string }) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { accentColor, removeBranding } = useChatbotStoreShallow(s => ({
    accentColor: s.accentColor,
    removeBranding: s.removeBranding,
  }));
  return (
    <div
      className={cn(
        'flex h-14 items-center rounded-xl bg-stone-100 py-3 pr-3 pl-4',
        removeBranding && 'mb-2'
      )}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Ask me anything"
        className="grow border-none text-sm font-normal text-stone-900 outline-none placeholder:text-stone-900/40 focus:outline-none focus-visible:outline-none"
        value={inputValue}
        onChange={e => setInputValue((e.target as HTMLInputElement).value)}
        onKeyPress={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage({ role: 'user', content: inputValue });
          }
        }}
      />
      <div className="ml-2 flex shrink-0 items-center gap-4">
        <Popover onOpenChange={setIsOpen} open={isOpen}>
          <PopoverTrigger asChild>
            <div className="group cursor-pointer">
              <Smile className="size-5 text-stone-400 transition-colors group-hover:text-stone-900" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-0">
            <EmojiPicker
              className="h-[342px]"
              onEmojiSelect={({ emoji }) => {
                setIsOpen(false);
                if (inputRef.current) {
                  setInputValue(prev => prev + emoji);
                  inputRef.current.focus();
                }
              }}
            >
              <EmojiPickerSearch />
              <EmojiPickerContent />
              <EmojiPickerFooter />
            </EmojiPicker>
          </PopoverContent>
        </Popover>

        <span
          className="flex size-8 cursor-pointer items-center justify-center rounded-full text-white"
          style={{ backgroundColor: accentColor }}
          onClick={() => handleSendMessage({ role: 'user', content: inputValue })}
        >
          <ArrowUp />
        </span>
      </div>
    </div>
  );
};

const PoweredBy = () => {
  const { removeBranding } = useChatbotStoreShallow(s => ({
    removeBranding: s.removeBranding,
  }));
  if (removeBranding) return null;
  return (
    <div className="mt-2 flex h-8 items-center justify-center gap-1.5 text-xs text-stone-500">
      Powered by
      <PoveredBy />
    </div>
  );
};

const StarterMessages = ({
  hasMessages,
  onSelect,
}: {
  hasMessages: boolean;
  onSelect: (starter: string) => void;
}) => {
  const { conversationStarters } = useChatbotStoreShallow(s => ({
    conversationStarters: s.conversationStarters,
  }));
  if (conversationStarters.length === 0 || hasMessages) return null;
  return (
    <div className="absolute bottom-0 left-0 mt-auto flex w-full flex-wrap justify-end gap-2 p-6">
      {conversationStarters.map(starter => (
        <span
          key={starter.id}
          className="flex cursor-pointer items-center justify-center rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-stone-900 shadow transition-colors hover:bg-stone-50"
          onClick={() => onSelect(starter.value)}
        >
          {starter.value}
        </span>
      ))}
    </div>
  );
};
