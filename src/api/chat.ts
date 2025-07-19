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
const COOKIE_KEY = 'hw_conversation_id';

// Utility functions
const getConversationId = (): string => {
  const conversationId = localStorage.getItem(COOKIE_KEY) || uuidv4();
  localStorage.setItem(COOKIE_KEY, conversationId);
  return conversationId;
};

const chat = {
  /**
   * Authenticate a visitor with a chatbot
   * @param chatbotId - The ID of the chatbot to authenticate with
   * @returns Promise<ChatAuthResponse> - Authentication response
   */
  auth: async (chatbotId: string): Promise<ChatAuthResponse> => {
    const conversationId = getConversationId();
    const { data } = await api.post<ChatAuthResponse>(
      '/chat/auth',
      {
        chatbotId,
        conversationId,
      },
      {
        withCredentials: true,
      }
    );
    return data;
  },

  /**
   * Send a message to a chatbot
   * @param chatbotId - The ID of the chatbot
   * @param message - The message to send
   * @returns Promise<ChatMessageResponse> - Message response
   */
  sendMessage: async (chatbotId: string, message: string): Promise<ChatMessageResponse> => {
    try {
      const conversationId = getConversationId();
      const { data } = await api.post<ChatMessageResponse>('/chat/message', {
        chatbotId,
        message,
        conversationId,
      });
      return data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  },

  /**
   * Send a message to a chatbot with streaming response
   * @param chatbotId - The ID of the chatbot
   * @param message - The message to send
   * @param onChunk - Callback function to handle each chunk of the stream
   * @returns Promise<void> - Resolves when stream is complete
   */
  sendMessageStream: async (
    chatbotId: string,
    message: string,
    onChunk: (chunk: ChatStreamResponse) => void
  ): Promise<void> => {
    try {
      const conversationId = getConversationId();

      const response = await fetch(`${api.defaults.baseURL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream', // Add this header
        },
        credentials: 'include',
        body: JSON.stringify({
          chatbotId,
          message,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if the response is actually a stream
      if (!response.body) {
        throw new Error('No response body available');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      console.log('Starting to read stream...'); // Add debugging

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('Stream finished'); // Add debugging
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          if (line.startsWith(':')) continue; // Skip SSE comments/keep-alive
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              console.log('Received [DONE] signal'); // Add debugging
              return;
            }
            try {
              const chunk: ChatStreamResponse = JSON.parse(data);
              console.log('Received chunk:', chunk); // Add debugging
              onChunk(chunk);
            } catch (error) {
              console.error('Failed to parse stream chunk:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to send streaming message:', error);
      throw error;
    }
  },
};

export default chat;
