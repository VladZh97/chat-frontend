import { useEffect, useState, useCallback, useRef } from 'preact/hooks';
import { WidgetStorage } from '@/utils/widget-storage';
import widgetApiService, { setTokenRefreshHandler } from '@/api/widget';

export interface IAnonymousAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialLoading: boolean;
  visitorId: string | null;
  accessToken: string | null;
  error: string | null;
}

export interface IAnonymousAuthActions {
  authenticate: (chatbotId: string) => Promise<string | null>;
  refreshAuth: () => Promise<string | null>;
  logout: () => void;
}

export const useAnonymousAuth = (chatbotId: string) => {
  const [state, setState] = useState<IAnonymousAuthState>({
    isAuthenticated: false,
    isLoading: true,
    isInitialLoading: true,
    visitorId: null,
    accessToken: null,
    error: null,
  });

  // Track refresh attempts to prevent infinite loops
  const refreshAttempts = useRef(0);
  const maxRefreshAttempts = 3;
  const lastRefreshAttempt = useRef(0);
  const hasInitiallyAuthenticated = useRef(false);

  const updateState = useCallback((updates: Partial<IAnonymousAuthState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Prevent concurrent authenticate calls from running in parallel
  const inFlightAuthPromise = useRef<Promise<string | null> | null>(null);

  const authenticate = useCallback(
    async (chatbotId: string): Promise<string | null> => {
      if (inFlightAuthPromise.current) {
        return inFlightAuthPromise.current;
      }

      const promise = (async () => {
        try {
          const isInitial = !hasInitiallyAuthenticated.current;
          updateState({
            isLoading: true,
            isInitialLoading: isInitial,
            error: null,
          });

          // Get or create visitor ID
          const visitorId = WidgetStorage.getOrCreateVisitorId();

          // Check if we have a valid token in session storage
          const existingToken = WidgetStorage.getAccessToken();

          if (existingToken) {
            // Try to use existing token first
            hasInitiallyAuthenticated.current = true;
            updateState({
              isAuthenticated: true,
              isLoading: false,
              isInitialLoading: false,
              visitorId,
              accessToken: existingToken,
            });
            // Reset refresh attempts when using existing token
            refreshAttempts.current = 0;
            return existingToken;
          }

          // Create new anonymous authentication
          const authResponse = await widgetApiService.createAnonymousAuth({
            chatbotId,
            visitorId,
          });

          // Store the access token
          WidgetStorage.setAccessToken(authResponse.accessToken);

          hasInitiallyAuthenticated.current = true;
          updateState({
            isAuthenticated: true,
            isLoading: false,
            isInitialLoading: false,
            visitorId: authResponse.visitorId,
            accessToken: authResponse.accessToken,
          });

          // Reset refresh attempts on successful authentication
          refreshAttempts.current = 0;
          return authResponse.accessToken;
        } catch (error) {
          console.error('Anonymous authentication failed:', error);
          updateState({
            isAuthenticated: false,
            isLoading: false,
            isInitialLoading: false,
            error: error instanceof Error ? error.message : 'Authentication failed',
          });
          return null;
        } finally {
          inFlightAuthPromise.current = null;
        }
      })();

      inFlightAuthPromise.current = promise;
      return promise;
    },
    [updateState]
  );

  const refreshAuth = useCallback(async (): Promise<string | null> => {
    const now = Date.now();

    // Prevent rapid successive refresh attempts
    if (now - lastRefreshAttempt.current < 1000) {
      console.warn('Refresh attempt too soon, skipping');
      return null;
    }

    // Check if we've exceeded max attempts
    if (refreshAttempts.current >= maxRefreshAttempts) {
      console.warn('Max refresh attempts exceeded, clearing auth');
      WidgetStorage.clearAccessToken();
      updateState({
        isAuthenticated: false,
        isLoading: false,
        accessToken: null,
        error: 'Session expired. Please refresh the page.',
      });
      return null;
    }

    lastRefreshAttempt.current = now;
    refreshAttempts.current += 1;

    if (!state.visitorId || !state.accessToken) {
      // Only try to authenticate if we haven't exceeded attempts
      if (refreshAttempts.current < maxRefreshAttempts) {
        return authenticate(chatbotId);
      }
      return null;
    }

    try {
      // Don't set isLoading: true during refresh to prevent UI blinking
      updateState({ error: null });

      const authResponse = await widgetApiService.refreshAnonymousAuth(
        state.visitorId,
        state.accessToken
      );

      // Store the new access token
      WidgetStorage.setAccessToken(authResponse.accessToken);

      updateState({
        isAuthenticated: true,
        accessToken: authResponse.accessToken,
      });

      // Reset attempts on successful refresh
      refreshAttempts.current = 0;
      return authResponse.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);

      // Check if this is a 401/403 (token completely invalid) or other error
      const isAuthError =
        (error as any)?.response?.status === 401 || (error as any)?.response?.status === 403;

      if (isAuthError) {
        console.warn('Token refresh rejected by server, falling back to re-authentication');
        // For auth errors, immediately try to re-authenticate without counting as a retry
        refreshAttempts.current = 0; // Reset since we're starting fresh
        return authenticate(chatbotId);
      }

      // For non-auth errors (network, server errors), only retry if under limit
      if (refreshAttempts.current < maxRefreshAttempts) {
        console.warn('Token refresh failed due to non-auth error, retrying authentication');
        return authenticate(chatbotId);
      }

      // If we've exceeded attempts, clear everything
      WidgetStorage.clearAccessToken();
      updateState({
        isAuthenticated: false,
        accessToken: null,
        error: 'Session expired. Please refresh the page.',
      });
      return null;
    }
  }, [state.visitorId, state.accessToken, authenticate, chatbotId, updateState]);

  const logout = useCallback(() => {
    WidgetStorage.clearAccessToken();
    // Reset refresh attempts and initial auth flag on logout
    refreshAttempts.current = 0;
    hasInitiallyAuthenticated.current = false;
    updateState({
      isAuthenticated: false,
      isLoading: true,
      isInitialLoading: true,
      accessToken: null,
      error: null,
      // Keep visitorId for potential re-authentication
    });
  }, [updateState]);

  // Auto-retry authentication on token expiry (401 errors)
  const handleApiError = useCallback(
    async (error: any) => {
      if (error?.response?.status === 401) {
        const newToken = await refreshAuth();
        return !!newToken; // Indicate that auth was refreshed successfully
      }
      return false;
    },
    [refreshAuth]
  );

  // Register token refresh handler for axios interceptor
  useEffect(() => {
    setTokenRefreshHandler(refreshAuth);
  }, [refreshAuth]);

  // Initialize authentication on mount
  useEffect(() => {
    if (chatbotId) {
      authenticate(chatbotId);
    }
  }, [chatbotId, authenticate]);

  // Auto-refresh token before expiry (every 50 minutes if token is valid for 1 hour)
  useEffect(() => {
    if (!state.isAuthenticated || !state.accessToken) return;

    const refreshInterval = setInterval(
      () => {
        refreshAuth();
      },
      50 * 60 * 1000
    ); // 50 minutes

    return () => clearInterval(refreshInterval);
  }, [state.isAuthenticated, state.accessToken, refreshAuth]);

  return {
    ...state,
    authenticate,
    refreshAuth,
    logout,
    handleApiError,
  };
};
