import { Button } from '@/components/ui/button';
import AddNewKnowledgeSource from '@/dialogs/add-new-knowledge-source';
import { useDialog } from '@/hooks';
import { BrainCircuit, Plus } from 'lucide-react';

const EmptyState = () => {
  const { showDialog } = useDialog();
  const handleAddNewKnowledgeSource = () => {
    showDialog(AddNewKnowledgeSource.id, AddNewKnowledgeSource);
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white py-10 shadow">
      <div className="flex flex-col items-center justify-center p-8">
        <div className="mb-8 flex size-12 items-center justify-center rounded-full bg-stone-200">
          <BrainCircuit className="size-6 text-stone-500" />
        </div>
        <p className="mb-2 text-center text-xl font-medium text-stone-700">
          Start by adding content your bot can understand
        </p>
        <p className="mb-8 text-center text-sm text-stone-400">
          Teach your bot using URLs, documents, or written notes. <br /> You can always re-train it
          later.
        </p>
        <Button variant="outline" onClick={handleAddNewKnowledgeSource}>
          <Plus />
          Add content
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
