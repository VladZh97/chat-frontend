import { Button } from '@/components/ui/button';
import { FileText, Trash2 } from 'lucide-react';

const KnowledgeFile = () => {
  return (
    <div className="group relative h-[46px] overflow-hidden rounded-lg border border-neutral-200 bg-white pt-3 shadow-sm">
      <FileText className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-900" />
      <span className="block pr-24 pl-9 text-sm text-neutral-900">black_friday2025.pdf</span>
      <Button
        variant="destructive"
        className="invisible absolute top-1/2 right-3 size-7 -translate-y-1/2 cursor-pointer bg-red-100 p-0 text-red-500 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 hover:bg-red-200"
      >
        <Trash2 />
      </Button>
    </div>
  );
};

export default KnowledgeFile;
