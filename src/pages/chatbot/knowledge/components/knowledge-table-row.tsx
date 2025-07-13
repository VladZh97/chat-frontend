import { knowledge } from '@/api/knowledge';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import queryClient from '@/lib/query';
import { cn } from '@/lib/utils';
import type { IKnowledge } from '@/types/knowledge.type';
import { useMutation } from '@tanstack/react-query';
import { Ellipsis, FileText, Link, Loader2, PencilLine, Trash, Type } from 'lucide-react';
import { useState } from 'preact/hooks';
import { useParams } from 'react-router-dom';

// Type configuration for better maintainability
const TYPE_CONFIG = {
  website: { icon: Link, label: 'Link' },
  file: { icon: FileText, label: 'File' },
  text: { icon: Type, label: 'Text' },
} as const;

const KnowledgeTableRow = ({ data }: { data: IKnowledge }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { id: chatbotId } = useParams();

  const typeConfig = TYPE_CONFIG[data.type] || TYPE_CONFIG.text;
  const IconComponent = typeConfig.icon;

  const { mutateAsync: deleteKnowledge, isPending } = useMutation({
    mutationFn: () => knowledge.delete(data._id, chatbotId as string),
    onSuccess: () => {
      queryClient.setQueryData(['knowledge', chatbotId], (oldData: IKnowledge[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.filter(item => item._id !== data._id);
      });
    },
  });

  const handleDelete = async () => {
    if (isPending) return;
    try {
      await deleteKnowledge();
      queryClient.invalidateQueries({ queryKey: ['tokens-usage', chatbotId] });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-12 items-center border-b border-neutral-200 bg-white last:border-b-0">
      <div className="flex size-10 shrink-0 items-center justify-center">
        <Checkbox className="cursor-pointer" />
      </div>
      <div className="flex h-10 w-22 shrink-0 items-center gap-2 px-2 text-xs text-neutral-500">
        <span className="flex h-6 items-center gap-1 rounded-md border border-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-900">
          <IconComponent className="size-4 text-neutral-500" />
          {typeConfig.label}
        </span>
      </div>
      <div className="grid h-10 items-center text-sm text-neutral-900">
        <span className="truncate">
          {data.type === 'website' && data.metadata.url}
          {data.type === 'file' && `${data.metadata.name}.${data.metadata.extension}`}
          {data.type === 'text' && data.metadata.title}
        </span>
      </div>
      <div className="ml-auto shrink-0 pr-2 pl-10">
        <Popover open={isOpen || isPending} onOpenChange={setIsOpen}>
          <PopoverTrigger
            className={cn(
              'flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors duration-200 hover:bg-neutral-200',
              (isOpen || isPending) && 'bg-neutral-200'
            )}
          >
            <Ellipsis className="size-4 text-neutral-900" />
          </PopoverTrigger>
          <PopoverContent
            align="center"
            side="bottom"
            className="w-48 space-y-1 rounded-lg bg-white p-2 shadow-lg"
          >
            {data.type === 'text' && (
              <div
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-neutral-900 hover:bg-neutral-100"
                //   onClick={() => setIsEditProfileOpen(true)}
              >
                <PencilLine className="size-4" />
                Edit source
              </div>
            )}
            <div
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-red-600 hover:bg-red-50',
                isPending && 'cursor-default'
              )}
              onClick={handleDelete}
            >
              <Trash className="size-4" />
              Remove source
              {isPending && <Loader2 className="ml-auto size-4 animate-spin" />}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default KnowledgeTableRow;
