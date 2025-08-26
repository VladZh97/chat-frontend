import { v4 as uuidv4 } from 'uuid';

export interface IWidgetMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  messageId?: string;
  rating?: number;
  error?: {
    message: string;
    code?: string;
    canRetry?: boolean;
    originalMessage?: string;
  };
}

export interface IWidgetSession {
  visitorId: string;
  conversationId: string;
  chatbotId?: string;
  messages: IWidgetMessage[];
  lastActivity: number;
}

export interface IConversationPreview {
  chatbotId: string;
  conversationId: string;
  lastMessage: string;
  lastMessageRole: 'user' | 'assistant';
  lastActivity: number;
  messageCount: number;
}

export interface IConversationsStore {
  visitorId: string;
  conversations: IWidgetSession[];
}

const STORAGE_KEYS = {
  VISITOR_ID: 'heyway_visitor_id',
  ACCESS_TOKEN: 'heyway_access_token',
  CONVERSATION_PREFIX: 'heyway_conversation_',
  CONVERSATIONS_ARRAY: 'heyway_conversations',
  ACTIVE_CONVERSATION: 'heyway_active_conversation_',
  LEAD_COLLECTED: 'heyway_lead_collected_',
  NEW_CHAT_FLAG: 'heyway_new_chat_flag_',
} as const;

const MAX_CONVERSATIONS = 10;
const MAX_MESSAGES_PER_CONVERSATION = 100;
const SESSION_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

export class WidgetStorage {
  static generateVisitorId(): string {
    return uuidv4();
  }

