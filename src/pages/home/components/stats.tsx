import { stats } from '@/api/stats';
import StatCard from '@/components/stat-card';
import type { PLANS } from '@/config';
import useCurrentSubscription from '@/hooks/use-current-subscription';
import { useQuery } from '@tanstack/react-query';
import { MessageSquareText, MessagesSquare, ThumbsUp } from 'lucide-react';
import useRefreshOnLabel from '@/hooks/use-refresh-on-label';
import { cn } from '@/lib/utils';

const Stats = () => {
  const { plan } = useCurrentSubscription();

  return (
    <div className="mb-4 grid grid-cols-3 gap-4">
      <ChatsCard />
      <AnswersQualityCard />
      <MessagesCard limits={plan?.limits ?? {}} />
    </div>
  );
};

export default Stats;

const ChatsCard = () => {
  const { data, isLoading } = useQuery({
    queryKey: stats.chats.key(),
    queryFn: () => stats.chats.query(),
  });

  return (
    <StatCard icon={<MessagesSquare className="size-4 text-stone-500" />} title="Chats">
      <span className={cn('opacity-100 transition-opacity duration-300', isLoading && 'opacity-0')}>
        {(data?.count ?? 0).toLocaleString()}
      </span>
    </StatCard>
  );
};

const AnswersQualityCard = () => {
  const { data, isLoading } = useQuery({
    queryKey: stats.answersQuality.key(),
    queryFn: () => stats.answersQuality.query(),
  });

  return (
    <StatCard icon={<ThumbsUp className="size-4 text-stone-500" />} title="Answers quality">
      {isLoading || !data?.score ? '-/-' : `${data?.score}/5`}
    </StatCard>
  );
};

const MessagesCard = ({ limits }: { limits: (typeof PLANS)[keyof typeof PLANS]['limits'] }) => {
  const { label: refreshOnLabel } = useRefreshOnLabel();
  const { data, isLoading } = useQuery({
    queryKey: stats.messages.key(),
    queryFn: () => stats.messages.query(),
  });

  return (
    <StatCard icon={<MessageSquareText className="size-4 text-stone-500" />} title="Messages">
      <div className="flex items-center justify-between">
        <span
          className={cn('opacity-100 transition-opacity duration-300', isLoading && 'opacity-0')}
        >
          {(data?.count ?? 0).toLocaleString()}/{limits.maxMessages?.toLocaleString()}
        </span>
        <span className="text-xs font-normal text-stone-500">{refreshOnLabel}</span>
      </div>
    </StatCard>
  );
};
