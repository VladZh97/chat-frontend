import { useState } from 'preact/hooks';
import { useConfigStoreShallow } from '../store';
import { WidgetStorage } from '@/utils/widget-storage';
import widgetApiService from '@/api/widget';

interface UseLeadCollectionParams {
  chatbotId: string;
  visitorId: string;
  isAuthenticated: boolean;
  accessToken: string | null;
  conversationId: string | null;
}

export const useLeadCollection = ({
  chatbotId,
  visitorId,
  isAuthenticated,
  accessToken,
  conversationId,
}: UseLeadCollectionParams) => {
  const [isLeadPopoverOpen, setIsLeadPopoverOpen] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const { collectLeads } = useConfigStoreShallow(s => ({
    collectLeads: s.collectLeads,
  }));

  const isLeadCollected = WidgetStorage.isLeadCollected(chatbotId, visitorId);

  const shouldShowLeadCollection = (messageContent: string): boolean => {
    if (!collectLeads) return false;
    if (isLeadCollected) return false;
    if (!isAuthenticated) return false;
    if (!messageContent.trim()) return false;

    // Only show on first user message (when no messages exist yet)
    return true;
  };

  const handleSubmitLead = async (email: string) => {
    if (!accessToken || !conversationId) return;

    setIsSubmittingLead(true);
    try {
      await widgetApiService.submitEmail(
        {
          chatbotId,
          visitorId,
          email,
          conversationId,
        },
        accessToken
      );

      // Mark lead as collected
      WidgetStorage.setLeadCollected(chatbotId, visitorId);

      // Close the popover
      setTimeout(() => {
        setIsLeadPopoverOpen(false);
      }, 500);

      return true;
    } catch (error) {
      console.error('Failed to submit lead:', error);
      return false;
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const checkForLeadCollection = (messageContent: string): boolean => {
    if (shouldShowLeadCollection(messageContent)) {
      setPendingMessage(messageContent);
      setIsLeadPopoverOpen(true);
      return true; // Intercept the message
    }
    return false; // Allow message to proceed
  };

  const closeLeadPopover = () => {
    setIsLeadPopoverOpen(false);
    setPendingMessage(null);
  };

  return {
    isLeadPopoverOpen,
    isSubmittingLead,
    pendingMessage,
    handleSubmitLead,
    checkForLeadCollection,
    closeLeadPopover,
    isLeadCollected,
  };
};
