import type { IAccount } from './account.type';
import type { IChatbot } from './chatbot.type';

export type TMessage = {
  _id: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  accountId: IAccount['_id'];
  chatbotId: IChatbot['_id'];
  conversationId: string;
  sender: 'user' | 'bot';
  visitorId: string;
  messageQuality: number;
};
