import { useWidget, useGetConfig } from '../hooks';
import { Footer } from './widget-footer';
import { Header } from './widget-header';
import { WidgetMain } from './widget-main';
import { ConversationList } from './conversation-list';
import { useWidgetStoreShallow } from '../store/widget.store';
import { useEffect } from 'preact/hooks';
import { HeywayEvent } from '../constants';
import { WidgetAuthErrorMessage } from './widget-auth-error-message';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { LeadCollectionDrawer } from './lead-collection-drawer';
import { useLeadCollection } from '../hooks/use-lead-collection';

const Widget = () => {
  const [parent] = useAutoAnimate();
  useGetConfig();
  const {
    setInputValue,
    handleSendMessage,
    startNewChat,
    isStreaming,
    streamingHtml,
    messages,
    inputValue,
    isAuthenticated,
    visitorId,
    chatbotId,
    accessToken,
    conversationId,
  } = useWidget();

  const { view, isInitialAuthLoading } = useWidgetStoreShallow(s => ({
    view: s.view,
    isInitialAuthLoading: s.isInitialAuthLoading,
  }));

  const {
    isLeadPopoverOpen,
    isSubmittingLead,
    pendingMessage,
    handleSubmitLead,
    checkForLeadCollection,
    closeLeadPopover,
  } = useLeadCollection({
    chatbotId: chatbotId!,
    visitorId: visitorId!,
    isAuthenticated,
    accessToken,
    conversationId,
  });

  // Wrapper for handleSendMessage that includes lead collection logic
  const handleSendMessageWithLeadCheck = (message: {
    role: 'user' | 'assistant';
    content: string;
  }) => {
    if (message.role === 'user' && messages.length === 0) {
      // This is the first user message, check if we need to collect lead
      const shouldCollectLead = checkForLeadCollection(message.content);
      if (shouldCollectLead) {
        return; // Don't send the message yet, wait for lead collection
      }
    }

    // Proceed with normal message sending
    handleSendMessage(message);
  };

  // Handle successful lead submission
  const handleLeadSubmitSuccess = async (email: string) => {
    const success = await handleSubmitLead(email);
    if (success && pendingMessage) {
      // Now send the original message that was intercepted
      handleSendMessage({ role: 'user', content: pendingMessage });
    }
  };

  useEffect(() => {
    console.log('isAuthenticated', isAuthenticated);
    if (isAuthenticated) {
      console.log('posting message');
      window.parent.postMessage(
        {
          type: HeywayEvent.Authenticated,
          isAuthenticated,
        },
        '*'
      );
    }
  }, [isAuthenticated]);

  if (isInitialAuthLoading) return null;
  if (!isAuthenticated) return <WidgetAuthErrorMessage />;

  return (
    <div className="relative flex h-screen w-full grow flex-col bg-white pb-2">
      {view === 'history' ? (
        <ConversationList startNewChat={startNewChat} />
      ) : (
        <div ref={parent} className="flex h-full w-full flex-col">
          <Header />
          <WidgetMain
            messages={messages}
            setMessages={handleSendMessageWithLeadCheck}
            isStreaming={isStreaming}
            streamingHtml={streamingHtml}
            chatbotId={chatbotId || undefined}
            accessToken={accessToken || undefined}
          />
          <Footer
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSendMessage={handleSendMessageWithLeadCheck}
          />
        </div>
      )}

      {/* Drawer positioned outside main layout flow */}
      <LeadCollectionDrawer
        isOpen={isLeadPopoverOpen}
        onClose={closeLeadPopover}
        onSubmit={handleLeadSubmitSuccess}
        isSubmitting={isSubmittingLead}
      />
    </div>
  );
};

export default Widget;
