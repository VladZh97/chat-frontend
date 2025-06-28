import type { IKnowledge } from '@/types/knowledge.type';
import api from './api';

type TPdf = {
  url: string;
  chatbotId: string;
  metadata: Record<string, unknown>;
};

type TText = {
  url: string;
  chatbotId: string;
  metadata: Record<string, unknown>;
};

type TRawText = {
  text: string;
  chatbotId: string;
  metadata: Record<string, unknown>;
};

type TWebsite = {
  url: string;
  chatbotId: string;
  metadata: Record<string, unknown>;
};

export const knowledge = {
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
