import { useRef, useState } from 'preact/hooks';
import { v4 as uuidv4 } from 'uuid';
import widgetApiService from '@/api/widget';
import { findSafeFlushIndex } from '@/pages/usage/utils';
import { WidgetStorage, type IWidgetMessage } from '@/utils/widget-storage';
import { z } from 'zod';

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
  collectLeads: boolean;
  emailCollected: boolean;
  awaitingEmail: boolean;
  setEmailCollected: (collected: boolean) => void;
  setAwaitingEmail: (awaiting: boolean) => void;
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
  collectLeads,
  emailCollected,
  awaitingEmail,
  setEmailCollected,
  setAwaitingEmail,
}: UseSendMessageParams) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingHtml, setStreamingHtml] = useState('');
  const streamingHtmlRef = useRef('');
  const pendingRef = useRef('');
  const fullAccumulatedRef = useRef('');
  const originalMessageRef = useRef<string | null>(null);
  
  const emailSchema = z.string().email();

  // Extracted function to process message streaming
  const processMessageStream = async (messageContent: string, currentConversationId: string) => {
    setStreamingHtml('');
    streamingHtmlRef.current = '';
    pendingRef.current = '';
    fullAccumulatedRef.current = '';
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
          }
        }
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      const retry = await handleApiError(error);
      if (retry && accessToken) {
        setTimeout(() => processMessageStream(messageContent, currentConversationId), 1000);
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSendMessage = async ({
    role,
    content,
  }: {
    role: 'user' | 'assistant';
    content: string;
  }) => {
    if (isStreaming || !content.trim() || !isAuthenticated || !accessToken) return;

    // Handle email collection flow
    if (collectLeads && awaitingEmail) {
      const emailValidation = emailSchema.safeParse(content);
      if (!emailValidation.success) {
        return; // Email validation will be handled in the input component
      }

      // Clear input immediately after validation passes
      clearInput();

      // Set up conversation ID
      const currentConversationId = conversationId ?? uuidv4();
      if (!conversationId) {
        setConversationId(currentConversationId);
      }

      // Add user email message
      const userMessage: IWidgetMessage = {
        role,
        content,
        timestamp: Date.now(),
      };
      addMessage(userMessage);
      if (chatbotId && visitorId) {
        WidgetStorage.addMessage(chatbotId, visitorId, userMessage, currentConversationId);
      }

      // Send email to backend
      try {
        if (chatbotId && visitorId) {
          await widgetApiService.submitEmail({
            chatbotId,
            visitorId,
            email: content,
            conversationId: currentConversationId,
          }, accessToken);
        }

        // Mark email as collected and stop awaiting
        setEmailCollected(true);
        setAwaitingEmail(false);

        // After successful email submission, process the original message if it exists
        if (originalMessageRef.current) {
          const originalMessage = originalMessageRef.current;
          originalMessageRef.current = null; // Clear the stored message
          
          // Process the original message through normal streaming flow
          await processMessageStream(originalMessage, currentConversationId);
        }
      } catch (error) {
        console.error('Failed to submit email:', error);
        // Still mark as collected even if submission fails to prevent repeated attempts
        setEmailCollected(true);
        setAwaitingEmail(false);
      }
      
      return;
    }

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

    // Check if we need to trigger email collection after first user message
    const isFirstUserMessage = collectLeads && !emailCollected && messages.filter(m => m.role === 'user').length === 0;
    
    if (isFirstUserMessage) {
      // Store the original message for later processing
      originalMessageRef.current = content;
      
      // Clear input immediately after first message
      clearInput();
      
      // Add the email request message immediately after first user message
      const emailRequestMessage: IWidgetMessage = {
        role: 'assistant',
        content: 'Please, provide your email',
        timestamp: Date.now(),
      };
      
      addMessage(emailRequestMessage);
      if (chatbotId && visitorId) {
        WidgetStorage.addMessage(
          chatbotId,
          visitorId,
          emailRequestMessage,
          currentConversationId
        );
      }
      
      setAwaitingEmail(true);
      return; // Don't proceed with normal message flow when email collection is triggered
    }

    clearInput();
    
    // Process the message through streaming
    await processMessageStream(content, currentConversationId);
  };

  return { isStreaming, streamingHtml, handleSendMessage } as const;
};
