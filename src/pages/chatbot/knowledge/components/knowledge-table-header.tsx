import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AddNewKnowledgeSource from '@/dialogs/add-new-knowledge-source';
import { useDialog } from '@/hooks';
import { Plus } from 'lucide-react';
import { useMemoryLimit } from '../../hooks';
import { useParams } from 'react-router-dom';

const KnowledgeTableHeader = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (search: string) => void;
}) => {
  const { showDialog } = useDialog();
  const { id: chatbotId } = useParams();
  const handleAddNewKnowledgeSource = () => {
    showDialog(AddNewKnowledgeSource.id, AddNewKnowledgeSource);
  };
  const { isMemoryLimitReached } = useMemoryLimit(chatbotId as string);

  return (
    <div className="mb-4 flex items-center justify-between">
      <Input
        placeholder="Search sources..."
        className="h-9 max-w-[300px]"
        value={search}
        onChange={e => setSearch((e.target as HTMLInputElement).value)}
      />
      {!isMemoryLimitReached && (
        <Button variant="outline" onClick={handleAddNewKnowledgeSource}>
          <Plus />
          Add content
        </Button>
      )}
    </div>
  );
};

export default KnowledgeTableHeader;
