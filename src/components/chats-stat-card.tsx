import { stats } from '@/api/stats';
import { useQuery } from '@tanstack/react-query';
import { MessagesSquare } from 'lucide-react';
import StatCard from './stat-card';
import { cn } from '@/lib/utils';

export const ChatsStatCard = ({ id }: { id?: string | undefined }) => {
  const { data, isLoading } = useQuery({
    queryKey: stats.chats.key(id),
    queryFn: () => stats.chats.query(id),
  });

  return (
    <StatCard icon={<MessagesSquare className="size-4 text-stone-500" />} title="Chats">
      <span className={cn('opacity-100 transition-opacity duration-300', isLoading && 'opacity-0')}>
        {(data?.count ?? 0).toLocaleString()}
      </span>
    </StatCard>
  );
};
