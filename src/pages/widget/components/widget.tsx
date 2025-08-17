import { useWidget, useGetConfig } from '../hooks';
import { Footer } from './widget-footer';
import { Header } from './widget-header';
import { WidgetMain } from './widget-main';
import { ConversationList } from './conversation-list';
import { useWidgetStoreShallow } from '../store/widget.store';

const Widget = () => {
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
    isAuthLoading,
  } = useWidget();

  const { view } = useWidgetStoreShallow(s => ({
    view: s.view,
  }));

  // Show loading state while authenticating
  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-full grow flex-col rounded-3xl bg-white pb-2">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            <p className="text-sm text-gray-600">Connecting...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if authentication failed
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full grow flex-col rounded-3xl bg-white pb-2">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm text-red-600">Unable to connect to chat</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'history') {
    return (
      <div className="flex h-screen w-full grow flex-col rounded-3xl bg-white pb-2">
        <ConversationList startNewChat={startNewChat} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full grow flex-col rounded-3xl bg-white pb-2">
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
    </div>
  );
};

export default Widget;
