import type { TMessage } from '@/types/message.type';

export type TConversation = {
  conversationId: string;
  visitorId: string;
  totalMessages: number;
  lastMessageTime: Date;
  firstMessage: TMessage;
  lastMessage: TMessage;
  date: Date;
  visitorEmail?: string;
};
