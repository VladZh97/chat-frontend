import { Button } from '@/components/ui/button';
import { Bot, Check, X } from 'lucide-react';

const Header = () => {
  return (
    <div className="flex items-center justify-between pb-6">
      <div className="ju flex items-center gap-2.5">
        <span className="text-2xl font-medium text-neutral-900">MediaMarkt chatbot knowledge</span>
        {/* <NotTrainedBadge /> */}
        <TrainedBadge />
      </div>
      <div className="flex items-center gap-4 px-8">
        <div className="flex flex-col">
          <span className="mb-0.5 text-xs text-neutral-500">Used memory</span>
          <span className="mb-1.5 text-xs font-semibold text-neutral-700">0 / 1000 KB</span>
          <span className="block h-1 w-full overflow-hidden rounded-full bg-neutral-200">
            <span className="block h-full w-1/2 rounded-full bg-neutral-900"></span>
          </span>
        </div>
        <Button size="sm" disabled>
          <Bot className="size-4" />
          Train now
        </Button>
      </div>
    </div>
  );
};

export default Header;

const NotTrainedBadge = () => {
  return (
    <span className="flex h-7 items-center justify-center gap-2 rounded-md bg-neutral-200 px-2 py-1.5 text-sm font-semibold text-neutral-500">
      <X className="size-4 text-neutral-500" />
      Not trained
    </span>
  );
};

const TrainedBadge = () => {
  return (
    <span className="flex h-7 items-center justify-center gap-2 rounded-md bg-green-100 px-2 py-1.5 text-sm font-semibold text-green-600">
      <Check className="size-4 text-green-600" />
      Trained
    </span>
  );
};
