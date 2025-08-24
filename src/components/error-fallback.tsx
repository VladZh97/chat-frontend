import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LayoutWrapper from '@/components/animation-wrapper';
import { useNavigate } from 'react-router-dom';
import type { ErrorFallbackProps } from './error-boundary';

const ErrorFallback = ({ error, errorInfo, resetError }: ErrorFallbackProps) => {
  const navigate = useNavigate();
  const isDevelopment = process.env.NODE_ENV === 'development';

  const handleTryAgain = () => {
    resetError();
  };

  const handleGoHome = () => {
    navigate('/');
    resetError();
  };

  const getErrorMessage = () => {
    if (error?.message?.includes('ChunkLoadError') || error?.message?.includes('Loading chunk')) {
      return {
        title: 'Update Required',
        description: 'A new version is available. Please refresh the page to continue.',
        action: 'Refresh Page',
        actionFn: () => window.location.reload(),
      };
    }

    if (error?.message?.includes('Network')) {
      return {
        title: 'Connection Problem',
        description: 'Please check your internet connection and try again.',
        action: 'Try Again',
        actionFn: handleTryAgain,
      };
    }

    return {
      title: 'Something went wrong',
      description:
        'An unexpected error occurred. You can try refreshing the page or go back to the dashboard.',
      action: 'Try Again',
      actionFn: handleTryAgain,
    };
  };

  const errorDetails = getErrorMessage();

  return (
    <div className="w-[calc(100%-272px)] p-2">
      <div className="h-full overflow-hidden rounded-xl bg-stone-50 shadow-md">
        <LayoutWrapper className="no-scrollbar grid h-full place-items-center overflow-y-auto p-8">
          <Card className="mx-auto w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <CardTitle className="text-xl font-semibold text-stone-950">
                {errorDetails.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-center text-sm leading-relaxed text-stone-600">
                  {errorDetails.description}
                </p>

                <div className="flex flex-col gap-2">
                  <Button onClick={errorDetails.actionFn} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {errorDetails.action}
                  </Button>

                  <Button variant="outline" onClick={handleGoHome} className="w-full">
                    <Home className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Button>
                </div>

                {isDevelopment && error && (
                  <details className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 wrap-anywhere">
                    <summary className="cursor-pointer text-xs font-medium text-red-700">
                      Error Details (Development)
                    </summary>
                    <div className="mt-2 space-y-2 text-xs text-red-600">
                      <div>
                        <strong>Error:</strong> {error.message}
                      </div>
                      {error.stack && (
                        <div>
                          <strong>Stack:</strong>
                          <pre className="mt-1 font-mono text-xs whitespace-pre-wrap">
                            {error.stack}
                          </pre>
                        </div>
                      )}
                      {errorInfo?.componentStack && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="mt-1 font-mono text-xs whitespace-pre-wrap">
                            {errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}

                <div className="pt-4 text-center">
                  <p className="text-xs text-stone-500">
                    If this problem persists, please{' '}
                    <a
                      href="mailto:support@heyway.chat"
                      className="text-orange-500 underline transition-colors hover:text-orange-600"
                    >
                      contact support
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </LayoutWrapper>
      </div>
    </div>
  );
};

export default ErrorFallback;
