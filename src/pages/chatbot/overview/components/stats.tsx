import { stats } from '@/api/stats';
import { ChatsStatCard } from '@/components/chats-stat-card';
import { MessagesStatCard } from '@/components/messages-stat-card';
import StatCard from '@/components/stat-card';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { useParams } from 'react-router-dom';

const Stats = () => {
  const { id } = useParams();
  return (
    <div className="mb-4 grid grid-cols-3 gap-4">
      <ChatsStatCard id={id} />
      <UniqueUsersCard id={id} />
      <MessagesStatCard id={id} />
    </div>
  );
};

export default Stats;

const UniqueUsersCard = ({ id }: { id: string | undefined }) => {
  const { data: uniqueUsers, isLoading } = useQuery({
    queryKey: stats.uniqueUsers.key(id),
    queryFn: () => stats.uniqueUsers.query(id),
  });

  return (
    <StatCard icon={<Users className="size-4 text-stone-500" />} title="Unique users">
      <span className={cn('opacity-100 transition-opacity duration-300', isLoading && 'opacity-0')}>
        {uniqueUsers?.count}
      </span>
    </StatCard>
  );
};
