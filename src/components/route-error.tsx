import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LayoutWrapper from '@/components/animation-wrapper';
import { useNavigate, useRouteError } from 'react-router-dom';

const RouteError = () => {
  const error = useRouteError() as any;
  const navigate = useNavigate();
  const isDevelopment = process.env.NODE_ENV === 'development';

  const getErrorMessage = () => {
    if (error?.status === 404) {
      return {
        title: 'Page Not Found',
        description: 'The page you\'re looking for doesn\'t exist or has been moved.',
        action: 'Go Home',
        actionFn: () => navigate('/'),
      };
    }

    if (error?.status === 401) {
      return {
        title: 'Authentication Required',
        description: 'Please sign in to access this page.',
        action: 'Sign In',
        actionFn: () => navigate('/login'),
      };
    }

    if (error?.status === 403) {
      return {
        title: 'Access Denied',
        description: 'You don\'t have permission to access this page.',
        action: 'Go Home',
        actionFn: () => navigate('/'),
      };
    }

    if (error?.message?.includes('ChunkLoadError') || error?.message?.includes('Loading chunk')) {
      return {
        title: 'Update Required',
        description: 'A new version is available. Please refresh the page to continue.',
        action: 'Refresh Page',
        actionFn: () => window.location.reload(),
      };
    }

    return {
      title: 'Something went wrong',
      description: 'An error occurred while loading this page. Please try again.',
      action: 'Try Again',
      actionFn: () => window.location.reload(),
    };
  };

  const errorDetails = getErrorMessage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <LayoutWrapper className="text-center">
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
              <p className="text-center text-sm text-stone-600 leading-relaxed">
                {errorDetails.description}
              </p>
              
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={errorDetails.actionFn}
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {errorDetails.action}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Button>
              </div>

              {isDevelopment && error && (
                <details className="mt-6 rounded-md border border-red-200 bg-red-50 p-3">
                  <summary className="cursor-pointer text-xs font-medium text-red-700">
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 space-y-2 text-xs text-red-600">
                    <div>
                      <strong>Status:</strong> {error.status || 'Unknown'}
                    </div>
                    <div>
                      <strong>Status Text:</strong> {error.statusText || 'Unknown'}
                    </div>
                    {error.message && (
                      <div>
                        <strong>Message:</strong> {error.message}
                      </div>
                    )}
                    {error.stack && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="mt-1 whitespace-pre-wrap font-mono text-xs">
                          {error.stack}
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
                    className="text-orange-500 hover:text-orange-600 underline transition-colors"
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
  );
};

export default RouteError;