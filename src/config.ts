export const CONFIG = {
  MAX_TOKENS: 100_000,
  MAX_FILE_SIZE: 5 * 1024 * 1024,
};

export const PLAN_NAMES = {
  BASIC: 'Basic',
  PRO: 'Pro',
  TEAM: 'Team',
} as const;

export const PLANS = {
  FREE: {
    id: 'free',
    title: 'Free',
    description: 'For personal use.',
    price: 0,
    features: ['1 chatbot', '100 messages', 'Heyway branding'],
  },
  PRO: {
    id: 'pro',
    title: 'Pro',
    description: 'For small businesses.',
    price: 39,
    features: ['1 chatbot', '2,000 messages', 'Remove Heyway branding', 'Full customization'],
  },
  TEAM: {
    id: 'team',
    title: 'Team',
    description: 'For large businesses.',
    price: 79,
    features: [
      'Up to 3 chatbots',
      '10,000 messages',
      'Remove Heyway branding',
      'Full customization',
      'Priority support',
    ],
  },
};
