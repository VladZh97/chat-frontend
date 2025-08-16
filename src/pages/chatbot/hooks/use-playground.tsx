import { useEffect, useRef, useState } from 'preact/hooks';
import type { ChatStreamEvent } from '@/api/chat';
import { useParams } from 'react-router-dom';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import chatbot from '@/api/chatbot';

export const usePlayground = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingHtml, setStreamingHtml] = useState('');
  const streamingHtmlRef = useRef('');
  const { id: chatbotId } = useParams();
  const { promptValue } = useChatbotStoreShallow(s => ({
    promptValue: s.promptValue,
  }));

  useEffect(() => {
    setMessages([]);
  }, [promptValue]);

  const handleSendMessage = async ({
    role,
    content,
  }: {
    role: 'user' | 'assistant';
    content: string;
  }) => {
    if (isStreaming || !content.trim()) return;
    const updatedMessages = [...messages, { role, content }];
    setMessages(updatedMessages);
    setInputValue('');
    setStreamingHtml('');
    streamingHtmlRef.current = '';
    setIsStreaming(true);

    try {
      await chatbot.sendPlaygroundMessageStream(
        chatbotId!,
        updatedMessages,
        promptValue,
        (evt: ChatStreamEvent) => {
          if (evt.type === 'connected') return;
          if (evt.type === 'chunk') {
            setStreamingHtml(prev => {
              const next = prev + (evt.content ?? '');
              streamingHtmlRef.current = next;
              return next;
            });
            return;
          }
          if (evt.type === 'complete') {
            const finalContent = evt.fullResponse ?? streamingHtmlRef.current;
            setMessages(prev => [...prev, { role: 'assistant', content: finalContent }]);
            setStreamingHtml('');
            streamingHtmlRef.current = '';
          }
        }
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return { messages, inputValue, setInputValue, handleSendMessage, isStreaming, streamingHtml };
};
