import { useState, useCallback } from 'preact/hooks';
import NetworkError from '@/components/network-error';
import { useDialog } from '@/hooks';

export interface ApiError {
  code?: number;
  message?: string;
  type?: 'network' | 'server' | 'timeout' | 'unknown';
}

export const useErrorHandler = () => {
  const [error, setError] = useState<ApiError | null>(null);
  const { showDialog } = useDialog();

  const handleError = useCallback((error: any) => {
    let apiError: ApiError = {
      type: 'unknown',
      message: 'An unexpected error occurred',
    };

    if (error?.response) {
      // Server responded with an error status
      apiError = {
        code: error.response.status,
        message: error.response.data?.message || error.message || 'Server error',
        type: error.response.status >= 500 ? 'server' : 'unknown',
      };
    } else if (error?.request) {
      // Request was made but no response received (network error)
      apiError = {
        message: 'Network connection failed',
        type: 'network',
      };
    } else if (error?.code === 'ECONNABORTED') {
      // Request timeout
      apiError = {
        message: 'Request timed out',
        type: 'timeout',
      };
    } else if (error?.message) {
      // Other errors with message
      apiError = {
        message: error.message,
        type: 'unknown',
      };
    }

    setError(apiError);
    return apiError;
  }, []);

  const showNetworkError = useCallback((apiError: ApiError, onRetry?: () => void) => {
    const NetworkErrorComponent = () => <NetworkError error={apiError} onRetry={onRetry} />;
    
    showDialog('network-error', NetworkErrorComponent);
  }, [showDialog]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const withErrorHandling = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>
  ) => {
    return async (...args: T): Promise<R | null> => {
      try {
        const result = await fn(...args);
        clearError();
        return result;
      } catch (error) {
        const apiError = handleError(error);
        
        // For critical errors, show the network error dialog
        if (apiError.type === 'network' || (apiError.code && apiError.code >= 500)) {
          showNetworkError(apiError, () => fn(...args));
        }
        
        return null;
      }
    };
  }, [handleError, clearError, showNetworkError]);

  return {
    error,
    handleError,
    clearError,
    showNetworkError,
    withErrorHandling,
  };
};

export default useErrorHandler;