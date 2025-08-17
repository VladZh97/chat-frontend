import { Label } from '@/components/ui/label';
import Select from '@/components/ui/select';
import { useMemo } from 'preact/hooks';
import { VISIBILITY_OPTIONS } from '../constants';
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
    </div>
  );
};

export default RateLimiting;
