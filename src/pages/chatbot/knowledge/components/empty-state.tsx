import { Button } from '@/components/ui/button';
import { BrainCircuit, Plus } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white py-10 shadow">
      <div className="flex flex-col items-center justify-center p-8">
        <div className="mb-8 flex size-12 items-center justify-center rounded-full bg-neutral-200">
          <BrainCircuit className="size-6 text-neutral-500" />
        </div>
        <p className="mb-2 text-center text-xl font-medium text-neutral-700">
          Start by adding content your bot can understand
        </p>
        <p className="mb-8 text-center text-sm text-neutral-400">
          Teach your bot using URLs, documents, or written notes. <br /> You can always re-train it
          later.
        </p>
        <Button variant="outline">
          <Plus />
          Add new source
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
