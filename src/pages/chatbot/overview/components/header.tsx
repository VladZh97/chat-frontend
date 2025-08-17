import { Button } from '@/components/ui/button';
import { CodeXml } from 'lucide-react';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import { useGetChatbot } from '../../hooks';
import TrainingStatusLabel from '@/components/training-status-label';
import { toast } from 'sonner';
import { copyEmbedCode } from '@/utils/copy-embed-code';

const Header = () => {
  const { name, accountId, _id } = useChatbotStoreShallow(s => ({
    name: s.name,
    accountId: s.accountId,
    _id: s._id,
  }));
  const { isLoading } = useGetChatbot();
  return (
    <div className="grid grid-cols-[auto_auto] items-center justify-between border-b border-stone-200 px-8 py-6">
      <div className="grid grid-cols-[auto_auto] items-center gap-2.5">
        {isLoading ? (
          <span className="animate-pulse-fast h-3 w-1/3 rounded-full bg-stone-200"></span>
        ) : (
          <span className="block truncate text-2xl font-medium text-stone-900">
            {name} chatbot overview
          </span>
        )}
        <TrainingStatusLabel />
      </div>

      <Button variant="outline" className="ml-10" onClick={() => copyEmbedCode(accountId, _id)}>
        <CodeXml />
        Copy embed code
      </Button>
    </div>
  );
};

export default Header;
