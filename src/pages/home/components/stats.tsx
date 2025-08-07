import chatbot from '@/api/chatbot';
import { stats } from '@/api/stats';
import Counter from '@/components/counter';
import StatCard from '@/components/stat-card';
import useCurrentSubscription from '@/hooks/use-current-subscription';
import type { SubscriptionPlan } from '@/types/plan.tyle';
import { useQuery } from '@tanstack/react-query';
import { Bot, CreditCard, MessageSquareText, MessagesSquare, ThumbsUp } from 'lucide-react';

const Stats = () => {
  const { plan } = useCurrentSubscription();

  return (
    <div className="mb-4 grid grid-cols-3 gap-4">
      <ChatsCard />
      <AnswersQualityCard />
      <MessagesCard plan={plan} />
    </div>
  );
};

export default Stats;

const AnswersQualityCard = () => {
  const { data: chatbots } = useQuery({
    queryKey: chatbot.get.key,
    queryFn: () => chatbot.get.query(),
  });
  return (
    <StatCard icon={<ThumbsUp className="size-4 text-stone-500" />} title="Answers quality">
      <Counter value={chatbots?.length || 0} />
      /5
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

const MessagesCard = ({ plan }: { plan: SubscriptionPlan }) => {
  const { data: messages } = useQuery({
    queryKey: stats.messages.key(),
    queryFn: () => stats.messages.query(undefined),
    staleTime: 60_000,
  });
  return (
    <StatCard icon={<MessageSquareText className="size-4 text-stone-500" />} title="Messages">
      <div className="flex items-center justify-between">
        <span>
          <Counter value={messages?.count} />/{plan?.maxMessages}
        </span>
        <span className="text-xs font-normal text-stone-500">Refresh on July 31, 2025</span>
      </div>
    </StatCard>
  );
};
