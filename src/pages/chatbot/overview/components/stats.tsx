import { stats } from '@/api/stats';
import Counter from '@/components/counter';
import StatCard from '@/components/stat-card';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, MessageSquareText, MessagesSquare } from 'lucide-react';
import { useParams } from 'react-router-dom';

const Stats = () => {
  const { id } = useParams();
  return (
    <div className="mb-4 grid grid-cols-3 gap-4">
      <ChatsCard id={id} />
      <MessagesCard id={id} />
      <Card>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-900">
          <CreditCard className="size-4 text-stone-500" />
          Used credits
        </div>
        <span className="text-2xl font-bold text-stone-900">0/1000</span>
      </Card>
    </div>
  );
};

export default Stats;

const Card = ({ children }: { children: React.ReactNode }) => {
  return <div className="rounded-xl border border-stone-200 bg-white p-6 shadow">{children}</div>;
};

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

const MessagesCard = ({ id }: { id: string | undefined }) => {
  const { data: messages } = useQuery({
    queryKey: stats.messages.key(id),
    queryFn: () => stats.messages.query(id),
    staleTime: 60_000,
  });

  return (
    <StatCard icon={<MessageSquareText className="size-4 text-stone-500" />} title="Messages">
      <Counter value={messages?.count ?? 0} />
    </StatCard>
  );
};
