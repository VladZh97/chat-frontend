import { knowledge } from '@/api/knowledge';
import useCurrentSubscription from '@/hooks/use-current-subscription';
import { useQuery } from '@tanstack/react-query';

export const useMemoryLimit = (chatbotId: string) => {
  const { plan } = useCurrentSubscription();
  const { data: memoryUsage } = useQuery({
    queryKey: ['memory-usage', chatbotId],
    queryFn: () => knowledge.memoryUsage(chatbotId as string),
  });

  const isMemoryLimitReached =
    memoryUsage?.count && memoryUsage.count > 0 && memoryUsage.count / 1024 > plan.limits.maxMemory;

  return { isMemoryLimitReached, memoryUsage };
};
