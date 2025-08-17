import { useEffect, useRef } from 'preact/hooks';
import { WidgetStorage } from '@/utils/widget-storage';

export const usePromptChangeClear = (
  promptValue: string | undefined,
  chatbotId: string | undefined,
  visitorId: string | undefined,
  setMessages: (messages: any[]) => void
) => {
  const previousPromptValueRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const previousPromptValue = previousPromptValueRef.current;
    if (
      promptValue !== undefined &&
      previousPromptValue !== undefined &&
      previousPromptValue !== promptValue
    ) {
      setMessages([]);
      if (chatbotId && visitorId) {
        WidgetStorage.clearConversation(chatbotId, visitorId);
      }
    }
    previousPromptValueRef.current = promptValue;
  }, [promptValue, setMessages, chatbotId, visitorId]);
};
