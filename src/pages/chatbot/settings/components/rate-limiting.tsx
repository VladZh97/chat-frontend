import { Label } from '@/components/ui/label';
import Select from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMemo, useState } from 'preact/hooks';
import { MESSAGES_OPTIONS, TIME_OPTIONS, VISIBILITY_OPTIONS } from '../constants';

const RateLimiting = () => {
  const [selected, setSelected] = useState<string>('public');
  const current = useMemo(
    () => VISIBILITY_OPTIONS.find(option => option.value === selected),
    [selected]
  );
  return (
    <div>
      <div className="mb-6">
        <Label className="mb-2">Visibility</Label>
        <Select<string> value={selected} onValueChange={setSelected}>
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
  const [messages, setMessages] = useState<number>(10);
  const [time, setTime] = useState<number>(60);
  const currentMessages = useMemo(
    () => MESSAGES_OPTIONS.find(option => option.value === messages),
    [messages]
  );
  const currentTime = useMemo(() => TIME_OPTIONS.find(option => option.value === time), [time]);
  return (
    <div className="mb-6">
      <Label className="mb-2">Rate limits</Label>
      <div className="grid grid-cols-2 gap-2">
        <Select<number> value={messages} onValueChange={setMessages}>
          <Select.Trigger>{currentMessages?.label}</Select.Trigger>
          <Select.Content>
            {MESSAGES_OPTIONS.map(option => (
              <Select.Option value={option.value} key={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select.Content>
        </Select>
        <Select<number> value={time} onValueChange={setTime}>
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
  return (
    <div>
      <Label className="mb-2">Limit messages</Label>
      <Textarea className="h-[88px] resize-none" placeholder="Enter the limit messages" />
    </div>
  );
};
