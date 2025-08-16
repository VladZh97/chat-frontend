import { useEffect, useState, useCallback } from 'preact/hooks';
import { WidgetStorage } from '@/utils/widget-storage';
import widgetApiService from '@/api/widget';

export interface IAnonymousAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  visitorId: string | null;
  accessToken: string | null;
  error: string | null;
}

export interface IAnonymousAuthActions {
  authenticate: (chatbotId: string) => Promise<void>;
  refreshAuth: () => Promise<void>;
  logout: () => void;
}

export const useAnonymousAuth = (chatbotId: string) => {
  const [state, setState] = useState<IAnonymousAuthState>({
    isAuthenticated: false,
    isLoading: true,
    visitorId: null,
    accessToken: null,
    error: null,
  });

  const updateState = useCallback((updates: Partial<IAnonymousAuthState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const authenticate = useCallback(
    async (chatbotId: string) => {
      try {
        updateState({ isLoading: true, error: null });

        // Get or create visitor ID
        const visitorId = WidgetStorage.getOrCreateVisitorId();

        // Check if we have a valid token in session storage
        const existingToken = WidgetStorage.getAccessToken();

        if (existingToken) {
          // Try to use existing token first
          updateState({
            isAuthenticated: true,
            isLoading: false,
            visitorId,
            accessToken: existingToken,
          });
          return;
        }

        // Create new anonymous authentication
        const authResponse = await widgetApiService.createAnonymousAuth({
          chatbotId,
          visitorId,
        });

        // Store the access token
        WidgetStorage.setAccessToken(authResponse.accessToken);

        updateState({
          isAuthenticated: true,
          isLoading: false,
          visitorId: authResponse.visitorId,
          accessToken: authResponse.accessToken,
        });
      } catch (error) {
        console.error('Anonymous authentication failed:', error);
        updateState({
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Authentication failed',
        });
      }
    },
    [updateState]
  );

  const refreshAuth = useCallback(async () => {
    if (!state.visitorId || !state.accessToken) {
      return authenticate(chatbotId);
    }

    try {
      updateState({ isLoading: true, error: null });

      const authResponse = await widgetApiService.refreshAnonymousAuth(
        state.visitorId,
        state.accessToken
      );

      // Store the new access token
      WidgetStorage.setAccessToken(authResponse.accessToken);

      updateState({
        isAuthenticated: true,
        isLoading: false,
        accessToken: authResponse.accessToken,
      });
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, try to authenticate again
      await authenticate(chatbotId);
    }
  }, [state.visitorId, state.accessToken, authenticate, chatbotId, updateState]);

  const logout = useCallback(() => {
    WidgetStorage.clearAccessToken();
    updateState({
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      error: null,
      // Keep visitorId for potential re-authentication
    });
  }, [updateState]);

  // Auto-retry authentication on token expiry (401 errors)
  const handleApiError = useCallback(
    async (error: any) => {
      if (error?.response?.status === 401) {
        await refreshAuth();
        return true; // Indicate that auth was refreshed
      }
      return false;
    },
    [refreshAuth]
  );

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
