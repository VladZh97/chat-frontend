export const CONFIG = {
  MAX_TOKENS: 100_000,
  MAX_FILE_SIZE: 5 * 1024 * 1024,
};

export const PLAN_NAMES = {
  BASIC: 'Basic',
};

export const PLANS = {
  BASIC: {
    name: PLAN_NAMES.BASIC,
    maxChatbots: 1,
    maxMessages: 1000,
    maxTokens: CONFIG.MAX_TOKENS,
    maxFileSize: CONFIG.MAX_FILE_SIZE / 2,
  },
};
