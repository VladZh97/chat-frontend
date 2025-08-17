import { Label } from '@/components/ui/label';
import Select from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import promptsData from '@/data/prompts.json';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import { useCallback, useEffect } from 'preact/hooks';

const promptsMap = new Map(promptsData.map(p => [p.name, p.prompt]));
const promptOptions = [...promptsMap.keys()];

const Prompts = () => {
  const { promptPreset, prompt, setChatbot } = useChatbotStoreShallow(s => ({
    promptPreset: s.promptPreset,
    prompt: s.prompt,
    setChatbot: s.setChatbot,
  }));

  const handlePromptChange = useCallback(
    (value: string) => {
      setChatbot({
        promptPreset: value,
        prompt: promptsMap.get(value) ?? '',
      });
    },
    [setChatbot]
  );

  const handleInstructionChange = useCallback(
    (e: Event) => {
      setChatbot({ prompt: (e.target as HTMLTextAreaElement).value });
    },
    [setChatbot]
  );

  useEffect(() => {
    if (!promptPreset && !prompt) {
      const defaultOption = promptsData.find(p => p.default);
      if (!defaultOption) return;
      setChatbot({ promptPreset: defaultOption.name, prompt: defaultOption.prompt });
    }
  }, [promptPreset, prompt, setChatbot]);

  return (
    <>
      <div className="mb-6">
        <Label className="mb-2">Prompts</Label>
        <Select<string>
          value={promptPreset}
          onValueChange={value => handlePromptChange(value as string)}
        >
          <Select.Trigger>{promptPreset}</Select.Trigger>
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
        <Textarea className="h-56 resize-none" value={prompt} onChange={handleInstructionChange} />
      </div>
    </>
  );
};

export default Prompts;
