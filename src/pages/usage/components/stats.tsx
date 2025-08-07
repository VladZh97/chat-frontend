import chatbot from '@/api/chatbot';
import { stats } from '@/api/stats';
import Counter from '@/components/counter';
import StatCard from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import useCurrentSubscription from '@/hooks/use-current-subscription';
import { useQuery } from '@tanstack/react-query';
import { Bot, CreditCard, MessagesSquare } from 'lucide-react';
import { useCallback } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';

const Stats = () => {
  return (
    <div className="mb-4 grid grid-cols-3 gap-4">
      <PlanCard />
      <Chatbots />
      <MessagesCard />
    </div>
  );
};

export default Stats;

const Card = ({ children }: { children: React.ReactNode }) => {
  return <div className="rounded-xl border border-stone-200 bg-white p-6 shadow">{children}</div>;
};

const PlanCard = () => {
  const navigate = useNavigate();
  const handleChangePlan = useCallback(() => {
    navigate('/subscription');
  }, [navigate]);

  const { plan } = useCurrentSubscription();

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

const Chatbots = () => {
  const { data: chatbots } = useQuery({
    queryKey: chatbot.get.key,
    queryFn: () => chatbot.get.query(),
  });

  return (
    <StatCard icon={<Bot className="size-4 text-stone-500" />} title="Chatbots">
      <Counter value={chatbots?.length ?? 0} />
    </StatCard>
  );
};

const MessagesCard = () => {
  const { data: messages } = useQuery({
    queryKey: stats.messages.key(),
    queryFn: () => stats.messages.query(undefined),
    staleTime: 60_000,
  });

  return (
    <StatCard icon={<MessagesSquare className="size-4 text-stone-500" />} title="Messages">
      <Counter value={messages?.count ?? 0} />
    </StatCard>
  );
};
