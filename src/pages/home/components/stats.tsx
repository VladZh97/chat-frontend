import chatbot from '@/api/chatbot';
import { stats } from '@/api/stats';
import Counter from '@/components/counter';
import StatCard from '@/components/stat-card';
import useCurrentSubscription from '@/hooks/use-current-subscription';
import type { SubscriptionPlan } from '@/types/plan.tyle';
import { useQuery } from '@tanstack/react-query';
import { Bot, CreditCard, MessagesSquare } from 'lucide-react';

const Stats = () => {
  const { plan } = useCurrentSubscription();

  return (
    <div className="mb-4 grid grid-cols-3 gap-4">
      <ChatsCard />
      <ChatbotsCard plan={plan} />
      <CreditsCard plan={plan} />
    </div>
  );
};

export default Stats;

const ChatbotsCard = ({ plan }: { plan: SubscriptionPlan }) => {
  const { data: chatbots } = useQuery({
    queryKey: chatbot.get.key,
    queryFn: () => chatbot.get.query(),
  });
  return (
    <StatCard icon={<Bot className="size-4 text-neutral-500" />} title="Chatbots">
      <Counter value={chatbots?.length || 0} />/{plan?.maxChatbots}
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
    <StatCard icon={<MessagesSquare className="size-4 text-neutral-500" />} title="Chats">
      <Counter value={chats?.count} />
    </StatCard>
  );
};

const CreditsCard = ({ plan }: { plan: SubscriptionPlan }) => {
  const { data: messages } = useQuery({
    queryKey: stats.messages.key(),
    queryFn: () => stats.messages.query(undefined),
    staleTime: 60_000,
  });
  return (
    <StatCard icon={<CreditCard className="size-4 text-neutral-500" />} title="Used credits">
      <Counter value={messages?.count} />/{plan?.maxMessages}
    </StatCard>
  );
};
