import { useWidget, useGetConfig } from '../hooks';
import { Footer } from './widget-footer';
import { Header } from './widget-header';
import { WidgetMain } from './widget-main';

const Widget = () => {
  useGetConfig();
  const { setInputValue, handleSendMessage, isStreaming, streamingHtml, messages, inputValue } =
    useWidget();

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
