import { useRef, useState } from 'preact/hooks';
import { v4 as uuidv4 } from 'uuid';
import widgetApiService from '@/api/widget';
import { findSafeFlushIndex } from '@/pages/usage/utils';
import { WidgetStorage, type IWidgetMessage } from '@/utils/widget-storage';

interface UseSendMessageParams {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  conversationId: string | null;
  setConversationId: (id: string) => void;
  addMessage: (message: IWidgetMessage) => void;
  isAuthenticated: boolean;
  accessToken?: string | null;
  chatbotId?: string;
  visitorId?: string;
  handleApiError: (error: unknown) => Promise<boolean>;
  clearInput: () => void;
}

export const useSendMessage = ({
  messages,
  conversationId,
  setConversationId,
  addMessage,
  isAuthenticated,
  accessToken,
  chatbotId,
  visitorId,
  handleApiError,
  clearInput,
}: UseSendMessageParams) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingHtml, setStreamingHtml] = useState('');
  const streamingHtmlRef = useRef('');
  const pendingRef = useRef('');
  const fullAccumulatedRef = useRef('');

  const handleSendMessage = async ({
    role,
    content,
  }: {
    role: 'user' | 'assistant';
    content: string;
  }) => {
    if (isStreaming || !content.trim() || !isAuthenticated || !accessToken) return;

    let currentConversationId = conversationId ?? undefined;
    if (!currentConversationId) {
      currentConversationId = uuidv4();
      setConversationId(currentConversationId);
    }

    const userMessage: IWidgetMessage = {
      role,
      content,
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    if (chatbotId && visitorId) {
      WidgetStorage.addMessage(chatbotId, visitorId, userMessage);
    }

    clearInput();
    setStreamingHtml('');
    streamingHtmlRef.current = '';
    pendingRef.current = '';
    fullAccumulatedRef.current = '';
    setIsStreaming(true);

    try {
      const messageHistory = messages.concat(userMessage).map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      await widgetApiService.sendMessageStream(
        {
          chatbotId: chatbotId!,
          visitorId: visitorId!,
          conversationId: currentConversationId!,
          message: content,
          messageHistory,
        },
        accessToken,
        evt => {
          if (evt.type === 'connected') return;
          if (evt.type === 'chunk') {
            const incoming = evt.content ?? '';
            fullAccumulatedRef.current += incoming;
            pendingRef.current += incoming;

            const safeIndex = findSafeFlushIndex(pendingRef.current);
            if (safeIndex >= 0) {
              const flushChunk = pendingRef.current.slice(0, safeIndex + 1);
              const remainder = pendingRef.current.slice(safeIndex + 1);
              pendingRef.current = remainder;

              setStreamingHtml(prev => {
                const next = prev + flushChunk;
                streamingHtmlRef.current = next;
                return next;
              });
            }
            return;
          }
          if (evt.type === 'complete') {
            const finalContent =
              evt.fullResponse ??
              streamingHtmlRef.current + pendingRef.current ??
              fullAccumulatedRef.current;

            const assistantMessage: IWidgetMessage = {
              role: 'assistant',
              content: finalContent,
              timestamp: Date.now(),
            };

            addMessage(assistantMessage);
            if (chatbotId && visitorId) {
              WidgetStorage.addMessage(chatbotId, visitorId, assistantMessage);
            }

            setStreamingHtml('');
            streamingHtmlRef.current = '';
            pendingRef.current = '';
            fullAccumulatedRef.current = '';
          }
        }
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      const retry = await handleApiError(error);
      if (retry && accessToken) {
        setTimeout(() => handleSendMessage({ role, content }), 1000);
      }
    } finally {
      setIsStreaming(false);
    }
  };

  return { isStreaming, streamingHtml, handleSendMessage } as const;
};
