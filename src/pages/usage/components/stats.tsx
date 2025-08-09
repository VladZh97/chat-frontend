import chatbot from '@/api/chatbot';
import { stats } from '@/api/stats';
import Counter from '@/components/counter';
import StatCard from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import type { PLANS } from '@/config';
import { useRefreshOnLabel } from '@/hooks';
import useCurrentSubscription from '@/hooks/use-current-subscription';
import { useQuery } from '@tanstack/react-query';
import { Bot, CreditCard, MessagesSquare } from 'lucide-react';
import { useCallback } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';

type Plan = (typeof PLANS)[keyof typeof PLANS];

const Stats = () => {
  const { plan } = useCurrentSubscription();
  return (
    <div className="mb-4 grid grid-cols-3 gap-4">
      <PlanCard plan={plan} />
      <Chatbots limits={plan.limits} />
      <MessagesCard limits={plan.limits} />
    </div>
  );
};

export default Stats;

const PlanCard = ({ plan }: { plan: Plan }) => {
  const navigate = useNavigate();
  const handleChangePlan = useCallback(() => {
    navigate('/subscription');
  }, [navigate]);

  return (
    <StatCard icon={<CreditCard className="size-4 text-stone-500" />} title="Your plan">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-stone-900">{plan.title}</span>
        <Button onClick={handleChangePlan} variant="outline">
          Change plan
        </Button>
      </div>
    </StatCard>
  );
};

const Chatbots = ({ limits }: { limits: (typeof PLANS)[keyof typeof PLANS]['limits'] }) => {
  const { data: chatbots } = useQuery({
    queryKey: chatbot.get.key,
    queryFn: () => chatbot.get.query(),
  });

  return (
    <StatCard icon={<Bot className="size-4 text-stone-500" />} title="Chatbots">
      <Counter value={chatbots?.length ?? 0} />/{limits.maxChatbots}
    </StatCard>
  );
};

const MessagesCard = ({ limits }: { limits: (typeof PLANS)[keyof typeof PLANS]['limits'] }) => {
  const { label: refreshOnLabel } = useRefreshOnLabel();

  const { data: messages } = useQuery({
    queryKey: stats.messages.key(),
    queryFn: () => stats.messages.query(undefined),
    staleTime: 60_000,
  });

  return (
    <StatCard icon={<MessagesSquare className="size-4 text-stone-500" />} title="Messages">
      <div className="flex w-full items-center justify-between">
        <span>
          <Counter value={messages?.count ?? 0} />/{(limits.maxMessages ?? 0).toLocaleString()}
        </span>
        <span className="text-sm font-normal text-stone-500">{refreshOnLabel}</span>
      </div>
    </StatCard>
  );
};
