import { useEffect, useRef } from 'preact/hooks';
import { useConfigStoreShallow } from '../store';

const REQUIRED_CONFIG_KEYS = [
  'avatarIcon',
  'chatIcon',
  'accentColor',
  'backgroundColor',
  'removeBranding',
  'visibility',
  'rateLimitCount',
  'rateLimitInterval',
  'rateLimitMessage',
  'initialMessage',
  'conversationStarters',
  'collectLeads',
];

function isValidConfig(config: any): boolean {
  if (!config || typeof config !== 'object') return false;

  // Check for missing keys
  for (const key of REQUIRED_CONFIG_KEYS) {
    if (!(key in config)) return false;
  }

  // Type checks
  if (
    typeof config.avatarIcon !== 'string' ||
    typeof config.chatIcon !== 'string' ||
    typeof config.accentColor !== 'string' ||
    typeof config.backgroundColor !== 'string' ||
    typeof config.removeBranding !== 'boolean' ||
    (config.visibility !== 'public' && config.visibility !== 'private') ||
    typeof config.rateLimitCount !== 'number' ||
    typeof config.rateLimitInterval !== 'number' ||
    typeof config.rateLimitMessage !== 'string' ||
    typeof config.initialMessage !== 'string' ||
    !Array.isArray(config.conversationStarters) ||
    typeof config.collectLeads !== 'boolean'
  ) {
    return false;
  }

  // Optionally, check for extra keys and ignore them (robustness)
  return true;
}

export const useGetConfig = () => {
  const { setConfig } = useConfigStoreShallow(s => ({
    setConfig: s.setConfig,
  }));

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data;
      if (
        event?.data &&
        typeof event.data === 'object' &&
        type === 'heyway:config'
        // isValidConfig(event.data.config)
      ) {
        console.log('event.data.config', payload);
        setConfig(payload);
      }
    };

    window.addEventListener('message', handleMessage, { passive: true });

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
};
