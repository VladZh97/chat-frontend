import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorResponseMessageProps {
  errorMessage?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const ErrorResponseMessage = ({
  errorMessage = 'Something went wrong. Please try again.',
  onRetry,
  isRetrying = false,
}: ErrorResponseMessageProps) => {
  return (
    <div className="absolute bottom-1 left-4 flex w-[calc(100%-2rem)] items-center justify-between rounded-lg border border-red-200 bg-red-100 px-4 py-3">
      <span className="text-sm font-medium text-red-950">{errorMessage}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className={cn(
            'flex items-center justify-center rounded p-1 transition-all',
            'hover:bg-red-200 focus:ring-2 focus:ring-red-300 focus:outline-none',
            isRetrying ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:opacity-80'
          )}
          aria-label="Retry message"
        >
          <RotateCcw className={cn('h-4 w-4 text-red-950', isRetrying && 'animate-spin')} />
        </button>
      )}
    </div>
  );
};
