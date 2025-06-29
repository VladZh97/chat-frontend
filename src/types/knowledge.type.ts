import type { IAccount } from './account.type';
import type { IChatbot } from './chatbot.type';
import type { IUser } from './user.type';

export interface IKnowledge {
  _id: string;
  name: string;
  accountId: IAccount['_id'];
  chatbotId: IChatbot['_id'];
  userId: IUser['_id'];
  type: 'website' | 'file' | 'text';
  url: string;
  file: string;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
}