  static getVisitorId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
    } catch {
      return null;
    }
  }

  static setVisitorId(visitorId: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VISITOR_ID, visitorId);
    } catch {
      // Silent fail for storage issues
    }
  }

  private static getConversationsStore(visitorId: string): IConversationsStore {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS_ARRAY);
      if (stored) {
        const stores: IConversationsStore[] = JSON.parse(stored);
        return (
          stores.find(store => store.visitorId === visitorId) || { visitorId, conversations: [] }
        );
      }
    } catch {
      // Silent fail
    }
    return { visitorId, conversations: [] };
  }

  private static saveConversationsStore(store: IConversationsStore): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS_ARRAY);
      let stores: IConversationsStore[] = [];

      if (stored) {
        try {
          stores = JSON.parse(stored);
        } catch {
          stores = [];
        }
      }

      const existingIndex = stores.findIndex(s => s.visitorId === store.visitorId);
      if (existingIndex >= 0) {
        stores[existingIndex] = store;
      } else {
        stores.push(store);
      }

      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS_ARRAY, JSON.stringify(stores));
    } catch {
      // Silent fail for storage issues
    }
  }

  private static migrateToArrayFormat(visitorId: string): void {
    try {
      // Check if migration is needed
      const store = this.getConversationsStore(visitorId);
      if (store.conversations.length > 0) {
        return; // Already migrated
      }

      // Get all old format conversations
      const keys = Object.keys(localStorage);
      const conversationKeys = keys.filter(
        key => key.startsWith(STORAGE_KEYS.CONVERSATION_PREFIX) && key.includes(`_${visitorId}_`)
      );

      const conversations: IWidgetSession[] = [];

      conversationKeys.forEach(key => {
        try {
          const session: IWidgetSession = JSON.parse(localStorage.getItem(key) || '{}');

          // Check if session is valid and not expired
          if (session.messages && Date.now() - session.lastActivity <= SESSION_EXPIRY) {
            conversations.push(session);
          }

          // Remove old format key
          localStorage.removeItem(key);
        } catch {
          // Remove corrupted data
          localStorage.removeItem(key);
        }
      });

      // Sort by lastActivity (newest first) and limit to MAX_CONVERSATIONS
      const sortedConversations = conversations
        .sort((a, b) => b.lastActivity - a.lastActivity)
        .slice(0, MAX_CONVERSATIONS);

      // Save to new format
      if (sortedConversations.length > 0) {
        const newStore: IConversationsStore = { visitorId, conversations: sortedConversations };
        this.saveConversationsStore(newStore);
      }
    } catch {
      // Silent fail
    }
  }

  static getAccessToken(): string | null {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch {
      return null;
    }
  }

  static setAccessToken(token: string): void {
    try {
      sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    } catch {
      // Silent fail for storage issues
    }
  }

  static clearAccessToken(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch {
      // Silent fail
    }
  }

  static getOrCreateVisitorId(): string {
    let visitorId = this.getVisitorId();
    if (!visitorId) {
      visitorId = this.generateVisitorId();
      this.setVisitorId(visitorId);
    }
    return visitorId;
  }

  static getConversation(chatbotId: string, visitorId: string): IWidgetSession | null {
    // Ensure migration is complete
    this.migrateToArrayFormat(visitorId);

    // First try to get the active conversation
    const activeConversationId = this.getActiveConversationId(chatbotId, visitorId);
    if (activeConversationId) {
      const activeSession = this.getConversationById(chatbotId, visitorId, activeConversationId);
      if (activeSession) {
        return activeSession;
      }
    }

    // Fallback: get the most recent conversation for this chatbot from the store
    const store = this.getConversationsStore(visitorId);
    const latestConversation = store.conversations.find(conv => conv.chatbotId === chatbotId);

    if (latestConversation) {
      // Set this as the active conversation since we don't have one
      this.setActiveConversationId(chatbotId, visitorId, latestConversation.conversationId);
      return latestConversation;
    }

    return null;
  }

  static saveConversation(chatbotId: string, session: IWidgetSession): void {
    try {
      // Ensure migration is complete
      this.migrateToArrayFormat(session.visitorId);

      // Limit messages to prevent storage bloat
      const limitedSession = {
        ...session,
        chatbotId,
        messages: session.messages.slice(-MAX_MESSAGES_PER_CONVERSATION),
        lastActivity: Date.now(),
      };

      // Get current conversations store
      const store = this.getConversationsStore(session.visitorId);

      // Find existing conversation
      const existingIndex = store.conversations.findIndex(
        conv => conv.conversationId === session.conversationId
      );

      if (existingIndex >= 0) {
        // Update existing conversation
        store.conversations[existingIndex] = limitedSession;
      } else {
        // Add new conversation
        store.conversations.unshift(limitedSession); // Add to beginning (newest first)
      }

      // Sort by lastActivity (newest first)
      store.conversations.sort((a, b) => b.lastActivity - a.lastActivity);

      // Implement FIFO: Remove oldest conversations if we exceed the limit
      if (store.conversations.length > MAX_CONVERSATIONS) {
        store.conversations = store.conversations.slice(0, MAX_CONVERSATIONS);
      }

      // Save the updated store
      this.saveConversationsStore(store);

      // Set this as the active conversation
      this.setActiveConversationId(chatbotId, session.visitorId, session.conversationId);

      // Periodically cleanup expired conversations
      if (Math.random() < 0.1) {
        // 10% chance to run cleanup
        this.cleanupExpiredConversations();
      }
    } catch {
      // Silent fail for storage issues
    }
  }

  static clearConversation(chatbotId: string, visitorId: string, conversationId?: string): void {
    try {
      // Ensure migration is complete
      this.migrateToArrayFormat(visitorId);

      const store = this.getConversationsStore(visitorId);

      if (conversationId) {
        // Clear specific conversation
        const updatedConversations = store.conversations.filter(
          conv => conv.conversationId !== conversationId
        );
        const updatedStore = { ...store, conversations: updatedConversations };
        this.saveConversationsStore(updatedStore);
      } else {
        // Clear all conversations for this chatbot-visitor
        const updatedConversations = store.conversations.filter(
          conv => conv.chatbotId !== chatbotId
        );
        const updatedStore = { ...store, conversations: updatedConversations };
        this.saveConversationsStore(updatedStore);
      }
    } catch {
      // Silent fail
    }
  }

  static addMessage(
    chatbotId: string,
    visitorId: string,
    message: IWidgetMessage,
    conversationId?: string
  ): void {
    // Don't save empty messages
    if (!message.content || !message.content.trim()) return;

    let session: IWidgetSession | null = null;

    if (conversationId) {
      session = this.getConversationById(chatbotId, visitorId, conversationId);
    }

    if (!session) {
      session = {
        visitorId,
        conversationId: conversationId || uuidv4(),
        messages: [],
        lastActivity: Date.now(),
      };
    }

    session.messages.push(message);
    this.saveConversation(chatbotId, session);
  }

  static cleanupEmptyMessages(visitorId: string): void {
    try {
      const store = this.getConversationsStore(visitorId);
      let hasChanges = false;

      const cleanedConversations = store.conversations
        .map(conversation => {
          const originalLength = conversation.messages.length;
          // Filter out empty messages
          conversation.messages = conversation.messages.filter(
            msg => msg.content && msg.content.trim()
          );

          if (conversation.messages.length !== originalLength) {
            hasChanges = true;
          }

          return conversation;
        })
        .filter(conversation => conversation.messages.length > 0); // Remove conversations with no valid messages

      if (hasChanges || cleanedConversations.length !== store.conversations.length) {
        const updatedStore = { ...store, conversations: cleanedConversations };
        this.saveConversationsStore(updatedStore);
        console.log(`Cleaned up empty messages for visitor ${visitorId}`);
      }
    } catch (error) {
      console.error('Error cleaning up empty messages:', error);
    }
  }

  static clearAllData(): void {
    try {
      // Clear visitor ID
      localStorage.removeItem(STORAGE_KEYS.VISITOR_ID);

      // Clear access token
      sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);

      // Clear conversations array
      localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS_ARRAY);

      // Clear all old format conversations and other data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (
          key.startsWith(STORAGE_KEYS.CONVERSATION_PREFIX) ||
          key.startsWith(STORAGE_KEYS.ACTIVE_CONVERSATION) ||
          key.startsWith(STORAGE_KEYS.LEAD_COLLECTED) ||
          key.startsWith(STORAGE_KEYS.NEW_CHAT_FLAG)
        ) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // Silent fail
    }
  }

  static getAllConversations(visitorId: string): IConversationPreview[] {
    try {
      // Ensure migration is complete
      this.migrateToArrayFormat(visitorId);

      // Clean up any empty messages
      this.cleanupEmptyMessages(visitorId);

      const store = this.getConversationsStore(visitorId);
      const conversations: IConversationPreview[] = [];

      store.conversations.forEach(session => {
        try {
          // Check if session is expired
          if (Date.now() - session.lastActivity > SESSION_EXPIRY) {
            return; // Skip expired sessions
          }

          if (session.messages.length > 0) {
            // Find the last non-empty message for display
            let lastValidMessage = null;
            for (let i = session.messages.length - 1; i >= 0; i--) {
              const msg = session.messages[i];
              if (msg.content && msg.content.trim()) {
                lastValidMessage = msg;
                break;
              }
            }

            // Only include conversations with valid messages
            if (lastValidMessage) {
              conversations.push({
                chatbotId: session.chatbotId || '',
                conversationId: session.conversationId,
                lastMessage: lastValidMessage.content,
                lastMessageRole: lastValidMessage.role,
                lastActivity: session.lastActivity,
                messageCount: session.messages.length,
              });
            }
          }
        } catch {
          // Skip corrupted conversation data
        }
      });

      // Filter out expired sessions and update store
      const validConversations = store.conversations.filter(
        session => Date.now() - session.lastActivity <= SESSION_EXPIRY
      );

      if (validConversations.length !== store.conversations.length) {
        const updatedStore = { ...store, conversations: validConversations };
        this.saveConversationsStore(updatedStore);
      }

      // Sort by last activity (newest first)
      return conversations.sort((a, b) => b.lastActivity - a.lastActivity);
    } catch {
      return [];
    }
  }

  static getConversationById(
    _chatbotId: string,
    visitorId: string,
    conversationId: string
  ): IWidgetSession | null {
    try {
      // Ensure migration is complete
      this.migrateToArrayFormat(visitorId);

      const store = this.getConversationsStore(visitorId);
      const session = store.conversations.find(conv => conv.conversationId === conversationId);

      if (!session) return null;

      // Check if session is expired
      if (Date.now() - session.lastActivity > SESSION_EXPIRY) {
        // Remove expired session from array
        const updatedConversations = store.conversations.filter(
          conv => conv.conversationId !== conversationId
        );
        const updatedStore = { ...store, conversations: updatedConversations };
        this.saveConversationsStore(updatedStore);
        return null;
      }

      return session;
    } catch {
      return null;
    }
  }

  static deleteConversation(chatbotId: string, visitorId: string): boolean {
    try {
      this.clearConversation(chatbotId, visitorId);
      return true;
    } catch {
      return false;
    }
  }

  private static cleanupExpiredConversations(): void {
    try {
      // Clean up expired conversations from all visitor stores
      const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS_ARRAY);
      if (!stored) return;

      const stores: IConversationsStore[] = JSON.parse(stored);
      const now = Date.now();
      let hasChanges = false;

      const updatedStores = stores
        .map(store => {
          const validConversations = store.conversations.filter(
            conv => now - conv.lastActivity <= SESSION_EXPIRY
          );

          if (validConversations.length !== store.conversations.length) {
            hasChanges = true;
            return { ...store, conversations: validConversations };
          }

          return store;
        })
        .filter(store => store.conversations.length > 0); // Remove empty stores

      if (hasChanges || updatedStores.length !== stores.length) {
        localStorage.setItem(STORAGE_KEYS.CONVERSATIONS_ARRAY, JSON.stringify(updatedStores));
      }
    } catch {
      // Silent fail
    }
  }

  static getActiveConversationId(chatbotId: string, visitorId: string): string | null {
    try {
      const key = `${STORAGE_KEYS.ACTIVE_CONVERSATION}${chatbotId}_${visitorId}`;
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  static setActiveConversationId(
    chatbotId: string,
    visitorId: string,
    conversationId: string
  ): void {
    try {
      const key = `${STORAGE_KEYS.ACTIVE_CONVERSATION}${chatbotId}_${visitorId}`;
      localStorage.setItem(key, conversationId);
    } catch {
      // Silent fail
    }
  }

  static clearActiveConversationId(chatbotId: string, visitorId: string): void {
    try {
      const key = `${STORAGE_KEYS.ACTIVE_CONVERSATION}${chatbotId}_${visitorId}`;
      localStorage.removeItem(key);
    } catch {
      // Silent fail
    }
  }

  static isLeadCollected(chatbotId: string, visitorId: string): boolean {
    try {
      const key = `${STORAGE_KEYS.LEAD_COLLECTED}${chatbotId}_${visitorId}`;
      return localStorage.getItem(key) === 'true';
    } catch {
      return false;
    }
  }

  static setLeadCollected(chatbotId: string, visitorId: string): void {
    try {
      const key = `${STORAGE_KEYS.LEAD_COLLECTED}${chatbotId}_${visitorId}`;
      localStorage.setItem(key, 'true');
    } catch {
      // Silent fail
    }
  }

  static clearLeadCollected(chatbotId: string, visitorId: string): void {
    try {
      const key = `${STORAGE_KEYS.LEAD_COLLECTED}${chatbotId}_${visitorId}`;
      localStorage.removeItem(key);
    } catch {
      // Silent fail
    }
  }

  static setNewChatFlag(chatbotId: string, visitorId: string): void {
    try {
      const key = `${STORAGE_KEYS.NEW_CHAT_FLAG}${chatbotId}_${visitorId}`;
      sessionStorage.setItem(key, 'true');
    } catch {
      // Silent fail
    }
  }

  static hasNewChatFlag(chatbotId: string, visitorId: string): boolean {
    try {
      const key = `${STORAGE_KEYS.NEW_CHAT_FLAG}${chatbotId}_${visitorId}`;
      return sessionStorage.getItem(key) === 'true';
    } catch {
      return false;
    }
  }

  static clearNewChatFlag(chatbotId: string, visitorId: string): void {
    try {
      const key = `${STORAGE_KEYS.NEW_CHAT_FLAG}${chatbotId}_${visitorId}`;
      sessionStorage.removeItem(key);
    } catch {
      // Silent fail
    }
  }

  static startNewChat(chatbotId: string, visitorId: string, newConversationId: string): void {
    // The current active conversation should remain in the conversations array
    // We just need to set the new conversation as active

    // Set the new chat flag
    this.setNewChatFlag(chatbotId, visitorId);

    // Set the new active conversation
    this.setActiveConversationId(chatbotId, visitorId, newConversationId);
  }

  static updateMessageRating(
    chatbotId: string,
    visitorId: string,
    conversationId: string,
    messageId: string,
    rating: number
  ): void {
    try {
      const session = this.getConversationById(chatbotId, visitorId, conversationId);
      if (!session) return;

      // Find and update the message with the rating
      const messageIndex = session.messages.findIndex(msg => msg.messageId === messageId);
      if (messageIndex >= 0) {
        session.messages[messageIndex].rating = rating;
        this.saveConversation(chatbotId, session);
      }
    } catch {
      // Silent fail
    }
  }
}
