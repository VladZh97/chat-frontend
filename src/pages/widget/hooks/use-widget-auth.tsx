import { useEffect } from 'preact/hooks';
import { useAnonymousAuth } from '@/hooks/use-anonymous-auth';
import { useWidgetStoreShallow } from '../store/widget.store';

export const useWidgetAuth = (chatbotId: string) => {
  const { setAuthState, setVisitorId } = useWidgetStoreShallow(s => ({
    setAuthState: s.setAuthState,
    setVisitorId: s.setVisitorId,
  }));

  const {
    isAuthenticated: authIsAuthenticated,
    isLoading: authIsLoading,
    isInitialLoading: authIsInitialLoading,
    visitorId: authVisitorId,
    accessToken,
    error: authError,
    handleApiError,
  } = useAnonymousAuth(chatbotId);

  // Sync auth state with widget store
  useEffect(() => {
    setAuthState({
      isAuthenticated: authIsAuthenticated,
      isAuthLoading: authIsLoading,
      isInitialAuthLoading: authIsInitialLoading,
      authError,
    });
    if (authVisitorId) {
      setVisitorId(authVisitorId);
    }
  }, [
    authIsAuthenticated,
    authIsLoading,
    authIsInitialLoading,
    authError,
    authVisitorId,
    setAuthState,
    setVisitorId,
  ]);

  return {
    authIsAuthenticated,
    authIsLoading,
    authIsInitialLoading,
    authVisitorId,
    accessToken,
    authError,
    handleApiError,
  } as const;
};
