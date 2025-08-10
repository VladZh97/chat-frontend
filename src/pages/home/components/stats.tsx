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

const AnswersQualityCard = () => {
  const { data: answersQuality, isLoading } = useQuery({
    queryKey: stats.answersQuality.key(),
    queryFn: () => stats.answersQuality.query(),
  });
  return (
    <StatCard icon={<ThumbsUp className="size-4 text-stone-500" />} title="Answers quality">
      {isLoading || !answersQuality?.score ? '-/-' : `${answersQuality?.score}/5`}
    </StatCard>
  );
};

const ChatsCard = () => {
  const { data: chats, isLoading } = useQuery({
    queryKey: stats.chats.key(),
    queryFn: () => stats.chats.query(undefined),
    staleTime: 60_000,
  });

  return (
    <StatCard icon={<MessagesSquare className="size-4 text-stone-500" />} title="Chats">
      <span className={cn('opacity-100 transition-opacity duration-300', isLoading && 'opacity-0')}>
        {chats?.count}
      </span>
    </StatCard>
  );
};

const MessagesCard = ({ limits }: { limits: (typeof PLANS)[keyof typeof PLANS]['limits'] }) => {
  const { data: messages, isLoading } = useQuery({
    queryKey: stats.messages.key(),
    queryFn: () => stats.messages.query(undefined),
    staleTime: 60_000,
  });
  const { label: refreshOnLabel } = useRefreshOnLabel();

  return (
    <StatCard icon={<MessageSquareText className="size-4 text-stone-500" />} title="Messages">
      <div className="flex items-center justify-between">
        <span
          className={cn('opacity-100 transition-opacity duration-300', isLoading && 'opacity-0')}
        >
          {messages?.count ?? 0}/{limits.maxMessages ?? 0}
        </span>
        <span className="text-xs font-normal text-stone-500">{refreshOnLabel}</span>
      </div>
    </StatCard>
  );
};
