import type { IKnowledge } from '@/types/knowledge.type';
import api from './api';

type TKnowledgeSource = {
  chatbotId: string;
  metadata: Record<string, unknown>;
};

export type TWebsite = TKnowledgeSource;
export type TRawText = TKnowledgeSource;
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
  website: async (data: TWebsite) => {
    const { data: knowledge } = await api.post<IKnowledge>('/knowledge/website', data);
    return knowledge;
  },
  file: async (data: TFile) => {
    const { data: knowledge } = await api.post<IKnowledge>('/knowledge/file', data);
    return knowledge;
  },
  rawText: async (data: TRawText) => {
    const { data: knowledge } = await api.post<IKnowledge>('/knowledge/raw-text', data);
    return knowledge;
  },
};
