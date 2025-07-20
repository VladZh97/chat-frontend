import { ArrowLeft, ArrowUp, Bot, Ellipsis } from 'lucide-react';
import PoveredBy from '@/assets/povered-by.svg?react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import chat from '@/api/chat';
import { useEffect, useState, useRef } from 'preact/hooks';
import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';

const ChatRoot = () => {
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

  return (
    <div className="flex flex-col">
      <div className="mx-auto flex w-full grow flex-col overflow-hidden bg-white shadow-sm">
        <div className="relative flex items-center justify-between px-4 pt-6 pb-6">
          <ArrowLeft className="size-4 cursor-pointer text-neutral-700" />
          <span className="absolute left-1/2 -translate-x-1/2 text-lg font-medium text-neutral-900">
            New chat
          </span>
          <Ellipsis className="size-4 cursor-pointer text-neutral-700" />
        </div>
        <ScrollArea className="h-[calc(100vh-400px) grow">
          <div className="space-y-6 p-4 pb-8">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {message.role === 'bot' && (
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
                    <Bot className="size-3" />
                  </span>
                )}
                <div
                  className={`flex flex-col gap-1 ${message.role === 'user' ? 'items-end' : ''}`}
                >
                  <div
                    className={cn(
                      'block rounded-xl px-4 py-3 text-sm font-normal',
                      'prose prose-sm prose-neutral',
                      message.role === 'user'
                        ? 'text-white last:rounded-br-none'
                        : 'text-neutral-900 last:rounded-bl-none'
                    )}
                    style={{
                      backgroundColor: message.role === 'user' ? '#000' : '#0000001A',
                    }}
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />
                </div>
              </div>
            ))}

            {/* Display streaming message */}
            {isStreaming && currentStreamingMessage && (
              <div className="flex items-end gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <Bot className="size-3" />
                </span>
                <div className="flex flex-col gap-1">
                  <div
                    className="block rounded-xl px-4 py-3 text-sm font-normal text-neutral-900 last:rounded-bl-none"
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
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <Bot className="size-3" />
                </span>
                <div className="flex flex-col gap-1">
                  <span
                    className="flex h-8 w-14 items-center justify-center rounded-xl text-sm font-normal text-neutral-900 last:rounded-bl-none"
                    style={{ backgroundColor: `#0000001A` }}
                  >
                    <div className="flex items-center gap-0.5">
                      <div className="size-2 animate-bounce rounded-full bg-neutral-900 [animation-delay:-0.3s]"></div>
                      <div className="size-2 animate-bounce rounded-full bg-neutral-900 [animation-delay:-0.15s]"></div>
                      <div className="size-2 animate-bounce rounded-full bg-neutral-900"></div>
                    </div>
                  </span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="mt-auto flex items-center gap-2 border-t border-neutral-200 p-4">
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
            className="grow text-base font-normal text-neutral-900 outline-none placeholder:text-neutral-900/40"
            disabled={isStreaming}
          />
          <div
            onClick={() => handleSendMessage(inputValue)}
            className={`group flex size-10 cursor-pointer items-center justify-center rounded-full text-white transition-opacity ${
              isStreaming ? 'cursor-not-allowed opacity-50' : 'hover:opacity-80'
            }`}
            style={{ backgroundColor: '#000' }}
          >
            <ArrowUp className="size-6" />
          </div>
        </div>
        {/* {!removeBranding && ( */}
        <div className="flex items-center justify-center gap-2 bg-neutral-950 py-2.5 text-xs text-neutral-400">
          Povered by
          <PoveredBy />
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default ChatRoot;
