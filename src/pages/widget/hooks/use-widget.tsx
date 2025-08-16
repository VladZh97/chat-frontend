import { useEffect, useRef, useState } from 'preact/hooks';
import { useParams } from 'react-router-dom';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import { useWidgetStoreShallow } from '../store/widget.store';
import { useAnonymousAuth } from '@/hooks/use-anonymous-auth';
import { WidgetStorage, type IWidgetMessage } from '@/utils/widget-storage';
import widgetApiService from '@/api/widget';

export const useWidget = () => {
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingHtml, setStreamingHtml] = useState('');
  const streamingHtmlRef = useRef('');
  const pendingRef = useRef('');
  const fullAccumulatedRef = useRef('');
  const previousPromptValueRef = useRef<string | undefined>(undefined);
  const { id: chatbotId } = useParams();

  const { promptValue } = useChatbotStoreShallow(s => ({
    promptValue: s.promptValue,
  }));

  const {
    messages,
    visitorId,
    conversationId,
    isAuthenticated,
    isAuthLoading,
    isSessionRestored,
    addMessage,
    setMessages,
    setConversationId,
    restoreSession,
    setSessionRestored,
    setAuthState,
    setVisitorId,
    clearSession,
  } = useWidgetStoreShallow(s => ({
    messages: s.messages,
    visitorId: s.visitorId,
    conversationId: s.conversationId,
    isAuthenticated: s.isAuthenticated,
    isAuthLoading: s.isAuthLoading,
    isSessionRestored: s.isSessionRestored,
    addMessage: s.addMessage,
    setMessages: s.setMessages,
    setConversationId: s.setConversationId,
    restoreSession: s.restoreSession,
    setSessionRestored: s.setSessionRestored,
    setAuthState: s.setAuthState,
    setVisitorId: s.setVisitorId,
    clearSession: s.clearSession,
  }));

  const {
    isAuthenticated: authIsAuthenticated,
    isLoading: authIsLoading,
    visitorId: authVisitorId,
    accessToken,
    error: authError,
    handleApiError,
  } = useAnonymousAuth(chatbotId!);

  // Sync auth state with widget store
  useEffect(() => {
    setAuthState({
      isAuthenticated: authIsAuthenticated,
      isAuthLoading: authIsLoading,
      authError,
    });
    if (authVisitorId) {
      setVisitorId(authVisitorId);
    }
  }, [authIsAuthenticated, authIsLoading, authError, authVisitorId, setAuthState, setVisitorId]);

  // Restore session on authentication
  useEffect(() => {
    if (authIsAuthenticated && authVisitorId && chatbotId && !isSessionRestored) {
      const storedSession = WidgetStorage.getConversation(chatbotId, authVisitorId);
      if (storedSession) {
        restoreSession(storedSession);
      } else {
        setSessionRestored(true);
      }
    }
  }, [
    authIsAuthenticated,
    authVisitorId,
    chatbotId,
    isSessionRestored,
    restoreSession,
    setSessionRestored,
  ]);

  // Create conversation if needed
  useEffect(() => {
    if (
      authIsAuthenticated &&
      authVisitorId &&
      !conversationId &&
      accessToken &&
      isSessionRestored
    ) {
      createConversation();
    }
  }, [authIsAuthenticated, authVisitorId, conversationId, accessToken, isSessionRestored]);

  const createConversation = async () => {
    if (!chatbotId || !authVisitorId || !accessToken) return;

    try {
      const result = await widgetApiService.createConversation(
        chatbotId,
        authVisitorId,
        accessToken
      );
      setConversationId(result.conversationId);
    } catch (error) {
      console.error('Failed to create conversation:', error);
      const retry = await handleApiError(error);
      if (retry) {
        // Retry after auth refresh
        setTimeout(createConversation, 1000);
      }
    }
  };

  // Clear messages when prompt actually changes (not on initial load)
  useEffect(() => {
    const previousPromptValue = previousPromptValueRef.current;

    // Only clear if there's an actual change in prompt value
    // Skip initial load when previous is undefined and current becomes defined
    if (
      promptValue !== undefined &&
      previousPromptValue !== undefined &&
      previousPromptValue !== promptValue
    ) {
      setMessages([]);
      if (chatbotId && visitorId) {
        WidgetStorage.clearConversation(chatbotId, visitorId);
      }
    }

    // Update the ref to track current value
    previousPromptValueRef.current = promptValue;
  }, [promptValue, setMessages, chatbotId, visitorId]);

  const handleSendMessage = async ({
    role,
    content,
  }: {
    role: 'user' | 'assistant';
    content: string;
  }) => {
    if (isStreaming || !content.trim() || !isAuthenticated || !conversationId || !accessToken)
      return;

    const userMessage: IWidgetMessage = {
      role,
      content,
      timestamp: Date.now(),
    };

    // Add user message to store and localStorage
    addMessage(userMessage);
    if (chatbotId && visitorId) {
      WidgetStorage.addMessage(chatbotId, visitorId, userMessage);
    }

    setInputValue('');
    setStreamingHtml('');
    streamingHtmlRef.current = '';
    pendingRef.current = '';
    fullAccumulatedRef.current = '';
    setIsStreaming(true);

    try {
      // Convert messages for API
      const messageHistory = messages.concat(userMessage).map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      await widgetApiService.sendMessageStream(
        {
          chatbotId: chatbotId!,
          visitorId: visitorId!,
          conversationId: conversationId!,
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

            // Add assistant message to store and localStorage
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
        // Retry sending the message after auth refresh
        setTimeout(() => handleSendMessage({ role, content }), 1000);
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const startNewChat = () => {
    // Clear the current session from store
    clearSession();

    // Clear conversation from localStorage
    if (chatbotId && visitorId) {
      WidgetStorage.clearConversation(chatbotId, visitorId);
    }

    // Reset session restored flag to trigger new conversation creation
    setSessionRestored(true);
  };

  return {
    messages,
    inputValue,
    setInputValue,
    handleSendMessage,
    isStreaming,
    streamingHtml,
    isAuthenticated,
    isAuthLoading,
    visitorId,
    startNewChat,
  };
};

// Returns the last index in the input that is safe to render (i.e., not splitting inside a tag, comment, or entity).
// If nothing is safe to flush yet, returns -1.
function findSafeFlushIndex(input: string): number {
  let insideTag = false;
  let insideComment = false;
  let insideEntity = false;
  let quote: '"' | "'" | null = null;
  let safeIndex = -1;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (insideComment) {
      // Detect end of comment -->
      if (ch === '>' && input[i - 1] === '-' && input[i - 2] === '-') {
        insideComment = false;
        safeIndex = i; // up to and including '>' is safe
      }
      continue;
    }

    if (insideTag) {
      if (quote) {
        if (ch === quote) quote = null;
      } else {
        if (ch === '"' || ch === "'") {
          quote = ch as '"' | "'";
        } else if (ch === '>') {
          insideTag = false;
          safeIndex = i;
        }
      }
      continue;
    }

    if (insideEntity) {
      if (ch === ';') {
        insideEntity = false;
        safeIndex = i;
      }
      continue;
    }

    // Not inside anything special
    if (ch === '<') {
      if (input.slice(i, i + 4) === '<!--') {
        insideComment = true;
      } else {
        insideTag = true;
      }
      // Do not advance safeIndex here; we don't want to include the '<' yet
      continue;
    }

    if (ch === '&') {
      insideEntity = true;
      continue;
    }

    // Regular text character; safe to render through here
    safeIndex = i;
  }

  return safeIndex;
}
