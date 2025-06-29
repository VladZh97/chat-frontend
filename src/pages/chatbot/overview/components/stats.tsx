import { Bot, CreditCard, MessageSquareText, MessagesSquare } from 'lucide-react';

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
          <MessageSquareText className="size-4 text-neutral-500" />
          Messages
        </div>
        <span className="text-2xl font-bold text-neutral-900">2,520</span>
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
