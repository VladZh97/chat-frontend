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
  } = useWidget();

  const { view, isInitialAuthLoading } = useWidgetStoreShallow(s => ({
    view: s.view,
    isInitialAuthLoading: s.isInitialAuthLoading,
  }));

  useEffect(() => {
    if (isAuthenticated) {
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
    <div ref={parent} className="flex h-screen w-full grow flex-col bg-white pb-2">
      {view === 'history' ? (
        <ConversationList startNewChat={startNewChat} />
      ) : (
        <>
          <Header />
          <WidgetMain
            messages={messages}
            setMessages={handleSendMessage}
            isStreaming={isStreaming}
            streamingHtml={streamingHtml}
          />
          <Footer
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSendMessage={handleSendMessage}
          />
        </>
      )}
    </div>
  );
};

export default Widget;
