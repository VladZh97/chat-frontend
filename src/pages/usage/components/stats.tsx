import chatbot from '@/api/chatbot';
import { stats } from '@/api/stats';
import Counter from '@/components/counter';
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
  return <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow">{children}</div>;
};

const PlanCard = () => {
  const navigate = useNavigate();
  const handleChangePlan = useCallback(() => {
    navigate('/subscription');
  }, [navigate]);

  const { plan } = useCurrentSubscription();

  return (
    <Card>
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-900">
        <CreditCard className="size-4 text-neutral-500" />
        Your plan
      </div>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-neutral-900">{plan.name}</span>
        <Button onClick={handleChangePlan} variant="outline">
          Change plan
        </Button>
      </div>
    </Card>
  );
};

const Chatbots = () => {
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
      <Counter value={chatbots?.length ?? 0} className="text-2xl font-bold text-neutral-900" />
    </Card>
  );
};

const MessagesCard = () => {
  const { data: messages } = useQuery({
    queryKey: stats.messages.key,
    queryFn: () => stats.messages.query(undefined),
    staleTime: 60_000,
  });

  return (
    <Card>
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-900">
        <MessagesSquare className="size-4 text-neutral-500" />
        Messages
      </div>
      <Counter value={messages?.count ?? 0} className="text-2xl font-bold text-neutral-900" />
    </Card>
  );
};
