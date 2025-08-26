import { useRef, useState } from 'preact/hooks';
import { v4 as uuidv4 } from 'uuid';
import widgetApiService from '@/api/widget';
import { findSafeFlushIndex } from '@/pages/usage/utils';
import { WidgetStorage, type IWidgetMessage } from '@/utils/widget-storage';

const getErrorMessage = (error: unknown): { message: string; canRetry: boolean; code?: string } => {
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
      return {
        message: "You're sending messages too quickly. Please wait a moment and try again.",
        canRetry: true,
        code: 'RATE_LIMIT',
      };
    }

    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return {
        message: 'Check your connection and try again.',
        canRetry: true,
        code: 'NETWORK_ERROR',
      };
    }

    if (errorMessage.includes('server') || errorMessage.includes('500')) {
      return {
        message: 'Something went wrong on our end. Please try again.',
        canRetry: true,
        code: 'SERVER_ERROR',
      };
    }
  }

  return {
    message: 'Something went wrong. Please try again.',
    canRetry: true,
    code: 'UNKNOWN_ERROR',
  };
};

interface UseSendMessageParams {
  messages: IWidgetMessage[];
  conversationId: string | null;
  setConversationId: (id: string) => void;
  addMessage: (message: IWidgetMessage) => void;
  setMessages: (messages: IWidgetMessage[]) => void;
  isAuthenticated: boolean;
  accessToken?: string | null;
  chatbotId?: string;
  visitorId?: string;
  handleApiError: (error: unknown) => Promise<boolean>;
  clearInput: () => void;
  setLastFailedMessage: (message?: string) => void;
  setRetrying: (retrying: boolean) => void;
}

export const useSendMessage = ({
  messages,
  conversationId,
  setConversationId,
  addMessage,
  setMessages,
  isAuthenticated,
  accessToken,
  chatbotId,
  visitorId,
  handleApiError,
  clearInput,
  setLastFailedMessage,
  setRetrying,
}: UseSendMessageParams) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingHtml, setStreamingHtml] = useState('');
  const streamingHtmlRef = useRef('');
  const pendingRef = useRef('');
  const fullAccumulatedRef = useRef('');
  const messageIdRef = useRef<string | undefined>();

  // Extracted function to process message streaming
  const processMessageStream = async (messageContent: string, currentConversationId: string) => {
    setStreamingHtml('');
    streamingHtmlRef.current = '';
    pendingRef.current = '';
    fullAccumulatedRef.current = '';
    messageIdRef.current = undefined;
    setIsStreaming(true);

    try {
      const messageHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      await widgetApiService.sendMessageStream(
        {
          chatbotId: chatbotId!,
          visitorId: visitorId!,
          conversationId: currentConversationId,
          message: messageContent,
          messageHistory,
        },
        accessToken!,
        evt => {
          if (evt.type === 'connected') return;
          if (evt.type === 'chunk') {
            const incoming = evt.content ?? '';
            fullAccumulatedRef.current += incoming;
            pendingRef.current += incoming;

            // Capture messageId from the first chunk that has it
            if (evt.messageId && !messageIdRef.current) {
              messageIdRef.current = evt.messageId;
            }

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

            // Capture messageId from complete event (MongoDB _id) if available
            if (evt.messageId) {
              messageIdRef.current = evt.messageId;
            }

            const assistantMessage: IWidgetMessage = {
              role: 'assistant',
              content: finalContent,
              timestamp: Date.now(),
              messageId: messageIdRef.current, // This will be the MongoDB _id from the complete event
            };

            addMessage(assistantMessage);
            if (chatbotId && visitorId) {
              WidgetStorage.addMessage(
                chatbotId,
                visitorId,
                assistantMessage,
                currentConversationId
              );
            }
            setStreamingHtml('');
            streamingHtmlRef.current = '';
            pendingRef.current = '';
            fullAccumulatedRef.current = '';
            messageIdRef.current = undefined;
          }
        }
      );
    } catch (error) {
      console.error('Failed to send message:', error);

      const errorInfo = getErrorMessage(error);

      // Add error message to conversation
      const errorMessage: IWidgetMessage = {
        role: 'assistant',
        content: '', // Empty content for error messages
        timestamp: Date.now(),
        error: {
          message: errorInfo.message,
          code: errorInfo.code,
          canRetry: errorInfo.canRetry,
          originalMessage: messageContent,
        },
      };

      addMessage(errorMessage);
      if (chatbotId && visitorId) {
        WidgetStorage.addMessage(chatbotId, visitorId, errorMessage, currentConversationId);
      }

      // Store the failed message for retry
      if (errorInfo.canRetry) {
        setLastFailedMessage(messageContent);
      }

      const retry = await handleApiError(error);
      if (retry && accessToken && errorInfo.canRetry) {
        setTimeout(() => processMessageStream(messageContent, currentConversationId), 1000);
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const handleRetryMessage = async (originalMessage?: string) => {
    if (!originalMessage || isStreaming || !isAuthenticated || !accessToken) return;

    let currentConversationId = conversationId ?? undefined;
    if (!currentConversationId) {
      currentConversationId = uuidv4();
      setConversationId(currentConversationId);
    }

    // Remove all error messages from the current conversation
    const messagesWithoutErrors = messages.filter(msg => !msg.error);
    setMessages(messagesWithoutErrors);

    // Also remove from storage
    if (chatbotId && visitorId) {
      // Update storage with messages without errors
      const session = WidgetStorage.getConversationById(
        chatbotId,
        visitorId,
        currentConversationId
      );
      if (session) {
        const updatedSession = {
          ...session,
          messages: messagesWithoutErrors,
        };
        // Update the storage with the cleaned messages
        WidgetStorage.saveConversation(chatbotId, updatedSession);
      }
    }

    // Clear error state
    setLastFailedMessage(undefined);
    setRetrying(false);

    // Process the message normally (this will trigger the loading state)
    await processMessageStream(originalMessage, currentConversationId);
  };

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
      WidgetStorage.addMessage(chatbotId, visitorId, userMessage, currentConversationId);
    }

    clearInput();

    // Process the message through streaming
    await processMessageStream(content, currentConversationId);
  };

  return { isStreaming, streamingHtml, handleSendMessage, handleRetryMessage } as const;
};
