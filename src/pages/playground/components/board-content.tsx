import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

const BoardContent = () => {
  return (
    <div className="pr-3 grow -mt-1">
      <ScrollArea className="h-[calc(100vh-350px)] max-h-[768px]">
        <div className="space-y-8 p-1 pr-5">
          <div>
            <span className="mb-2 block text-sm text-neutral-950">Name</span>
            <Input className="h-11" />
          </div>
          <div>
            <span className="mb-2 block text-sm text-neutral-950">Initial message</span>
            <Textarea className="h-21 resize-none" />
          </div>
          <div>
            <span className="mb-2 block text-sm text-neutral-950">Instructions</span>
            <Textarea className="min-h-21 resize-none" />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default BoardContent;
