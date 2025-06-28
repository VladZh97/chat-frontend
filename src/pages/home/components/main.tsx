import Board from '@/components/board';
import Stats from './stats';
import TotalChatsChart from './total-chats-chart';
import ChatbotsList from './chatbots-list';

const Main = () => {
  return (
    <Board>
      <div className="px-8 py-6 text-2xl font-medium text-neutral-900">Dashboard</div>
      <div className="px-8 pb-8">
        <Stats />
        <TotalChatsChart />
        <ChatbotsList />
      </div>
    </Board>
  );
};

export default Main;
