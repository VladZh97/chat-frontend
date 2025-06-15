import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const BoardContent = () => {
  return (
    <div className="grow pr-3">
      <div className="space-y-8">
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
          <Textarea className="h-40 resize-none" />
        </div>
      </div>
    </div>
  );
};

export default BoardContent;
