import { useEffect, useRef, useState } from 'preact/hooks';
import type { ChatStreamEvent } from '@/api/widget';
import { useParams } from 'react-router-dom';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import chatbot from '@/api/chatbot';
import { toast } from 'sonner';

export const usePlayground = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingHtml, setStreamingHtml] = useState('');
  const streamingHtmlRef = useRef('');
  const { id: chatbotId } = useParams();
  const { promptPreset, prompt } = useChatbotStoreShallow(s => ({
    promptPreset: s.promptPreset,
    prompt: s.prompt,
  }));

  useEffect(() => {
    setMessages([]);
  }, [promptPreset, prompt]);

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
        promptPreset,
        prompt,
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
    } catch (error) {
      console.error('Error in playground message stream:', error);
      if (error instanceof Error && error.message.includes('429')) {
        toast.error('Rate limit exceeded. Please wait a moment before trying again.');
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } finally {
      setIsStreaming(false);
    }
  };

  return { messages, inputValue, setInputValue, handleSendMessage, isStreaming, streamingHtml };
};
