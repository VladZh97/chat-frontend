import { useState } from 'preact/hooks';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useWidgetStoreShallow } from '../store/widget.store';
import { WidgetStorage } from '@/utils/widget-storage';
import { useWidgetAuth } from './use-widget-auth';
import { useEnsureConversationId, useRestoreSession } from './use-session';
import { usePromptChangeClear } from './use-prompt-change-clear';
import { useSendMessage } from './use-send-message';

export const useWidget = () => {
  const [inputValue, setInputValue] = useState('');
  const { id: chatbotId } = useParams();

  const {
    messages,
    visitorId,
    conversationId,
    isAuthenticated,
    isAuthLoading,
    addMessage,
    setMessages,
    setConversationId,
    clearSession,
    setSessionRestored,
    setLastFailedMessage,
    setRetrying,
  } = useWidgetStoreShallow(s => ({
    messages: s.messages,
    visitorId: s.visitorId,
    conversationId: s.conversationId,
    isAuthenticated: s.isAuthenticated,
    isAuthLoading: s.isAuthLoading,
    addMessage: s.addMessage,
    setMessages: s.setMessages,
    setConversationId: s.setConversationId,
    clearSession: s.clearSession,
    setSessionRestored: s.setSessionRestored,
    setLastFailedMessage: s.setLastFailedMessage,
    setRetrying: s.setRetrying,
  }));

  // Auth sync
  const { authIsAuthenticated, authVisitorId, accessToken, handleApiError } = useWidgetAuth(
    chatbotId!
  );

  // Restore session and ensure conversation id
  useRestoreSession(chatbotId, authIsAuthenticated, authVisitorId ?? undefined);
  useEnsureConversationId(authIsAuthenticated, authVisitorId ?? undefined);

  // Clear messages when prompt changes
  usePromptChangeClear(undefined, chatbotId, visitorId ?? undefined, setMessages);

  const { isStreaming, streamingHtml, handleSendMessage, handleRetryMessage } = useSendMessage({
    messages,
    conversationId,
    setConversationId,
    addMessage,
    setMessages,
    isAuthenticated,
    accessToken,
    chatbotId: chatbotId!,
    visitorId: visitorId!,
    handleApiError,
    clearInput: () => setInputValue(''),
    setLastFailedMessage,
    setRetrying,
  });

  const startNewChat = () => {
    // Generate a new conversation ID immediately
    const newConversationId = uuidv4();

    // Clear the current session from store
    clearSession();

    // Immediately set session as restored to prevent useRestoreSession from running
    setSessionRestored(true);

    // Set the new conversation ID
    setConversationId(newConversationId);

    // Use the new startNewChat method that properly clears old data and sets flags
    if (chatbotId && visitorId) {
      WidgetStorage.startNewChat(chatbotId, visitorId, newConversationId);
    }
  };

  return {
    messages,
    inputValue,
    setInputValue,
    handleSendMessage,
    handleRetryMessage,
    isStreaming,
    streamingHtml,
    isAuthenticated,
    isAuthLoading,
    visitorId,
    chatbotId,
    accessToken,
    conversationId,
    startNewChat,
  };
};
