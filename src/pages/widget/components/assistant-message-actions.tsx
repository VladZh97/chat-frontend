import { Copy, CopyCheck, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'preact/hooks';
import widgetApiService from '@/api/widget';
import { WidgetStorage } from '@/utils/widget-storage';

interface AssistantMessageActionsProps {
  message: string;
  messageId?: string;
  rating?: number;
  chatbotId?: string;
  visitorId?: string;
  conversationId?: string;
  accessToken?: string;
}

export const AssistantMessageActions = ({
  message,
  messageId,
  rating,
  chatbotId,
  visitorId,
  conversationId,
  accessToken,
}: AssistantMessageActionsProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [currentRating, setCurrentRating] = useState<number | undefined>(rating);
  const [isRating, setIsRating] = useState(false);

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

  const handleRating = async (newRating: number) => {
    // Prevent rating if already rated or missing required data
    if (
      currentRating !== undefined ||
      !messageId ||
      !accessToken ||
      !chatbotId ||
      !visitorId ||
      !conversationId ||
      isRating
    ) {
      return;
    }

    setIsRating(true);

    try {
      // Optimistically update UI
      setCurrentRating(newRating);

      // Update localStorage
      WidgetStorage.updateMessageRating(chatbotId, visitorId, conversationId, messageId, newRating);

      // Send to backend
      await widgetApiService.rateMessage({ messageId, rating: newRating }, accessToken);
    } catch (error) {
      console.error('Failed to rate message:', error);
      // Rollback on error
      setCurrentRating(undefined);
      WidgetStorage.updateMessageRating(
        chatbotId,
        visitorId,
        conversationId,
        messageId,
        undefined as any
      );
    } finally {
      setIsRating(false);
    }
  };

  const canRate =
    messageId &&
    accessToken &&
    chatbotId &&
    visitorId &&
    conversationId &&
    currentRating === undefined &&
    !isRating;

  return (
    <div className="invisible absolute bottom-0 left-0 flex translate-y-full items-center gap-2 pt-1 opacity-0 transition-[opacity,visibility] group-hover:visible group-hover:opacity-100">
      <span className="group/icon cursor-pointer" onClick={handleCopy}>
        {isCopied ? (
          <CopyCheck className="size-[14px] text-stone-500 transition-colors group-hover/icon:text-stone-900" />
        ) : (
          <Copy className="size-[14px] text-stone-500 transition-colors group-hover/icon:text-stone-900" />
        )}
      </span>
      <span
        className={`group/icon ${canRate ? 'cursor-pointer' : 'cursor-default'}`}
        onClick={() => canRate && handleRating(5)}
      >
        <ThumbsUp
          className={`size-[14px] transition-colors ${
            currentRating === 5
              ? 'text-green-600'
              : canRate
                ? 'text-stone-500 group-hover/icon:text-green-600'
                : 'text-stone-300'
          }`}
        />
      </span>
      <span
        className={`group/icon ${canRate ? 'cursor-pointer' : 'cursor-default'}`}
        onClick={() => canRate && handleRating(0)}
      >
        <ThumbsDown
          className={`size-[14px] transition-colors ${
            currentRating === 0
              ? 'text-red-600'
              : canRate
                ? 'text-stone-500 group-hover/icon:text-red-600'
                : 'text-stone-300'
          }`}
        />
      </span>
    </div>
  );
};
