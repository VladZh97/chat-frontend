import { Label } from '@/components/ui/label';
import Select from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'preact/hooks';

const OPTIONS = [
  {
    label: 'Prompt 1',
    value: 'prompt-1',
  },
];

const Prompts = () => {
  const [value, setValue] = useState<string>('');
  const currentValue = OPTIONS.find(option => option.value === value);
  return (
    <>
      {' '}
      <div className="mb-6">
        <Label className="mb-2">Prompts</Label>
        <Select<string> value={value} onValueChange={setValue}>
          <Select.Trigger>{currentValue?.label}</Select.Trigger>
          <Select.Content>
            {OPTIONS.map(option => (
              <Select.Option value={option.value} key={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select.Content>
        </Select>
      </div>
      <div>
        <Label className="mb-2">Instructions</Label>
        <Textarea className="h-56 resize-none" />
      </div>
    </>
  );
};

export default Prompts;
