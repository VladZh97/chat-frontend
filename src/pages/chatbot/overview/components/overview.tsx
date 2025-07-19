import { ScrollArea } from '@/components/ui/scroll-area';
import ChatDetails from './chat-details';
import Header from './header';
import Stats from './stats';
import { useGetChatbot } from '../../hooks';
import LayoutWrapper from '@/components/animation-wrapper';

const Overview = () => {
  const { isLoading } = useGetChatbot();
  if (isLoading) return null;
  return (
    <LayoutWrapper className="flex h-full flex-col">
      <Header />
      <ScrollArea className="h-[calc(100vh-101px)]">
        <div className="px-8 py-5">
          <div className="mb-6">
            <Stats />
          </div>
          <ChatDetails />
        </div>
      </ScrollArea>
    </LayoutWrapper>
  );
};

export default Overview;
