import { stats } from '@/api/stats';
import StatCard from '@/components/stat-card';
import { useQuery } from '@tanstack/react-query';
import { ThumbsUp } from 'lucide-react';
import { MessagesStatCard } from '@/components/messages-stat-card';
import { ChatsStatCard } from '@/components/chats-stat-card';

const Stats = () => {
  return (
    <div className="mb-4 grid grid-cols-3 gap-4">
      <ChatsStatCard />
      <AnswersQualityCard />
      <MessagesStatCard />
    </div>
  );
};

export default Stats;

const AnswersQualityCard = () => {
  const { data, isLoading } = useQuery({
    queryKey: stats.answersQuality.key(),
    queryFn: () => stats.answersQuality.query(),
  });

  return (
    <StatCard icon={<ThumbsUp className="size-4 text-stone-500" />} title="Answers quality">
      {isLoading || !data?.score || data.score === -1 ? '-/-' : `${data?.score}/5`}
    </StatCard>
  );
};
