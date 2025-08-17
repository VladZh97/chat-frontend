import { useState } from 'preact/hooks';
import { useParams } from 'react-router-dom';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import { useWidgetStoreShallow } from '../store/widget.store';
import { WidgetStorage } from '@/utils/widget-storage';
import { useWidgetAuth } from './use-widget-auth';
import { useEnsureConversationId, useRestoreSession } from './use-session';
import { usePromptChangeClear } from './use-prompt-change-clear';
import { useSendMessage } from './use-send-message';

export const useWidget = () => {
  const [inputValue, setInputValue] = useState('');
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
    addMessage,
    setMessages,
    setConversationId,
    clearSession,
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
  }));

  // Auth sync
  const { authIsAuthenticated, authVisitorId, accessToken, handleApiError } = useWidgetAuth(
    chatbotId!
  );

  // Restore session and ensure conversation id
  useRestoreSession(chatbotId, authIsAuthenticated, authVisitorId ?? undefined);
  useEnsureConversationId(authIsAuthenticated, authVisitorId ?? undefined);

  // Clear messages when prompt changes
  usePromptChangeClear(promptValue, chatbotId, visitorId ?? undefined, setMessages);

  const { isStreaming, streamingHtml, handleSendMessage } = useSendMessage({
    messages,
    conversationId,
    setConversationId,
    addMessage,
    isAuthenticated,
    accessToken,
    chatbotId: chatbotId!,
    visitorId: visitorId!,
    handleApiError,
    clearInput: () => setInputValue(''),
  });

  const startNewChat = () => {
    // Clear the current session from store
    clearSession();

    // Clear conversation from localStorage
    if (chatbotId && visitorId) {
      WidgetStorage.clearConversation(chatbotId, visitorId);
    }

    // Note: The useEffect will automatically generate a new conversation ID
    // when it sees that conversationId is null after clearing the session
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
