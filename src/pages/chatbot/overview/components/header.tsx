import { Button } from '@/components/ui/button';
import { CodeXml } from 'lucide-react';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import { useGetChatbot } from '../../hooks';

const Header = () => {
  const { name } = useChatbotStoreShallow(s => ({
    name: s.name,
  }));
  const { isLoading } = useGetChatbot();
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 px-8 py-6">
      {isLoading ? (
        <span className="animate-pulse-fast h-3 w-1/3 rounded-full bg-neutral-200"></span>
      ) : (
        <span className="flex items-center gap-4 text-2xl font-medium text-neutral-900">
          {name} chatbot overview
        </span>
      )}
      <div className="flex items-center gap-2">
        <Button variant="outline">
          <CodeXml />
          Copy embed code
        </Button>
      </div>
    </div>
  );
};

export default Header;
