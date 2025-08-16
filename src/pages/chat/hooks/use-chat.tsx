import { useEffect, useRef, useState } from 'preact/hooks';
import type { ChatStreamEvent } from '@/api/chat';
import { useParams } from 'react-router-dom';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import chatbot from '@/api/chatbot';

export const useChat = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingHtml, setStreamingHtml] = useState('');
  const streamingHtmlRef = useRef('');
  const pendingRef = useRef('');
  const fullAccumulatedRef = useRef('');
  const { id: chatbotId } = useParams();
  const { promptValue } = useChatbotStoreShallow(s => ({
    promptValue: s.promptValue,
  }));

  useEffect(() => {
    setMessages([]);
  }, [promptValue]);

  const handleSendMessage = async ({
    role,
    content,
  }: {
    role: 'user' | 'assistant';
    content: string;
  }) => {
    if (isStreaming || !content.trim()) return;
    const updatedMessages = [...messages, { role, content }];
    setMessages(updatedMessages);
    setInputValue('');
    setStreamingHtml('');
    streamingHtmlRef.current = '';
    pendingRef.current = '';
    fullAccumulatedRef.current = '';
    setIsStreaming(true);

    try {
      await chatbot.sendPlaygroundMessageStream(
        chatbotId!,
        updatedMessages,
        promptValue,
        (evt: ChatStreamEvent) => {
          if (evt.type === 'connected') return;
          if (evt.type === 'chunk') {
            const incoming = evt.content ?? '';
            // Always accumulate the raw content for a reliable final fallback
            fullAccumulatedRef.current += incoming;

            // Append to pending buffer and flush only at safe HTML boundaries
            pendingRef.current += incoming;

            const safeIndex = findSafeFlushIndex(pendingRef.current);
            if (safeIndex >= 0) {
              const flushChunk = pendingRef.current.slice(0, safeIndex + 1);
              const remainder = pendingRef.current.slice(safeIndex + 1);
              pendingRef.current = remainder;

              setStreamingHtml(prev => {
                const next = prev + flushChunk;
                streamingHtmlRef.current = next;
                return next;
              });
            }
            return;
          }
          if (evt.type === 'complete') {
            // Prefer server-provided full response; otherwise combine displayed + any remainder
            const finalContent =
              evt.fullResponse ??
              streamingHtmlRef.current + pendingRef.current ??
              fullAccumulatedRef.current;
            setMessages(prev => [...prev, { role: 'assistant', content: finalContent }]);
            setStreamingHtml('');
            streamingHtmlRef.current = '';
            pendingRef.current = '';
            fullAccumulatedRef.current = '';
          }
        }
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return { messages, inputValue, setInputValue, handleSendMessage, isStreaming, streamingHtml };
};

// Returns the last index in the input that is safe to render (i.e., not splitting inside a tag, comment, or entity).
// If nothing is safe to flush yet, returns -1.
function findSafeFlushIndex(input: string): number {
  let insideTag = false;
  let insideComment = false;
  let insideEntity = false;
  let quote: '"' | "'" | null = null;
  let safeIndex = -1;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (insideComment) {
      // Detect end of comment -->
      if (ch === '>' && input[i - 1] === '-' && input[i - 2] === '-') {
        insideComment = false;
        safeIndex = i; // up to and including '>' is safe
      }
      continue;
    }

    if (insideTag) {
      if (quote) {
        if (ch === quote) quote = null;
      } else {
        if (ch === '"' || ch === "'") {
          quote = ch as '"' | "'";
        } else if (ch === '>') {
          insideTag = false;
          safeIndex = i;
        }
      }
      continue;
    }

    if (insideEntity) {
      if (ch === ';') {
        insideEntity = false;
        safeIndex = i;
      }
      continue;
    }

    // Not inside anything special
    if (ch === '<') {
      if (input.slice(i, i + 4) === '<!--') {
        insideComment = true;
      } else {
        insideTag = true;
      }
      // Do not advance safeIndex here; we don't want to include the '<' yet
      continue;
    }

    if (ch === '&') {
      insideEntity = true;
      continue;
    }

    // Regular text character; safe to render through here
    safeIndex = i;
  }

  return safeIndex;
}
