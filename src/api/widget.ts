import axios from 'axios';
import type { TMessage } from '@/types/message.type';
import { WidgetStorage } from '@/utils/widget-storage';

export interface ChatStreamEvent {
  type: 'connected' | 'chunk' | 'complete';
  content?: string;
  fullResponse?: string;
}

export interface IAnonymousAuthRequest {
  chatbotId: string;
  visitorId: string;
}

export interface IAnonymousAuthResponse {
  accessToken: string;
  expiresIn: number;
  visitorId: string;
}

export interface ISendMessageRequest {
  chatbotId: string;
  visitorId: string;
  conversationId: string;
  message: string;
  messageHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface IMessageHistoryResponse {
  messages: TMessage[];
  conversationId: string;
}

export interface ISubmitEmailRequest {
  chatbotId: string;
  visitorId: string;
  email: string;
  conversationId: string;
}

// Global token refresh handler - will be set by useAnonymousAuth
let tokenRefreshHandler: (() => Promise<string | null>) | null = null;

export const setTokenRefreshHandler = (handler: () => Promise<string | null>) => {
  tokenRefreshHandler = handler;
};

// Create a separate API instance for widget (no Firebase auth)
const widgetApi = axios.create({
  baseURL: 'http://localhost:3000/api/widget',
  timeout: 30000,
});

// Add interceptor to include anonymous auth token
widgetApi.interceptors.request.use(async config => {
  const token = WidgetStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle 401 errors
widgetApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && tokenRefreshHandler) {
      originalRequest._retry = true;

      try {
        const newToken = await tokenRefreshHandler();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return widgetApi(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed during API call:', refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const widgetApiService = {
  // Create anonymous authentication
  async createAnonymousAuth(data: IAnonymousAuthRequest): Promise<IAnonymousAuthResponse> {
    const response = await widgetApi.post('/auth/anonymous', data);
    return response.data;
  },

  // Refresh anonymous token
  async refreshAnonymousAuth(
    visitorId: string,
    currentToken: string
  ): Promise<IAnonymousAuthResponse> {
    // Create a direct axios call bypassing interceptors for refresh
    // since the current token might be expired
    const response = await axios.post(
      `${widgetApi.defaults.baseURL}/auth/refresh`,
      { visitorId, currentToken },
      {
        timeout: widgetApi.defaults.timeout,
        // Don't use Authorization header since token might be expired
        // Send token in body instead for backend validation
      }
    );
    return response.data;
  },

  // Send message with streaming support
  async sendMessageStream(
    data: ISendMessageRequest,
    token: string,
    onEvent: (event: ChatStreamEvent) => void
  ): Promise<void> {
    const makeRequest = async (authToken: string) => {
      const response = await fetch(`${widgetApi.defaults.baseURL}/messages/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });

      if (response.status === 401 && tokenRefreshHandler) {
        // Try to refresh token and retry once
        const newToken = await tokenRefreshHandler();
        if (newToken) {
          return fetch(`${widgetApi.defaults.baseURL}/messages/stream`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${newToken}`,
            },
            body: JSON.stringify(data),
          });
        }
      }

      return response;
    };

    const response = await makeRequest(token);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No readable stream available');
    }

    const decoder = new TextDecoder();

    try {
      onEvent({ type: 'connected' });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onEvent({ type: 'complete' });
              return;
            }
            try {
              const parsed = JSON.parse(data);
              onEvent({
                type: 'chunk',
                content: parsed.content,
                fullResponse: parsed.fullResponse,
              });
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  },

  // Get message history for a conversation
  async getMessageHistory(
    chatbotId: string,
    visitorId: string,
    conversationId: string,
    token: string
  ): Promise<IMessageHistoryResponse> {
    const response = await widgetApi.get(`/messages/${chatbotId}/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { visitorId },
    });
    return response.data;
  },

  // Submit user email for lead collection
  async submitEmail(data: ISubmitEmailRequest, token: string): Promise<void> {
    await widgetApi.post('/leads/email', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default widgetApiService;
