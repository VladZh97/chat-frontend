import type { IKnowledge } from '@/types/knowledge.type';
import api from './api';

type TKnowledgeSource = {
  chatbotId: string;
  metadata: Record<string, unknown>;
};

export type TWebsite = TKnowledgeSource;
export type TText = TKnowledgeSource;
export type TFile = TKnowledgeSource;

export const knowledge = {
  list: async (chatbotId: string) => {
    const { data: knowledge } = await api.get<IKnowledge[]>(`/knowledge`, {
      params: {
        chatbotId,
      },
    });
    return knowledge;
  },
  tokensUsage: async (chatbotId: string) => {
    const { data: tokens } = await api.get<{ count: number }>(`/knowledge/tokens-usage`, {
      params: {
        chatbotId,
      },
    });
    return tokens;
  },
  website: async (data: TWebsite) => {
    const { data: knowledge } = await api.post<IKnowledge>('/knowledge/website', data);
    return knowledge;
  },
  file: async (data: TFile) => {
    const { data: knowledge } = await api.post<IKnowledge>('/knowledge/file', data);
    return knowledge;
  },
  text: async (data: TText) => {
    const { data: knowledge } = await api.post<IKnowledge>('/knowledge/text', data);
    return knowledge;
  },
};
