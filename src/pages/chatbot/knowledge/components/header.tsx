import { Button } from '@/components/ui/button';
import { Bot, Check, X } from 'lucide-react';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import TrainingStatusLabel from '@/components/training-status-label';
import { CONFIG } from '@/config';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { knowledge } from '@/api/knowledge';

const Header = () => {
  const { id: chatbotId } = useParams();
  const { name } = useChatbotStoreShallow(s => ({
    name: s.name,
  }));
  const { data: tokensUsage } = useQuery({
    queryKey: ['tokensUsage', chatbotId],
    queryFn: () => knowledge.tokensUsage(chatbotId as string),
  });
  return (
    <div className="flex h-[85px] items-center justify-between border-b border-transparent py-6">
      <div className="ju flex items-center gap-2.5">
        <span className="text-2xl font-medium text-neutral-900">{name} chatbot knowledge</span>
        <TrainingStatusLabel status="not_trained" />
      </div>
      <div className="flex items-center gap-4 px-8">
        <div className="flex flex-col">
          <span className="mb-0.5 text-xs text-neutral-500">Used tokens</span>
          <span className="mb-1.5 text-xs font-semibold text-neutral-700">
            {tokensUsage?.count?.toLocaleString() ?? 0} / {CONFIG.MAX_TOKENS.toLocaleString()}
          </span>
          <span className="block h-1 w-full overflow-hidden rounded-full bg-neutral-200">
            <span
              className="block h-full rounded-full bg-neutral-900"
              style={{ width: `${(tokensUsage?.count ?? 0 / CONFIG.MAX_TOKENS) * 100}%` }}
            ></span>
          </span>
        </div>
        <Button size="sm" disabled>
          <Bot className="size-4" />
          Train now
        </Button>
      </div>
    </div>
  );
};

export default Header;
