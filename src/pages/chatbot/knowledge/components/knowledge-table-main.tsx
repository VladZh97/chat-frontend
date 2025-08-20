import KnowledgeTableRow from './knowledge-table-row';
import KnowledgeTableRowSkeleton from './knowledge-table-row-skeleton';
import type { IKnowledge } from '@/types/knowledge.type';

const KnowledgeTableMain = ({ data, isLoading }: { data?: IKnowledge[]; isLoading: boolean }) => {
  return (
    <div className="overflow-hidden rounded-md border border-stone-200">
      <div className="flex items-center border-b border-stone-200 bg-white">
        <div className="flex h-10 w-22 items-center gap-2 px-2 text-xs text-stone-500">Type</div>
        <div className="flex h-10 items-center gap-2 px-2 text-xs text-stone-500">Title</div>
        <div className="ml-auto flex h-10 w-[180px] items-center gap-2 px-2 text-xs text-stone-500">
          Size
        </div>
      </div>
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => <KnowledgeTableRowSkeleton key={index} />)
        : data?.map(item => <KnowledgeTableRow key={item._id} data={item} />)}
    </div>
  );
};

export default KnowledgeTableMain;
