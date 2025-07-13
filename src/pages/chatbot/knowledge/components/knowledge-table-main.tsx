import { Checkbox } from '@/components/ui/checkbox';
import { ChevronsUpDown } from 'lucide-react';
import KnowledgeTableRow from './knowledge-table-row';
import KnowledgeTableRowSkeleton from './knowledge-table-row-skeleton';
import type { IKnowledge } from '@/types/knowledge.type';

const KnowledgeTableMain = ({ data, isLoading }: { data?: IKnowledge[]; isLoading: boolean }) => {
  return (
    <div className="overflow-hidden rounded-md border border-neutral-200">
      <div className="flex items-center border-b border-neutral-200 bg-white">
        <div className="flex size-10 items-center justify-center">
          <Checkbox className="cursor-pointer" />
        </div>
        <div className="flex h-10 w-22 items-center gap-2 px-2 text-xs text-neutral-500">
          Type <ChevronsUpDown className="size-4 text-neutral-500" />
        </div>
        <div className="flex h-10 items-center gap-2 px-2 text-xs text-neutral-500">
          Title <ChevronsUpDown className="size-4 text-neutral-500" />
        </div>
      </div>
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => <KnowledgeTableRowSkeleton key={index} />)
        : data?.map(item => <KnowledgeTableRow key={item._id} data={item} />)}
    </div>
  );
};

export default KnowledgeTableMain;
