import { ArrowLeft, ArrowUp, Bot, Ellipsis } from 'lucide-react';
import PoveredBy from '@/assets/povered-by.svg?react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import chat from '@/api/chat';
import { useEffect, useState, useRef, useMemo } from 'preact/hooks';
import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';

const Widget = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'bot'; content: string }>>([
    { role: 'bot', content: 'How can I help you?' },
  ]);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const streamingMessageRef = useRef('');

  const { mutate: auth, isPending } = useMutation({
    mutationFn: () => chat.auth(id as string),
  });

  useEffect(() => {
    if (id) auth();
  }, [auth, id]);

  const handleSendMessage = async (message: string) => {
    if (isPending || isStreaming || !message.trim()) return;

    // Add user message
    const userMessage = { role: 'user' as const, content: message };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsStreaming(true);
    setCurrentStreamingMessage('');
    streamingMessageRef.current = '';

    try {
      await chat.sendMessageStream(id as string, message, chunk => {
        const newContent = streamingMessageRef.current + chunk.chunk;
        streamingMessageRef.current = newContent;
        setCurrentStreamingMessage(newContent);
      });

      // Add the complete assistant message
      if (streamingMessageRef.current) {
        setMessages(prev => [...prev, { role: 'bot', content: streamingMessageRef.current }]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsStreaming(false);
      setCurrentStreamingMessage('');
    }
  };

  const hasUserMessage = useMemo(() => {
    return messages.some(message => message.role === 'user');
  }, [messages.length]);

  const handleStartConversation = (starter: string) => {
    handleSendMessage(starter);
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mx-auto flex w-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="relative flex items-center justify-between px-4 pt-6 pb-6">
          <ArrowLeft className="size-4 cursor-pointer text-stone-700" />
          <span className="absolute left-1/2 -translate-x-1/2 text-lg font-medium text-stone-900">
            New chat
          </span>
          <Ellipsis className="size-4 cursor-pointer text-stone-700" />
        </div>
        <ScrollArea className="h-[calc(100vh-400px)] max-h-[500px] grow">
          <div className="space-y-6 p-4 pb-8">
            {useMemo(() => {
              const groups: Array<{ role: 'user' | 'bot'; messages: string[] }> = [];
              for (const m of messages) {
                const last = groups[groups.length - 1];
                if (last && last.role === m.role) last.messages.push(m.content);
                else groups.push({ role: m.role, messages: [m.content] });
              }
              return groups.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className={`flex items-start gap-2 ${group.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {group.role === 'bot' && (
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white">
                      <Bot className="size-3" />
                    </span>
                  )}
                  <div
                    className={`flex flex-col gap-1 ${group.role === 'user' ? 'items-end' : ''}`}
                  >
                    {group.messages.map((content, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'block rounded-xl px-4 py-3 text-sm font-normal',
                          'prose prose-sm prose-neutral',
                          group.role === 'user'
                            ? 'text-white last:rounded-br-none'
                            : 'text-stone-900 last:rounded-bl-none'
                        )}
                        style={{
                          backgroundColor: group.role === 'user' ? '#000' : '#0000001A',
                        }}
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
                      />
                    ))}
                  </div>
                </div>
              ));
            }, [messages])}

            {/* Display streaming message */}
            {isStreaming && currentStreamingMessage && (
              <div className="flex items-end gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white">
                  <Bot className="size-3" />
                </span>
                <div className="flex flex-col gap-1">
                  <div
                    className="block rounded-xl px-4 py-3 text-sm font-normal text-stone-900 last:rounded-bl-none"
                    style={{ backgroundColor: `#0000001A` }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(currentStreamingMessage),
                    }}
                  />
                </div>
              </div>
            )}

            {/* Display loading indicator when streaming but no message yet */}
            {isStreaming && !currentStreamingMessage && (
              <div className="flex items-end gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white">
                  <Bot className="size-3" />
                </span>
                <div className="flex flex-col gap-1">
                  <span
                    className="flex h-8 w-14 items-center justify-center rounded-xl text-sm font-normal text-stone-900 last:rounded-bl-none"
                    style={{ backgroundColor: `#0000001A` }}
                  >
                    <div className="flex items-center gap-0.5">
                      <div className="size-2 animate-bounce rounded-full bg-stone-900 [animation-delay:-0.3s]"></div>
                      <div className="size-2 animate-bounce rounded-full bg-stone-900 [animation-delay:-0.15s]"></div>
                      <div className="size-2 animate-bounce rounded-full bg-stone-900"></div>
                    </div>
                  </span>
                </div>
              </div>
            )}
          </div>
          {!hasUserMessage && <ChatStarters handleStartConversation={handleStartConversation} />}
        </ScrollArea>

        <div className="mt-auto flex items-center gap-2 border-t border-stone-200 p-4">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue((e.target as HTMLInputElement).value)}
            onKeyPress={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputValue);
              }
            }}
            placeholder="Type your message here..."
            className="grow text-base font-normal text-stone-900 outline-none placeholder:text-stone-900/40"
            disabled={isStreaming}
          />
          <div
            onClick={() => handleSendMessage(inputValue)}
            className={`group flex size-10 cursor-pointer items-center justify-center rounded-full text-white transition-opacity ${
              isStreaming ? 'cursor-not-allowed opacity-50' : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: '#000',
              boxShadow: '0px 3px 2px 0px rgba(255, 255, 255, 0.25) inset',
            }}
          >
            <ArrowUp className="size-6" />
          </div>
        </div>
        {/* {!removeBranding && ( */}
        <div className="flex h-8 items-center justify-center gap-2 border-t border-stone-200 bg-stone-100 text-xs text-stone-500">
          Povered by
          <PoveredBy />
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default Widget;

const ChatStarters = ({
  handleStartConversation,
}: {
  handleStartConversation: (starter: string) => void;
}) => {
  return (
    <div className="absolute right-0 bottom-0 left-0 mt-auto flex flex-wrap items-center justify-end gap-2 px-4 py-6">
      <div
        className="cursor-pointer rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-900 shadow transition-colors hover:bg-stone-50"
        onClick={() => handleStartConversation('What is the weather in Tokyo?')}
      >
        What is the weather in Tokyo?
      </div>
      <div
        className="cursor-pointer rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-900 shadow transition-colors hover:bg-stone-50"
        onClick={() => handleStartConversation('Conversation starter #2')}
      >
        Conversation starter #2
      </div>
    </div>
  );
};
