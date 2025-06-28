export interface IKnowledge {
  _id: string;
  name: string;
  accountId: string;
  chatbotId: string;
  userId: string;
  type: 'website' | 'file' | 'text';
  url: string;
  file: string;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
}
