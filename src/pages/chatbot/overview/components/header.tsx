import { Button } from '@/components/ui/button';
import { CodeXml } from 'lucide-react';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import { useGetChatbot } from '../../hooks';
import TrainingStatusLabel from '@/components/training-status-label';

const Header = () => {
  const { name } = useChatbotStoreShallow(s => ({
    name: s.name,
  }));
  const { isLoading } = useGetChatbot();
  return (
    <div className="grid grid-cols-[auto_auto] items-center justify-between border-b border-neutral-200 px-8 py-6">
      <div className="grid grid-cols-[auto_auto] items-center gap-2.5">
        {isLoading ? (
          <span className="animate-pulse-fast h-3 w-1/3 rounded-full bg-neutral-200"></span>
        ) : (
          <span className="block truncate text-2xl font-medium text-neutral-900">
            {name} chatbot overview
          </span>
        )}
        <TrainingStatusLabel />
      </div>

      <Button variant="outline" className="ml-10">
        <CodeXml />
        Copy embed code
      </Button>
    </div>
  );
};

export default Header;
