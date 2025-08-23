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

export const SUBSCRIPTIONS = [
  {
    title: PLAN_NAMES.FREE,
    period: 'monthly',
    price: 0,
  },
  {
    title: PLAN_NAMES.FREE,
    period: 'yearly',
    price: 0,
  },
  {
    title: PLAN_NAMES.PRO,
    period: 'monthly',
    price: 39,
    id: 'price_1RzOnuH5z64scL5B5DzxHOeI',
  },
  {
    title: PLAN_NAMES.PRO,
    period: 'yearly',
    price: 396,
    id: 'price_1RzOnuH5z64scL5BAGVAbwZ6',
  },
  {
    title: PLAN_NAMES.TEAM,
    period: 'monthly',
    price: 79,
    id: 'price_1RzOoKH5z64scL5Bsn7WuQQI',
  },
  {
    title: PLAN_NAMES.TEAM,
    period: 'yearly',
    price: 792,
    id: 'price_1RzOoqH5z64scL5B2DMRIQez',
  },
];
