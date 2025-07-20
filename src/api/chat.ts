import { v4 as uuidv4 } from 'uuid';
import api from './api';

// Types
export interface ChatAuthRequest {
  chatbotId: string;
  visitorId: string;
}

export interface ChatAuthResponse {
  token: string;
}

export interface ChatMessageRequest {
  chatbotId: string;
  visitorId: string;
  message: string;
}

export interface ChatMessageResponse {
  // Add specific response type based on your API
  [key: string]: any;
}

export interface ChatStreamResponse {
  type: string;
  chunk: string;
}

// Constants
const STORAGE_VISITOR_KEY = 'hw_visitor_id';
const STORAGE_CONVERSATION_KEY = 'hw_conversation_id';
const STORAGE_TOKEN_KEY = 'hw_token';

// Utility functions
const getConversationId = (): string => {
  const conversationId = localStorage.getItem(STORAGE_CONVERSATION_KEY) || uuidv4();
  localStorage.setItem(STORAGE_CONVERSATION_KEY, conversationId);
  return conversationId;
};

const getVisitorId = (): string => {
  const visitorId = localStorage.getItem(STORAGE_VISITOR_KEY) || uuidv4();
  localStorage.setItem(STORAGE_VISITOR_KEY, visitorId);
  return visitorId;
};

const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_TOKEN_KEY);
};

const chat = {
  auth: async (chatbotId: string): Promise<ChatAuthResponse> => {
    const token = getToken();
    if (token) return { token };
    const visitorId = getVisitorId();
    const { data } = await api.post<ChatAuthResponse>('/chat/auth', {
      chatbotId,
      visitorId,
    });
    localStorage.setItem(STORAGE_TOKEN_KEY, data.token);
    return data;
  },

  sendMessageStream: async (
    chatbotId: string,
    message: string,
    onChunk: (chunk: ChatStreamResponse) => void
  ): Promise<void> => {
    try {
      const conversationId = getConversationId();

      // Helper function to make the request
      const makeRequest = async (token: string) => {
        const response = await fetch(`${api.defaults.baseURL}/chat/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            chatbotId,
            message,
            conversationId,
          }),
        });
        return response;
      };

      // Helper function to process the stream
      const processStream = async (response: Response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error('No response body available');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim() === '') continue;
            if (line.startsWith(':')) continue; // Skip SSE comments/keep-alive
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') return;
              try {
                const chunk: ChatStreamResponse = JSON.parse(data);
                onChunk(chunk);
              } catch (error) {
                console.error('Failed to parse stream chunk:', error);
              }
            }
          }
        }
      };

      // Get token and make initial request
      let token = getToken();
      if (!token) {
        const { token: newToken } = await chat.auth(chatbotId);
        localStorage.setItem(STORAGE_TOKEN_KEY, newToken);
        token = newToken;
      }

      let response = await makeRequest(token);

      // Handle 401 by re-authenticating and retrying once
      if (response.status === 401) {
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        const { token: newToken } = await chat.auth(chatbotId);
        localStorage.setItem(STORAGE_TOKEN_KEY, newToken);

        response = await makeRequest(newToken);
      }

      await processStream(response);
    } catch (error) {
      console.error('Failed to send streaming message:', error);
      throw error;
    }
  },
};

export default chat;
