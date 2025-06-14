import { Badge } from '@/components/ui/badge';
import { Ellipsis } from 'lucide-react';

const SingleChat = ({ live }: { live?: boolean }) => {
  return (
    <div className="flex cursor-pointer items-center border-r-2 border-r-transparent transition-colors hover:border-r-neutral-950 hover:bg-neutral-50">
      <div className="flex w-[96px] shrink-0 items-center px-3 py-4">
        {live ? (
          <Badge variant="secondary" className="bg-green-200 text-green-800">
            Live
          </Badge>
        ) : (
          <Badge variant="secondary">Finished</Badge>
        )}
      </div>
      <span className="grow truncate px-3 py-4 text-sm text-neutral-900">
        I have a question about your services I have a question about your services
      </span>
      <span className="flex w-[88px] shrink-0 items-center justify-end px-3 py-4 text-sm text-neutral-500">
        12
      </span>
      <div className="flex w-[52px] shrink-0 items-center justify-center px-3 py-4">
        <div className="flex size-6 cursor-pointer items-center justify-center rounded transition-colors hover:bg-neutral-200">
          <Ellipsis className="size-4 text-neutral-900" />
        </div>
      </div>
    </div>
  );
};

export default SingleChat;
