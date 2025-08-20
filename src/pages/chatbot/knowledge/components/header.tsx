import { Button } from '@/components/ui/button';
import { Bot, Gem } from 'lucide-react';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import TrainingStatusLabel from '@/components/training-status-label';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { knowledge } from '@/api/knowledge';
import queryClient from '@/lib/query';
import type { IKnowledge } from '@/types/knowledge.type';
import chatbot from '@/api/chatbot';
import { useCurrentPlan } from '@/hooks';
import { cn } from '@/lib/utils';

const Header = () => {
  const navigate = useNavigate();
  const { plan } = useCurrentPlan();
  const { id: chatbotId } = useParams();
  const { name } = useChatbotStoreShallow(s => ({
    name: s.name,
  }));
  const { isLoading: isChatbotLoading } = useQuery({
    queryKey: ['chatbot', chatbotId],
    queryFn: () => chatbot.getById(chatbotId as string),
    enabled: !!chatbotId,
  });

  const { data: knowledgeData } = useQuery({
    queryKey: ['knowledge', chatbotId],
    queryFn: () => knowledge.list(chatbotId as string),
  });
  const { data: memoryUsage } = useQuery({
    queryKey: ['memory-usage', chatbotId],
    queryFn: () => knowledge.memoryUsage(chatbotId as string),
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
  const isMemoryLimitReached =
    memoryUsage?.count && memoryUsage.count > 0 && memoryUsage.count / 1024 > plan.limits.maxMemory;

  return (
    <div className="grid grid-cols-[auto_auto] items-center justify-between border-b border-transparent py-6">
      <div className="grid grid-cols-[auto_auto] items-center gap-2.5">
        {isChatbotLoading ? (
          <span className="animate-pulse-fast h-3 w-1/3 rounded-full bg-stone-200"></span>
        ) : (
          <span className="block truncate text-2xl font-medium text-stone-900">
            {name} chatbot overview
          </span>
        )}
        <TrainingStatusLabel />
      </div>

      <div className="ml-10 flex items-center gap-4">
        {plan.title && (
          <div className="flex flex-col">
            <span
              className={cn(
                'mb-0.5 text-xs text-stone-500',
                isMemoryLimitReached && 'text-red-600'
              )}
            >
              Used memory
            </span>
            <span
              className={cn(
                'mb-1.5 text-xs font-semibold text-stone-700',
                isMemoryLimitReached && 'text-red-600'
              )}
            >
              {((memoryUsage?.count ?? 0) / 1024).toFixed(2)} /{' '}
              {`${plan.limits.maxMemory.toLocaleString()} kb`}
            </span>
            <span className="block h-1 w-full overflow-hidden rounded-full bg-stone-200">
              <span
                className={cn(
                  'block h-full rounded-full bg-stone-900',
                  isMemoryLimitReached && 'bg-red-600'
                )}
                style={{
                  width: `${((memoryUsage?.count ?? 0) / 1024 / plan.limits.maxMemory) * 100}%`,
                }}
              ></span>
            </span>
          </div>
        )}
        {isMemoryLimitReached ? (
          <Button variant="outline" onClick={() => navigate('/subscription')}>
            <Gem className="size-4" />
            Upgrade to train
          </Button>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Header;
