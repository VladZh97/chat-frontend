import { useChat, useGetConfig } from '../hooks';
import { Footer } from './chat-footer';
import { Header } from './chat-header';
import { ChatMain } from './chat-main';

const Chat = () => {
  useGetConfig();
  const { setInputValue, handleSendMessage, isStreaming, streamingHtml, messages, inputValue } =
    useChat();

  return (
    <div className="flex h-screen w-full grow flex-col rounded-3xl bg-white pb-2">
      <Header messages={messages} />
      <ChatMain
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

export default Chat;
