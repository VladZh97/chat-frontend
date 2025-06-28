export interface IChatbot {
  _id: string;
  name: string;
  avatarIcon: string;
  chatIcon: string;
  accentColor: string;
  backgroundColor: string;
  removeBranding: boolean;
  visibility: 'public' | 'private';
  rateLimitCount: number;
  rateLimitInterval: number;
  rateLimitMessage: string;
  initialMessage: string;
  conversationStarters: string[];
  prompt: string;
  instructions: string;
  createdAt: string;
  updatedAt: string;
}
