import type { IKnowledge } from '@/types/knowledge.type';
import api from './api';

type TKnowledgeSource = {
  chatbotId: string;
  metadata: Record<string, unknown>;
};

export type TPdf = {
  url: string;
} & TKnowledgeSource;

export type TText = {
  url: string;
} & TKnowledgeSource;

export type TRawText = TKnowledgeSource;
export type TWebsite = TKnowledgeSource;

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
  pdf: async (data: TPdf) => {
    const { data: knowledge } = await api.post<IKnowledge>('/knowledge/pdf', data);
    return knowledge;
  },
  text: async (data: TText) => {
    const { data: knowledge } = await api.post<IKnowledge>('/knowledge/text', data);
    return knowledge;
  },
  rawText: async (data: TRawText) => {
    const { data: knowledge } = await api.post<IKnowledge>('/knowledge/raw-text', data);
    return knowledge;
  },
};
