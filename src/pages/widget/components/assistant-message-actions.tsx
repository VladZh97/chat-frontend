import { Copy, CopyCheck, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'preact/hooks';

export const AssistantMessageActions = ({ message }: { message: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    // Create a temporary element to extract text content from HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = message;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="invisible absolute bottom-0 left-0 flex translate-y-full items-center gap-2 pt-1 opacity-0 transition-[opacity,visibility] group-hover:visible group-hover:opacity-100">
      <span className="group/icon cursor-pointer" onClick={handleCopy}>
        {isCopied ? (
          <CopyCheck className="size-[14px] text-stone-500 transition-colors group-hover/icon:text-stone-900" />
        ) : (
          <Copy className="size-[14px] text-stone-500 transition-colors group-hover/icon:text-stone-900" />
        )}
      </span>
      <span className="group/icon cursor-pointer">
        <ThumbsUp className="size-[14px] text-stone-500 transition-colors group-hover/icon:text-stone-900" />
      </span>
      <span className="group/icon cursor-pointer">
        <ThumbsDown className="size-[14px] text-stone-500 transition-colors group-hover/icon:text-stone-900" />
      </span>
    </div>
  );
};
