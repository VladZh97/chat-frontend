import chatbot from '@/api/chatbot';
import { stats } from '@/api/stats';
import Counter from '@/components/counter';
import StatCard from '@/components/stat-card';
import type { PLAN_LIMITS } from '@/config';
import useCurrentSubscription from '@/hooks/use-current-subscription';
import { useQuery } from '@tanstack/react-query';
import { MessageSquareText, MessagesSquare, ThumbsUp } from 'lucide-react';

type Limits = (typeof PLAN_LIMITS)[keyof typeof PLAN_LIMITS];

const Stats = () => {
  const { limits } = useCurrentSubscription();

  return (
    <div className="mb-4 grid grid-cols-3 gap-4">
      <ChatsCard />
      <AnswersQualityCard />
      <MessagesCard limits={limits} />
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

const MessagesCard = ({ limits }: { limits: Limits }) => {
  const { data: messages } = useQuery({
    queryKey: stats.messages.key(),
    queryFn: () => stats.messages.query(undefined),
    staleTime: 60_000,
  });
  return (
    <StatCard icon={<MessageSquareText className="size-4 text-stone-500" />} title="Messages">
      <div className="flex items-center justify-between">
        <span>
          <Counter value={messages?.count ?? 0} />/{limits.maxMessages}
        </span>
        <span className="text-xs font-normal text-stone-500">Refresh on July 31, 2025</span>
      </div>
    </StatCard>
  );
};
