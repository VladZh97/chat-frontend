import ChatView from '@/components/chat-view';
import ChatsList from './chats-list';

const BoardMain = () => {
  return (
    <div className="flex gap-8 px-8 pt-4 pb-6">
      <ChatsList />
      <ChatView />
    </div>
  );
};

export default BoardMain;
