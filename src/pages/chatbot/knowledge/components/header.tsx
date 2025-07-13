import { Button } from '@/components/ui/button';
import { Bot, LoaderCircle } from 'lucide-react';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import TrainingStatusLabel from '@/components/training-status-label';
import { CONFIG } from '@/config';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { knowledge } from '@/api/knowledge';
import { cn } from '@/lib/utils';
import queryClient from '@/lib/query';
import type { IKnowledge } from '@/types/knowledge.type';
import chatbot from '@/api/chatbot';
import { Skeleton } from '@/components/ui/skeleton';

const Header = () => {
  const { id: chatbotId } = useParams();
  const { name } = useChatbotStoreShallow(s => ({
    name: s.name,
  }));
  const { isLoading: isChatbotLoading } = useQuery({
    queryKey: ['chatbot', chatbotId],
    queryFn: () => chatbot.get(),
    enabled: !!chatbotId,
  });

  const { data: knowledgeData } = useQuery({
    queryKey: ['knowledge', chatbotId],
    queryFn: () => knowledge.list(chatbotId as string),
  });
  const { data: tokensUsage } = useQuery({
    queryKey: ['tokens-usage', chatbotId],
    queryFn: () => knowledge.tokensUsage(chatbotId as string),
  });

  const { mutateAsync: train, isPending: isTraining } = useMutation({
    mutationKey: ['train-chatbot', chatbotId],
    mutationFn: () => knowledge.train(chatbotId as string),
    onSuccess: () => {
      queryClient.setQueryData(['knowledge', chatbotId], (oldData: IKnowledge[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(item => ({ ...item, trained: true }));
      });
    },
  });

  const isTrained = knowledgeData?.every(item => item.trained);

  return (
    <div className="flex h-[85px] items-center justify-between border-b border-transparent py-6">
      <div className="ju flex items-center gap-2.5">
        {isChatbotLoading ? (
          <Skeleton className="h-7 w-80" />
        ) : (
          <span className="text-2xl font-medium text-neutral-900">{name} chatbot knowledge</span>
        )}
        <TrainingStatusLabel />
      </div>
      <div className="flex items-center gap-4 pl-8">
        <div className="flex flex-col">
          <span className="mb-0.5 text-xs text-neutral-500">Used tokens</span>
          <span className="mb-1.5 text-xs font-semibold text-neutral-700">
            {tokensUsage?.count?.toLocaleString() ?? 0} / {CONFIG.MAX_TOKENS.toLocaleString()}
          </span>
          <span className="block h-1 w-full overflow-hidden rounded-full bg-neutral-200">
            <span
              className="block h-full rounded-full bg-neutral-900"
              style={{ width: `${((tokensUsage?.count ?? 0) / CONFIG.MAX_TOKENS) * 100}%` }}
            ></span>
          </span>
        </div>
        <Button
          size="sm"
          onClick={() => {
            if (isTraining || isTrained) return;
            train();
          }}
          disabled={isTrained || isTraining}
        >
          <Bot className="size-4" />
          Train now
        </Button>
      </div>
    </div>
  );
};

export default Header;
