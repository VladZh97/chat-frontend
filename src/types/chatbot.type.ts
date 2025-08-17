export interface IChatbot {
  _id: string;
  name: string;
  publicName: string;
  accountId: string;
  avatarIcon: string;
  chatIcon: string;
  accentColor: string;
  backgroundColor: string;
  removeBranding: boolean;
  visibility: 'public' | 'private';
  initialMessage: string;
  conversationStarters: { id: string; value: string }[];
  promptPreset: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
  collectLeads: boolean;
}
