import chatbot from '@/api/chatbot';
import { stats } from '@/api/stats';
import Counter from '@/components/counter';
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

const Card = ({ children }: { children: React.ReactNode }) => {
  return <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow">{children}</div>;
};

const ChatbotsCard = ({ plan }: { plan: SubscriptionPlan }) => {
  const { data: chatbots } = useQuery({
    queryKey: chatbot.get.key,
    queryFn: () => chatbot.get.query(),
  });
  return (
    <Card>
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-900">
        <Bot className="size-4 text-neutral-500" />
        Chatbots
      </div>
      <span className="text-2xl font-bold text-neutral-900">
        <Counter value={chatbots?.length || 0} />/{plan?.maxChatbots}
      </span>
    </Card>
  );
};

const ChatsCard = () => {
  const { data: chats } = useQuery({
    queryKey: stats.chats.key,
    queryFn: () => stats.chats.query(undefined),
    staleTime: 60_000,
  });

  return (
    <Card>
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-900">
        <MessagesSquare className="size-4 text-neutral-500" />
        Chats
      </div>
      <Counter value={chats?.count} className="text-2xl font-bold text-neutral-900" />
    </Card>
  );
};

const CreditsCard = ({ plan }: { plan: SubscriptionPlan }) => {
  const { data: messages } = useQuery({
    queryKey: stats.messages.key,
    queryFn: () => stats.messages.query(undefined),
    staleTime: 60_000,
  });
  return (
    <Card>
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-900">
        <CreditCard className="size-4 text-neutral-500" />
        Used credits
      </div>
      <span className="text-2xl font-bold text-neutral-900">
        {messages?.count}/{plan?.maxMessages}
      </span>
    </Card>
  );
};
