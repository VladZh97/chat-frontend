import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AddNewKnowledgeSource from '@/dialogs/add-new-knowledge-source';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

const KnowledgeTableHeader = () => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <Input placeholder="Search sources..." className="h-8 max-w-[300px]" />
      <AddNewKnowledgeSource>
        <span className={cn(buttonVariants({ variant: 'outline' }))}>
          <Plus />
          Add new source
        </span>
      </AddNewKnowledgeSource>
    </div>
  );
};

export default KnowledgeTableHeader;
