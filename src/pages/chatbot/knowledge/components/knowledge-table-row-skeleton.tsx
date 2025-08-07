import { Skeleton } from '@/components/ui/skeleton';

const KnowledgeTableRowSkeleton = () => {
  return (
    <div className="flex h-12 items-center border-b border-stone-200 bg-white last:border-b-0">
      <div className="flex size-10 items-center justify-center">
        <Skeleton className="size-4 rounded" />
      </div>
      <div className="flex h-10 w-22 items-center gap-2 px-2 text-xs text-stone-500">
        <span className="flex h-6 items-center gap-1 rounded-md border border-stone-200 px-2 py-0.5 text-xs font-medium text-stone-900">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-2 w-6" />
        </span>
      </div>
      <div className="flex h-10 items-center text-sm text-stone-900">
        <Skeleton className="h-3 w-32 rounded-md" />
      </div>
      <div className="ml-auto pr-2">
        <div className="flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors duration-200">
          <Skeleton className="size-4 rounded" />
        </div>
      </div>
    </div>
  );
};

export default KnowledgeTableRowSkeleton;
