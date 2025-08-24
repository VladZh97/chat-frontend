export const CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,
};

export const PLAN_NAMES = {
  FREE: 'Free',
  PRO: 'Pro',
  TEAM: 'Team',
} as const;

export const PLANS = {
  [PLAN_NAMES.FREE]: {
    title: 'Free',
    description: 'For personal use.',
    features: ['1 chatbot', '100 messages', 'Heyway branding'],
    limits: {
      maxChatbots: 1,
      maxMessages: 100,
      maxFileSize: CONFIG.MAX_FILE_SIZE / 2,
      maxMemory: 400,
    },
  },
  [PLAN_NAMES.PRO]: {
    title: 'Pro',
    description: 'For small businesses.',
    features: ['1 chatbot', '2,000 messages', 'Remove Heyway branding', 'Full customization'],
    limits: {
      maxChatbots: 1,
      maxMessages: 2000,
      maxFileSize: CONFIG.MAX_FILE_SIZE / 2,
      maxMemory: 30_000, // 30 MB
    },
  },
  [PLAN_NAMES.TEAM]: {
    title: 'Team',
    description: 'For large businesses.',
    features: [
      'Up to 3 chatbots',
      '10,000 messages',
      'Remove Heyway branding',
      'Full customization',
      'Priority support',
    ],
    limits: {
      maxChatbots: 3,
      maxMessages: 10000,
      maxFileSize: CONFIG.MAX_FILE_SIZE / 2,
      maxMemory: 50_000, // 50 MB
    },
  },
};
