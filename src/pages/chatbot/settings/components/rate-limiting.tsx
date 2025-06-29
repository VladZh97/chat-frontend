import { Label } from '@/components/ui/label';
import Select from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMemo } from 'preact/hooks';
import { MESSAGES_OPTIONS, TIME_OPTIONS, VISIBILITY_OPTIONS } from '../constants';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import type { IChatbot } from '@/types/chatbot.type';

const RateLimiting = () => {
  const { visibility, setChatbot } = useChatbotStoreShallow(s => ({
    visibility: s.visibility,
    setChatbot: s.setChatbot,
  }));
  const current = useMemo(
    () => VISIBILITY_OPTIONS.find(option => option.value === visibility),
    [visibility]
  );
  return (
    <div>
      <div className="mb-6">
        <Label className="mb-2">Visibility</Label>
        <Select<string>
          value={visibility}
          onValueChange={value => setChatbot({ visibility: value as IChatbot['visibility'] })}
        >
          <Select.Trigger>{current?.label}</Select.Trigger>
          <Select.Content>
            {VISIBILITY_OPTIONS.map(option => (
              <Select.Option value={option.value} key={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select.Content>
        </Select>
      </div>
      <RateLimits />
      <LimitMessage />
    </div>
  );
};

export default RateLimiting;

const RateLimits = () => {
  const { messages, time, setChatbot } = useChatbotStoreShallow(s => ({
    messages: s.rateLimitCount,
    time: s.rateLimitInterval,
    setChatbot: s.setChatbot,
  }));
  const currentMessages = useMemo(
    () => MESSAGES_OPTIONS.find(option => option.value === messages),
    [messages]
  );
  const currentTime = useMemo(() => TIME_OPTIONS.find(option => option.value === time), [time]);
  return (
    <div className="mb-6">
      <Label className="mb-2">Rate limits</Label>
      <div className="grid grid-cols-2 gap-2">
        <Select<number>
          value={messages}
          onValueChange={value =>
            setChatbot({ rateLimitCount: value as IChatbot['rateLimitCount'] })
          }
        >
          <Select.Trigger>{currentMessages?.label}</Select.Trigger>
          <Select.Content>
            {MESSAGES_OPTIONS.map(option => (
              <Select.Option value={option.value} key={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select.Content>
        </Select>
        <Select<number>
          value={time}
          onValueChange={value =>
            setChatbot({ rateLimitInterval: value as IChatbot['rateLimitInterval'] })
          }
        >
          <Select.Trigger>{currentTime?.label}</Select.Trigger>
          <Select.Content>
            {TIME_OPTIONS.map(option => (
              <Select.Option value={option.value} key={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select.Content>
        </Select>
      </div>
    </div>
  );
};

const LimitMessage = () => {
  const { rateLimitMessage, setChatbot } = useChatbotStoreShallow(s => ({
    rateLimitMessage: s.rateLimitMessage,
    setChatbot: s.setChatbot,
  }));
  return (
    <div>
      <Label className="mb-2">Limit messages</Label>
      <Textarea
        className="h-[88px] resize-none"
        placeholder="Too many messages. Please wait a moment."
        value={rateLimitMessage}
        onChange={e => setChatbot({ rateLimitMessage: (e.target as HTMLTextAreaElement).value })}
      />
    </div>
  );
};
