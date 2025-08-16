import axios from 'axios';
import type { TMessage } from '@/types/message.type';

export interface ChatStreamEvent {
  type: 'connected' | 'chunk' | 'complete';
  content?: string;
  fullResponse?: string;
}

export interface IWidgetConfig {
  _id: string;
  name: string;
  avatarIcon: string;
  chatIcon: string;
  accentColor: string;
  backgroundColor: string;
  removeBranding: boolean;
  initialMessage: string;
  conversationStarters: string[];
  instructions: string;
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

export interface ISendMessageResponse {
  message: TMessage;
  response: string;
}

export interface IMessageHistoryResponse {
  messages: TMessage[];
  conversationId: string;
}

// Create a separate API instance for widget (no Firebase auth)
const widgetApi = axios.create({
  baseURL: 'http://localhost:3000/api/widget',
  timeout: 30000,
});

// Add interceptor to include anonymous auth token
widgetApi.interceptors.request.use(async config => {
  // Note: The token will be added by the useAnonymousAuth hook
  // This interceptor is here for consistency and future token refresh logic
  return config;
});

const widgetApiService = {
  // Get widget configuration (public endpoint)
  async getConfig(chatbotId: string): Promise<IWidgetConfig> {
    const response = await widgetApi.get(`/config/${chatbotId}`);
    return response.data;
  },

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
    const response = await widgetApi.post(
      '/auth/refresh',
      { visitorId },
      {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
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
    const response = await fetch(`${widgetApi.defaults.baseURL}/messages/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

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

  // Save message to backend
  async saveMessage(
    data: Omit<ISendMessageRequest, 'messageHistory'> & {
      sender: 'user' | 'assistant';
      messageContent: string;
    },
    token: string
  ): Promise<TMessage> {
    const response = await widgetApi.post(
      '/messages',
      {
        chatbotId: data.chatbotId,
        visitorId: data.visitorId,
        conversationId: data.conversationId,
        message: data.messageContent,
        sender: data.sender,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};

export default widgetApiService;
