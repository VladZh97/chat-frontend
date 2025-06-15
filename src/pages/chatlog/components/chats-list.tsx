import { ScrollArea } from '@/components/ui/scroll-area';
import ChatsPagination from './chats-pagination';
import SingleChat from './single-chat';

const ChatsList = () => {
  return (
    <div className="w-full max-w-[580px]">
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex h-10 items-center border-b border-neutral-200 text-sm text-neutral-500">
          <span className="w-24 px-3">Status</span>
          <span className="grow px-3">Initial message</span>
          <span className="w-[88px] px-3">Messages</span>
          <span className="block w-[52px]"></span>
        </div>
        <ScrollArea className="h-[calc(100vh-350px)] max-h-[768px] w-[580px]">
          <SingleChat />
        </ScrollArea>
      </div>
      <ChatsPagination />
    </div>
  );
};

export default ChatsList;
