import TotalChatsChart from './total-chats-chart';
import Stats from './stats';
import ChatbotsList from './chatbots-list';

const Home = () => {
  return (
    <>
      <div className="px-8 py-6 text-2xl font-medium text-neutral-900">Dashboard</div>
      <div className="px-8 pb-8">
        <Stats />
        <TotalChatsChart />
        <ChatbotsList />
      </div>
    </>
  );
};

export default Home;
