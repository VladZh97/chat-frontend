import { useEffect } from 'preact/hooks';
import { v4 as uuidv4 } from 'uuid';
import { useWidgetStoreShallow } from '../store/widget.store';
import { WidgetStorage } from '@/utils/widget-storage';

export const useRestoreSession = (
  chatbotId: string | undefined,
  isAuthenticated: boolean,
  authVisitorId: string | undefined
) => {
  const { isSessionRestored, restoreSession, setSessionRestored } = useWidgetStoreShallow(s => ({
    isSessionRestored: s.isSessionRestored,
    restoreSession: s.restoreSession,
    setSessionRestored: s.setSessionRestored,
  }));

  useEffect(() => {
    if (isAuthenticated && authVisitorId && chatbotId && !isSessionRestored) {
      // Check if a new chat was explicitly started
      const hasNewChatFlag = WidgetStorage.hasNewChatFlag(chatbotId, authVisitorId);

      if (hasNewChatFlag) {
        // Clear the flag and don't restore any session
        WidgetStorage.clearNewChatFlag(chatbotId, authVisitorId);
        setSessionRestored(true);
      } else {
        // Normal session restoration
        const storedSession = WidgetStorage.getConversation(chatbotId, authVisitorId);
        if (storedSession) {
          restoreSession(storedSession);
        } else {
          setSessionRestored(true);
        }
      }
    }
  }, [
    isAuthenticated,
    authVisitorId,
    chatbotId,
    isSessionRestored,
    restoreSession,
    setSessionRestored,
  ]);
};

export const useEnsureConversationId = (
  isAuthenticated: boolean,
  authVisitorId: string | undefined
) => {
  const { isSessionRestored, conversationId, setConversationId } = useWidgetStoreShallow(s => ({
    isSessionRestored: s.isSessionRestored,
    conversationId: s.conversationId,
    setConversationId: s.setConversationId,
  }));

  useEffect(() => {
    if (isAuthenticated && authVisitorId && isSessionRestored && !conversationId) {
      const newConversationId = uuidv4();
      setConversationId(newConversationId);
    }
  }, [isAuthenticated, authVisitorId, isSessionRestored, conversationId, setConversationId]);
};
