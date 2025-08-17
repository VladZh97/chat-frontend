import type { MutableRef } from 'preact/hooks';
import { findSafeFlushIndex } from '@/pages/usage/utils';

export const appendChunkAndMaybeFlush = (
  incoming: string,
  pendingRef: MutableRef<string>,
  fullAccumulatedRef: MutableRef<string>,
  streamingHtmlRef: MutableRef<string>,
  setStreamingHtml: (updater: (prev: string) => string) => void
) => {
  fullAccumulatedRef.current += incoming;
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
};

export const computeFinalContent = (
  fullResponse: string | undefined,
  streamingHtmlRef: MutableRef<string>,
  pendingRef: MutableRef<string>,
  fullAccumulatedRef: MutableRef<string>
) => {
  return (
    fullResponse ?? streamingHtmlRef.current + pendingRef.current ?? fullAccumulatedRef.current
  );
};
