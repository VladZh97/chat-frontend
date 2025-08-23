import chatbot from '@/api/chatbot';
import { MessagesStatCard } from '@/components/messages-stat-card';
import StatCard from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import type { PLANS } from '@/config';
import useCurrentSubscription from '@/hooks/use-current-subscription';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Bot, CreditCard } from 'lucide-react';
import { useCallback } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';

type Plan = (typeof PLANS)[keyof typeof PLANS];

const Stats = () => {
  const { plan } = useCurrentSubscription();
  return (
    <div className="mb-4 grid grid-cols-3 gap-4">
      <PlanCard plan={plan} />
      <Chatbots limits={plan?.limits ?? {}} />
      <MessagesStatCard />
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
        <span className="text-2xl font-bold text-stone-900">{plan?.title}</span>
        <Button onClick={handleChangePlan} variant="outline">
          Change plan
        </Button>
      </div>
    </StatCard>
  );
};

const Chatbots = ({ limits }: { limits: (typeof PLANS)[keyof typeof PLANS]['limits'] }) => {
  const { data: chatbots, isLoading } = useQuery({
    queryKey: chatbot.get.key,
    queryFn: () => chatbot.get.query(),
  });

  return (
    <StatCard icon={<Bot className="size-4 text-stone-500" />} title="Chatbots">
      <span className={cn('opacity-100 transition-opacity duration-300', isLoading && 'opacity-0')}>
        {chatbots?.length ?? 0}/{limits.maxChatbots}
      </span>
    </StatCard>
  );
};
