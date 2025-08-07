import { Button } from '@/components/ui/button';
import AddNewKnowledgeSource from '@/dialogs/add-new-knowledge-source';
import { useDialog } from '@/hooks';
import { BrainCircuit, Plus } from 'lucide-react';

const KnowledgeTableEmptySearch = ({ setSearch }: { setSearch: (search: string) => void }) => {
  const { showDialog } = useDialog();
  const handleAddNewKnowledgeSource = () => {
    showDialog(AddNewKnowledgeSource.id, AddNewKnowledgeSource);
    setSearch('');
  };
  return (
    <div className="rounded-xl border border-neutral-200 bg-white py-10 shadow">
      <div className="flex flex-col items-center justify-center p-8">
        <div className="mb-8 flex size-12 items-center justify-center rounded-full bg-neutral-200">
          <BrainCircuit className="size-6 text-neutral-500" />
        </div>
        <p className="mb-2 text-center text-xl font-medium text-neutral-700">No results found</p>
        <p className="mb-8 text-center text-sm text-neutral-400">
          Try a different search term or add more content to your knowledge base.
        </p>
        <Button variant="outline" onClick={handleAddNewKnowledgeSource}>
          <Plus />
          Add new source
        </Button>
      </div>
    </div>
  );
};

export default KnowledgeTableEmptySearch;
