import { Copy, RefreshCw, ThumbsDown, ThumbsUp } from 'lucide-react';

export const AssistantMessageActions = () => {
  return (
    <div className="mt-2 flex items-center gap-2">
      <span className="group cursor-pointer">
        <RefreshCw className="size-[14px] text-stone-500 transition-colors group-hover:text-stone-900" />
      </span>
      <span className="group cursor-pointer">
        <Copy className="size-[14px] text-stone-500 transition-colors group-hover:text-stone-900" />
      </span>
      <span className="group cursor-pointer">
        <ThumbsUp className="size-[14px] text-stone-500 transition-colors group-hover:text-stone-900" />
      </span>
      <span className="group cursor-pointer">
        <ThumbsDown className="size-[14px] text-stone-500 transition-colors group-hover:text-stone-900" />
      </span>
    </div>
  );
};
