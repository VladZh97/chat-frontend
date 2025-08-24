import { Wifi, WifiOff, Server, RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LayoutWrapper from '@/components/animation-wrapper';
import { useNavigate } from 'react-router-dom';

export interface NetworkErrorProps {
  error?: {
    code?: number;
    message?: string;
    type?: 'network' | 'server' | 'timeout' | 'unknown';
  };
  onRetry?: () => void;
  retryLabel?: string;
}

const NetworkError = ({ error, onRetry, retryLabel = 'Try Again' }: NetworkErrorProps) => {
  const navigate = useNavigate();

  const getErrorConfig = () => {
    const code = error?.code;
    const type = error?.type;

    // Network connectivity issues
    if (type === 'network' || !navigator.onLine) {
      return {
        icon: WifiOff,
        iconColor: 'text-red-500',
        bgColor: 'bg-red-50',
        title: 'No Internet Connection',
        description: 'Please check your internet connection and try again. Make sure you\'re connected to the internet.',
        action: retryLabel,
        showConnectivityTip: true,
      };
    }

    // Server errors (5xx)
    if (code && code >= 500) {
      return {
        icon: Server,
        iconColor: 'text-orange-500',
        bgColor: 'bg-orange-50',
        title: 'Server Error',
        description: 'Our servers are experiencing some issues. Please try again in a few moments.',
        action: retryLabel,
        showServerTip: true,
      };
    }

    // Client errors (4xx)
    if (code && code >= 400 && code < 500) {
      if (code === 401) {
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          title: 'Authentication Required',
          description: 'Your session has expired. Please sign in again to continue.',
          action: 'Sign In',
          actionFn: () => navigate('/login'),
        };
      }

      if (code === 403) {
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          title: 'Access Denied',
          description: 'You don\'t have permission to access this resource.',
          action: 'Go Home',
          actionFn: () => navigate('/'),
        };
      }

      if (code === 404) {
        return {
          icon: AlertTriangle,
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-50',
          title: 'Resource Not Found',
          description: 'The requested resource could not be found. It may have been moved or deleted.',
          action: 'Go Home',
          actionFn: () => navigate('/'),
        };
      }

      return {
        icon: AlertTriangle,
        iconColor: 'text-yellow-500',
        bgColor: 'bg-yellow-50',
        title: 'Request Error',
        description: 'There was a problem with your request. Please check your input and try again.',
        action: retryLabel,
      };
    }

    // Timeout errors
    if (type === 'timeout') {
      return {
        icon: Wifi,
        iconColor: 'text-blue-500',
        bgColor: 'bg-blue-50',
        title: 'Request Timed Out',
        description: 'The request is taking longer than expected. Please try again.',
        action: retryLabel,
      };
    }

    // Generic network error
    return {
      icon: WifiOff,
      iconColor: 'text-gray-500',
      bgColor: 'bg-gray-50',
      title: 'Connection Problem',
      description: 'Unable to connect to our services. Please check your connection and try again.',
      action: retryLabel,
    };
  };

  const config = getErrorConfig();
  const IconComponent = config.icon;

  const handleAction = () => {
    if (config.actionFn) {
      config.actionFn();
    } else if (onRetry) {
      onRetry();
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <LayoutWrapper className="flex h-full items-center justify-center p-8">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${config.bgColor}`}>
            <IconComponent className={`h-8 w-8 ${config.iconColor}`} />
          </div>
          <CardTitle className="text-xl font-semibold text-stone-950">
            {config.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-center text-sm text-stone-600 leading-relaxed">
              {config.description}
            </p>
            
            {config.showConnectivityTip && (
              <div className="rounded-md bg-blue-50 border border-blue-200 p-3">
                <p className="text-xs text-blue-700">
                  <strong>Tips:</strong> Check your WiFi connection, mobile data, or try switching networks.
                </p>
              </div>
            )}

            {config.showServerTip && (
              <div className="rounded-md bg-orange-50 border border-orange-200 p-3">
                <p className="text-xs text-orange-700">
                  <strong>Server Status:</strong> We're working to resolve this issue. Please try again shortly.
                </p>
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleAction}
                className="w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {config.action}
              </Button>
              
              {!config.actionFn && (
                <Button 
                  variant="outline"
                  onClick={handleGoHome}
                  className="w-full"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Button>
              )}
            </div>

            {error?.message && (
              <details className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-3">
                <summary className="cursor-pointer text-xs font-medium text-gray-700">
                  Technical Details
                </summary>
                <div className="mt-2 text-xs text-gray-600">
                  <strong>Error Code:</strong> {error.code || 'Unknown'}<br />
                  <strong>Message:</strong> {error.message}
                </div>
              </details>
            )}

            <div className="pt-4 text-center">
              <p className="text-xs text-stone-500">
                Need help?{' '}
                <a 
                  href="mailto:support@heyway.chat" 
                  className="text-orange-500 hover:text-orange-600 underline transition-colors"
                >
                  Contact support
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </LayoutWrapper>
  );
};

export default NetworkError;