import { Bot, CreditCard, MessagesSquare } from 'lucide-react';

const Stats = () => {
  return (
    <div className="mb-4 grid grid-cols-3 gap-4">
      <Card>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-900">
          <MessagesSquare className="size-4 text-neutral-500" />
          Chats
        </div>
        <span className="text-2xl font-bold text-neutral-900">152</span>
      </Card>
      <Card>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-900">
          <Bot className="size-4 text-neutral-500" />
          Chatbots
        </div>
        <span className="text-2xl font-bold text-neutral-900">1/1</span>
      </Card>
      <Card>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-900">
          <CreditCard className="size-4 text-neutral-500" />
          Used credits
        </div>
        <span className="text-2xl font-bold text-neutral-900">20/1000</span>
      </Card>
    </div>
  );
};

export default Stats;

const Card = ({ children }: { children: React.ReactNode }) => {
  return <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow">{children}</div>;
};
