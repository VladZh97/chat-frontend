import { stats } from '@/api/stats';
import { useRefreshOnLabel } from '@/hooks';
import useCurrentSubscription from '@/hooks/use-current-subscription';
import { useQuery } from '@tanstack/react-query';
import StatCard from './stat-card';
import { MessageSquareText } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MessagesStatCard = ({ id }: { id?: string | undefined }) => {
  const { plan } = useCurrentSubscription();
  const { label: refreshOnLabel } = useRefreshOnLabel();
  const { data, isLoading } = useQuery({
    queryKey: stats.messages.key(id),
    queryFn: () => stats.messages.query(id),
  });

  return (
    <StatCard icon={<MessageSquareText className="size-4 text-stone-500" />} title="Messages">
      <div className="flex items-center justify-between">
        <span
          className={cn('opacity-100 transition-opacity duration-300', isLoading && 'opacity-0')}
        >
          {(data?.count ?? 0).toLocaleString()}/{plan?.limits?.maxMessages?.toLocaleString()}
        </span>
        <span className="text-xs font-normal text-stone-500">{refreshOnLabel}</span>
      </div>
    </StatCard>
  );
};
