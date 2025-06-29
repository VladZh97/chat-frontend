import { Label } from '@/components/ui/label';
import Select from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import promptsData from '@/data/prompts.json';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import { useCallback, useEffect } from 'preact/hooks';

const promptsMap = new Map(promptsData.map(p => [p.name, p.prompt]));
const promptOptions = [...promptsMap.keys()];

const Prompts = () => {
  const { promptOption, promptValue, setChatbot } = useChatbotStoreShallow(s => ({
    promptOption: s.promptOption,
    promptValue: s.promptValue,
    setChatbot: s.setChatbot,
  }));

  const handlePromptChange = useCallback(
    (value: string) => {
      setChatbot({
        promptOption: value,
        promptValue: promptsMap.get(value) ?? '',
      });
    },
    [setChatbot]
  );

  const handleInstructionChange = useCallback(
    (e: Event) => {
      setChatbot({ promptValue: (e.target as HTMLTextAreaElement).value });
    },
    [setChatbot]
  );

  useEffect(() => {
    if (!promptOption && !promptValue) {
      const defaultOption = promptsData.find(p => p.default);
      if (!defaultOption) return;
      setChatbot({ promptOption: defaultOption.name, promptValue: defaultOption.prompt });
    }
  }, [promptOption]);

  return (
    <>
      <div className="mb-6">
        <Label className="mb-2">Prompts</Label>
        <Select<string>
          value={promptOption}
          onValueChange={value => handlePromptChange(value as string)}
        >
          <Select.Trigger>{promptOption}</Select.Trigger>
          <Select.Content>
            {promptOptions.map(option => (
              <Select.Option value={option} key={option}>
                {option}
              </Select.Option>
            ))}
          </Select.Content>
        </Select>
      </div>
      <div>
        <Label className="mb-2">Instructions</Label>
        <Textarea
          className="h-56 resize-none"
          value={promptValue}
          onChange={handleInstructionChange}
        />
      </div>
    </>
  );
};

export default Prompts;
