import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AddNewKnowledgeSource from '@/dialogs/add-new-knowledge-source';
import { useDialog } from '@/hooks';
import { Plus } from 'lucide-react';

const KnowledgeTableHeader = () => {
  const { showDialog } = useDialog();
  const handleAddNewKnowledgeSource = () => {
    showDialog(AddNewKnowledgeSource.id, AddNewKnowledgeSource);
  };
  return (
    <div className="mb-4 flex items-center justify-between">
      <Input placeholder="Search sources..." className="h-8 max-w-[300px]" />
      <Button variant="outline" onClick={handleAddNewKnowledgeSource}>
        <Plus />
        Add new source
      </Button>
    </div>
  );
};

export default KnowledgeTableHeader;
