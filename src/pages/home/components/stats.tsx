import { stats } from '@/api/stats';
import Counter from '@/components/counter';
import StatCard from '@/components/stat-card';
import type { PLANS } from '@/config';
import useCurrentSubscription from '@/hooks/use-current-subscription';
import { useQuery } from '@tanstack/react-query';
import { MessageSquareText, MessagesSquare, ThumbsUp } from 'lucide-react';
import useRefreshOnLabel from '@/hooks/use-refresh-on-label';

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
  const { data: chats } = useQuery({
    queryKey: stats.chats.key(),
    queryFn: () => stats.chats.query(undefined),
    staleTime: 60_000,
  });

  return (
    <StatCard icon={<MessagesSquare className="size-4 text-stone-500" />} title="Chats">
      <Counter value={chats?.count} />
    </StatCard>
  );
};

const MessagesCard = ({ limits }: { limits: (typeof PLANS)[keyof typeof PLANS]['limits'] }) => {
  const { data: messages } = useQuery({
    queryKey: stats.messages.key(),
    queryFn: () => stats.messages.query(undefined),
    staleTime: 60_000,
  });
  const { label: refreshOnLabel } = useRefreshOnLabel();

  return (
    <StatCard icon={<MessageSquareText className="size-4 text-stone-500" />} title="Messages">
      <div className="flex items-center justify-between">
        <span>
          <Counter value={messages?.count ?? 0} />/{(limits.maxMessages ?? 0).toLocaleString()}
        </span>
        <span className="text-xs font-normal text-stone-500">{refreshOnLabel}</span>
      </div>
    </StatCard>
  );
};
