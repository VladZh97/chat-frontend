import { ArrowLeft, ArrowUp, Ellipsis, Smile, X } from 'lucide-react';
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
import React, { Fragment, memo } from 'preact/compat';
import { useTextOnAccent } from '@/hooks/use-accent-colors';

const Widget = () => {
  const { messages, inputValue, setInputValue, handleSendMessage, isStreaming, streamingHtml } =
    usePlayground();

  return (
    <div className="flex h-full max-h-[600px] w-[416px] grow flex-col rounded-3xl bg-white pb-2 shadow-xl">
      <Header />
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

const Header = () => {
  const { name, publicName } = useChatbotStoreShallow(s => ({
    name: s.name,
    publicName: s.publicName,
  }));
  return (
    <div className="flex items-center p-6">
      <ArrowLeft className="size-5 text-neutral-700" />
      <span className="mr-3 ml-4 truncate text-sm font-semibold text-neutral-900">
        {publicName || name}
      </span>
      <div className="ml-auto flex items-center gap-2">
        <Ellipsis className="size-5 text-neutral-700" />
        <X className="size-5 text-neutral-700" />
      </div>
    </div>
  );
};

const Main = ({
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
  const { initialMessage, removeBranding } = useChatbotStoreShallow(s => ({
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

const Footer = ({
  inputValue,
  setInputValue,
  handleSendMessage,
}: {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  handleSendMessage: (message: { role: 'user' | 'assistant'; content: string }) => void;
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
  handleSendMessage: (message: { role: 'user' | 'assistant'; content: string }) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { removeBranding } = useChatbotStoreShallow(s => ({
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
        <SendButton
          handleSendMessage={() => handleSendMessage({ role: 'user', content: inputValue })}
        />
      </div>
    </div>
  );
};

const SendButton = memo(({ handleSendMessage }: { handleSendMessage: () => void }) => {
  const { accentColor } = useChatbotStoreShallow(s => ({
    accentColor: s.accentColor,
  }));
  const textOnAccent = useTextOnAccent(accentColor);
  return (
    <span
      className="flex size-8 cursor-pointer items-center justify-center rounded-full"
      style={{ backgroundColor: accentColor }}
      onClick={handleSendMessage}
    >
      <ArrowUp style={{ color: textOnAccent.color }} />
    </span>
  );
});

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
        <Fragment key={starter.id}>
          {starter.value && (
            <span
              className="shadow-card flex cursor-pointer items-center justify-center rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-50"
              onClick={() => onSelect(starter.value)}
            >
              {starter.value}
            </span>
          )}
        </Fragment>
      ))}
    </div>
  );
};
