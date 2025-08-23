import { Button } from '@/components/ui/button';
import { InputStyles } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { PLAN_NAMES } from '@/config';
import promptsData from '@/data/prompts.json';
import { useCurrentPlan } from '@/hooks';
import { cn } from '@/lib/utils';
import { useChatbotStoreShallow } from '@/store/chatbot.store';
import { Check, ChevronsUpDown, Gem } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { memo } from 'preact/compat';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

// Memoized constants outside component to prevent recreation
const PROMPTS_MAP = new Map(promptsData.map(p => [p.name, p.prompt]));
const PROMPT_OPTIONS = [...PROMPTS_MAP.keys()];
const CUSTOM_PROMPT_OPTION = 'Custom prompt';

// Extracted component for prompt option item
const PromptOptionItem = memo(
  ({
    option,
    isSelected,
    onClick,
  }: {
    option: string;
    isSelected: boolean;
    onClick: (option: string) => void;
  }) => (
    <div
      className="flex h-11 cursor-pointer items-center justify-between rounded px-2 py-1.5 text-sm text-stone-900 transition-colors duration-200 hover:bg-stone-100"
      onClick={() => onClick(option)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(option);
        }
      }}
      aria-selected={isSelected}
    >
      {option}
      {isSelected && <Check className="size-4 text-stone-900" />}
    </div>
  )
);

// Extracted component for upgrade prompt
const UpgradePrompt = memo(({ onUpgrade }: { onUpgrade: () => void }) => (
  <div className="relative flex items-center justify-between">
    <div className="mb-1 flex h-11 items-center justify-between rounded px-2 py-1.5 text-sm text-stone-500 transition-colors duration-200">
      {CUSTOM_PROMPT_OPTION}
    </div>
    <Button variant="outline" onClick={onUpgrade}>
      <Gem className="size-4" />
      Upgrade now
    </Button>
    <span className="absolute -bottom-1 -left-2 block h-px w-[calc(100%+16px)] bg-stone-200"></span>
  </div>
));

// Extracted component for prompt selector
const PromptSelector = memo(
  ({
    promptPreset,
    options,
    isCustomPromptLocked,
    onPromptChange,
    onUpgrade,
  }: {
    promptPreset: string;
    options: string[];
    isCustomPromptLocked: boolean;
    onPromptChange: (value: string) => void;
    onUpgrade: () => void;
  }) => {
    const [open, setOpen] = useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={cn(InputStyles, 'flex h-11 cursor-pointer items-center justify-between')}
          aria-label="Select prompt preset"
        >
          {promptPreset}
          <ChevronsUpDown className="size-4 text-stone-500" />
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <ScrollArea className="h-[350px]">
            <div className="space-y-1 p-2">
              {isCustomPromptLocked && <UpgradePrompt onUpgrade={onUpgrade} />}
              {options.map(option => (
                <PromptOptionItem
                  key={option}
                  option={option}
                  isSelected={option === promptPreset}
                  onClick={value => {
                    onPromptChange(value);
                    setOpen(false);
                  }}
                />
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    );
  }
);

// Extracted component for instructions textarea
const InstructionsTextarea = memo(
  ({
    promptPreset,
    prompt,
    onInstructionChange,
    isDisabled,
  }: {
    promptPreset: string;
    prompt: string;
    onInstructionChange: (e: Event) => void;
    isDisabled: boolean;
  }) => {
    const textareaValue = useMemo(() => {
      if (promptPreset === CUSTOM_PROMPT_OPTION) {
        return prompt;
      }
      return PROMPTS_MAP.get(promptPreset) ?? '';
    }, [promptPreset, prompt]);

    return (
      <Textarea
        className="h-56 resize-none"
        value={textareaValue}
        disabled={isDisabled}
        onChange={onInstructionChange}
        aria-label="Chatbot instructions"
        placeholder="Enter custom instructions for your chatbot..."
      />
    );
  }
);

const Prompts = () => {
  const navigate = useNavigate();
  const { plan } = useCurrentPlan();

  const { promptPreset, prompt, setChatbot } = useChatbotStoreShallow(s => ({
    promptPreset: s.promptPreset,
    prompt: s.prompt,
    setChatbot: s.setChatbot,
  }));

  // Memoized handlers to prevent unnecessary re-renders
  const handlePromptChange = useCallback(
    (value: string) => {
      setChatbot({ promptPreset: value, prompt: '' });
    },
    [setChatbot]
  );

  const handleInstructionChange = useCallback(
    (e: Event) => {
      setChatbot({ prompt: (e.target as HTMLTextAreaElement).value });
    },
    [setChatbot]
  );

  const handleUpgrade = useCallback(() => {
    navigate('/subscription');
  }, [navigate]);

  // Memoized computed values
  const isCustomPromptLocked = useMemo(() => plan.title === PLAN_NAMES.FREE, [plan.title]);

  const options = useMemo(() => {
    if (isCustomPromptLocked) {
      return PROMPT_OPTIONS.filter(option => option !== CUSTOM_PROMPT_OPTION);
    }
    return PROMPT_OPTIONS;
  }, [isCustomPromptLocked]);

  const isCustomPromptDisabled = useMemo(
    () => promptPreset !== CUSTOM_PROMPT_OPTION,
    [promptPreset]
  );

  // Set default prompt on mount
  useEffect(() => {
    if (!promptPreset && !prompt) {
      const defaultOption = promptsData.find(p => p.default);
      if (defaultOption) {
        setChatbot({ promptPreset: defaultOption.name, prompt: '' });
      }
    }
  }, [promptPreset, prompt, setChatbot]);

  return (
    <>
      <div className="mb-6">
        <Label className="mb-2">Prompts</Label>
        <PromptSelector
          promptPreset={promptPreset}
          options={options}
          isCustomPromptLocked={isCustomPromptLocked}
          onPromptChange={handlePromptChange}
          onUpgrade={handleUpgrade}
        />
      </div>
      <div>
        <Label className="mb-2">Instructions</Label>
        <InstructionsTextarea
          promptPreset={promptPreset}
          prompt={prompt}
          onInstructionChange={handleInstructionChange}
          isDisabled={isCustomPromptDisabled}
        />
      </div>
    </>
  );
};

export default memo(Prompts);
