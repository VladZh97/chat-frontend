export const CONFIG = {
  MAX_TOKENS: 100_000,
  MAX_FILE_SIZE: 5 * 1024 * 1024,
};

export const PLAN_NAMES = {
  FREE: 'Free',
  PRO: 'Pro',
  TEAM: 'Team',
} as const;

export const PLANS = {
  [PLAN_NAMES.FREE]: {
    id: 'free',
    title: 'Free',
    description: 'For personal use.',
    price: 0,
    features: ['1 chatbot', '100 messages', 'Heyway branding'],
  },
  [PLAN_NAMES.PRO]: {
    id: 'pro',
    title: 'Pro',
    description: 'For small businesses.',
    price: 39,
    features: ['1 chatbot', '2,000 messages', 'Remove Heyway branding', 'Full customization'],
  },
  [PLAN_NAMES.TEAM]: {
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

export const PLAN_LIMITS = {
  [PLAN_NAMES.FREE]: {
    maxChatbots: 1,
    maxMessages: 100,
    maxFileSize: CONFIG.MAX_FILE_SIZE / 2,
  },
  [PLAN_NAMES.PRO]: {
    maxChatbots: 1,
    maxMessages: 2000,
    maxFileSize: CONFIG.MAX_FILE_SIZE / 2,
  },
  [PLAN_NAMES.TEAM]: {
    maxChatbots: 3,
    maxMessages: 10000,
    maxFileSize: CONFIG.MAX_FILE_SIZE / 2,
  },
};

export const PAYMENT_LINKS = {
  [PLAN_NAMES.PRO]: {
    monthly: 'https://buy.stripe.com/test_3cIcN71Bn3Oeb8a3qjdjO00',
    yearly: 'https://buy.stripe.com/test_7sYbJ34NzgB03FIgd5djO01',
  },
  [PLAN_NAMES.TEAM]: {
    monthly: 'https://buy.stripe.com/test_6oUcN76VHacCb8abWPdjO02',
    yearly: 'https://buy.stripe.com/test_28EeVfa7T70q3FI6CvdjO03',
  },
};
