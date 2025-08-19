import { v4 as uuidv4 } from 'uuid';

export interface IWidgetMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface IWidgetSession {
  visitorId: string;
  conversationId: string;
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

const STORAGE_KEYS = {
  VISITOR_ID: 'heyway_visitor_id',
  ACCESS_TOKEN: 'heyway_access_token',
  CONVERSATION_PREFIX: 'heyway_conversation_',
  ACTIVE_CONVERSATION: 'heyway_active_conversation_',
  LEAD_COLLECTED: 'heyway_lead_collected_',
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
    // First try to get the active conversation
    const activeConversationId = this.getActiveConversationId(chatbotId, visitorId);
    if (activeConversationId) {
      const activeSession = this.getConversationById(chatbotId, visitorId, activeConversationId);
      if (activeSession) {
        return activeSession;
      }
    }

    // Fallback: get the most recent conversation for this chatbot-visitor
    const conversations = this.getAllConversations(visitorId);
    const latestConversation = conversations.find(c => c.chatbotId === chatbotId);

    if (latestConversation) {
      // Set this as the active conversation since we don't have one
      this.setActiveConversationId(chatbotId, visitorId, latestConversation.conversationId);
      return this.getConversationById(chatbotId, visitorId, latestConversation.conversationId);
    }

    return null;
  }

  static saveConversation(chatbotId: string, session: IWidgetSession): void {
    try {
      const key = `${STORAGE_KEYS.CONVERSATION_PREFIX}${chatbotId}_${session.visitorId}_${session.conversationId}`;

      // Limit messages to prevent storage bloat
      const limitedSession = {
        ...session,
        messages: session.messages.slice(-MAX_MESSAGES_PER_CONVERSATION),
        lastActivity: Date.now(),
      };

      localStorage.setItem(key, JSON.stringify(limitedSession));

      // Set this as the active conversation
      this.setActiveConversationId(chatbotId, session.visitorId, session.conversationId);

      this.cleanupOldConversations();
    } catch {
      // Silent fail for storage issues
    }
  }

  static clearConversation(chatbotId: string, visitorId: string, conversationId?: string): void {
    try {
      if (conversationId) {
        // Clear specific conversation
        const key = `${STORAGE_KEYS.CONVERSATION_PREFIX}${chatbotId}_${visitorId}_${conversationId}`;
        localStorage.removeItem(key);
      } else {
        // Clear all conversations for this chatbot-visitor (for backward compatibility)
        const keys = Object.keys(localStorage);
        const conversationKeys = keys.filter(key =>
          key.startsWith(`${STORAGE_KEYS.CONVERSATION_PREFIX}${chatbotId}_${visitorId}`)
        );
        conversationKeys.forEach(key => localStorage.removeItem(key));
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

  static clearAllData(): void {
    try {
      // Clear visitor ID
      localStorage.removeItem(STORAGE_KEYS.VISITOR_ID);

      // Clear access token
      sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);

      // Clear all conversations and active conversation IDs
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (
          key.startsWith(STORAGE_KEYS.CONVERSATION_PREFIX) ||
          key.startsWith(STORAGE_KEYS.ACTIVE_CONVERSATION) ||
          key.startsWith(STORAGE_KEYS.LEAD_COLLECTED)
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
      const keys = Object.keys(localStorage);
      const conversationKeys = keys.filter(
        key => key.startsWith(STORAGE_KEYS.CONVERSATION_PREFIX) && key.includes(`_${visitorId}_`)
      );

      const conversations: IConversationPreview[] = [];

      conversationKeys.forEach(key => {
        try {
          const session: IWidgetSession = JSON.parse(localStorage.getItem(key) || '{}');

          // Check if session is expired
          if (Date.now() - session.lastActivity > SESSION_EXPIRY) {
            localStorage.removeItem(key);
            return;
          }

          if (session.messages.length > 0) {
            const lastMessage = session.messages[session.messages.length - 1];
            // Parse key: "heyway_conversation_chatbotId_visitorId_conversationId"
            const keyWithoutPrefix = key.replace(STORAGE_KEYS.CONVERSATION_PREFIX, '');
            const lastUnderscoreIndex = keyWithoutPrefix.lastIndexOf('_');
            const secondLastUnderscoreIndex = keyWithoutPrefix.lastIndexOf(
              '_',
              lastUnderscoreIndex - 1
            );
            const chatbotId = keyWithoutPrefix.substring(0, secondLastUnderscoreIndex);

            conversations.push({
              chatbotId,
              conversationId: session.conversationId,
              lastMessage: lastMessage.content,
              lastMessageRole: lastMessage.role,
              lastActivity: session.lastActivity,
              messageCount: session.messages.length,
            });
          }
        } catch {
          // Remove corrupted conversation data
          localStorage.removeItem(key);
        }
      });

      // Sort by last activity (newest first)
      return conversations.sort((a, b) => b.lastActivity - a.lastActivity);
    } catch {
      return [];
    }
  }

  static getConversationById(
    chatbotId: string,
    visitorId: string,
    conversationId: string
  ): IWidgetSession | null {
    try {
      const key = `${STORAGE_KEYS.CONVERSATION_PREFIX}${chatbotId}_${visitorId}_${conversationId}`;
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const session: IWidgetSession = JSON.parse(stored);

      // Check if session is expired
      if (Date.now() - session.lastActivity > SESSION_EXPIRY) {
        localStorage.removeItem(key);
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

  private static cleanupOldConversations(): void {
    try {
      const keys = Object.keys(localStorage);
      const conversationKeys = keys
        .filter(key => key.startsWith(STORAGE_KEYS.CONVERSATION_PREFIX))
        .map(key => {
          try {
            const session: IWidgetSession = JSON.parse(localStorage.getItem(key) || '{}');
            return { key, lastActivity: session.lastActivity || 0 };
          } catch {
            return { key, lastActivity: 0 };
          }
        })
        .sort((a, b) => b.lastActivity - a.lastActivity);

      // Remove expired conversations
      const now = Date.now();
      conversationKeys.forEach(({ key, lastActivity }) => {
        if (now - lastActivity > SESSION_EXPIRY) {
          localStorage.removeItem(key);
        }
      });

      // Keep only the most recent conversations if we exceed the limit
      const activeConversations = conversationKeys.filter(
        ({ lastActivity }) => now - lastActivity <= SESSION_EXPIRY
      );

      if (activeConversations.length > MAX_CONVERSATIONS) {
        const toRemove = activeConversations.slice(MAX_CONVERSATIONS);
        toRemove.forEach(({ key }) => localStorage.removeItem(key));
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
}
