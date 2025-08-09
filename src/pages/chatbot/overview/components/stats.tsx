import { stats } from '@/api/stats';
import Counter from '@/components/counter';
import StatCard from '@/components/stat-card';
import type { PLANS } from '@/config';
import useCurrentSubscription from '@/hooks/use-current-subscription';
import { useQuery } from '@tanstack/react-query';
import { MessageSquareText, MessagesSquare, Users } from 'lucide-react';
import { useParams } from 'react-router-dom';

const Stats = () => {
  const { id } = useParams();
  const { plan } = useCurrentSubscription();
  return (
    <div className="mb-4 grid grid-cols-3 gap-4">
      <ChatsCard id={id} />
      <UniqueUsersCard id={id} />
      <MessagesCard id={id} limits={plan?.limits ?? {}} />
    </div>
  );
};

export default Stats;

const ChatsCard = ({ id }: { id: string | undefined }) => {
  const { data: chats } = useQuery({
    queryKey: stats.chats.key(id),
    queryFn: () => stats.chats.query(id),
    staleTime: 60_000,
  });

  return (
    <StatCard icon={<MessagesSquare className="size-4 text-stone-500" />} title="Chats">
      <Counter value={chats?.count} />
    </StatCard>
  );
};

const UniqueUsersCard = ({ id }: { id: string | undefined }) => {
  const { data: uniqueUsers } = useQuery({
    queryKey: stats.uniqueUsers.key(id),
    queryFn: () => stats.uniqueUsers.query(id),
  });

  return (
    <StatCard icon={<Users className="size-4 text-stone-500" />} title="Unique users">
      <Counter value={uniqueUsers?.count} />
    </StatCard>
  );
};

const MessagesCard = ({
  id,
  limits,
}: {
  id: string | undefined;
  limits: (typeof PLANS)[keyof typeof PLANS]['limits'];
}) => {
  const { data: messages } = useQuery({
    queryKey: stats.messages.key(id),
    queryFn: () => stats.messages.query(id),
    staleTime: 60_000,
  });

  return (
    <StatCard icon={<MessageSquareText className="size-4 text-stone-500" />} title="Messages">
      <Counter value={messages?.count ?? 0} />/{(limits.maxMessages ?? 0).toLocaleString()}
    </StatCard>
  );
};
