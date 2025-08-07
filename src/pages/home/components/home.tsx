import TotalChatsChart from './total-chats-chart';
import Stats from './stats';
import ChatbotsList from './chatbots-list';
import LayoutWrapper from '@/components/animation-wrapper';

const Home = () => {
  return (
    <LayoutWrapper>
      <div className="px-8 py-6 text-2xl font-medium text-stone-950">Dashboard</div>
      <div className="px-8 pb-8">
        <Stats />
        <ChatbotsList />
      </div>
    </LayoutWrapper>
  );
};

export default Home;
