import { memo, useRef, type Dispatch, type SetStateAction } from 'preact/compat';
import { useConfigStoreShallow } from '../store';
import { cn } from '@/lib/utils';
import { ArrowUp } from 'lucide-react';
import { EmojiPickerComponent } from './emoji-picker';
import { useTextOnAccent } from '@/hooks/use-accent-colors';

export const InputContainer = ({
  inputValue,
  setInputValue,
  handleSendMessage,
}: {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  handleSendMessage: (message: { role: 'user' | 'assistant'; content: string }) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { removeBranding } = useConfigStoreShallow(s => ({
    removeBranding: s.removeBranding,
  }));

  const onEmojiSelect = (emoji: string) => {
    if (inputRef.current) {
      setInputValue(prev => prev + emoji);
      inputRef.current.focus();
    }
  };

  const handleSubmit = () => {
    handleSendMessage({ role: 'user', content: inputValue });
  };

  return (
    <div
      className={cn(
        'flex h-14 items-center rounded-xl bg-stone-100 py-3 pr-3 pl-4',
        removeBranding && 'mb-2'
      )}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Ask me anything"
        className={cn(
          'grow border-none text-sm font-normal outline-none focus:outline-none focus-visible:outline-none',
          'text-stone-900 placeholder:text-stone-900/40'
        )}
        value={inputValue}
        onChange={e => {
          setInputValue((e.target as HTMLInputElement).value);
        }}
        onKeyPress={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <div className="ml-2 flex shrink-0 items-center gap-4">
        <EmojiPickerComponent onEmojiSelect={onEmojiSelect} />
        <SendButton handleSendMessage={handleSubmit} />
      </div>
    </div>
  );
};

const SendButton = memo(({ handleSendMessage }: { handleSendMessage: () => void }) => {
  const { accentColor } = useConfigStoreShallow(s => ({
    accentColor: s.accentColor,
  }));
  const textOnAccent = useTextOnAccent(accentColor);
  return (
    <span
      className="flex size-8 cursor-pointer items-center justify-center rounded-full"
      style={{
        backgroundColor: accentColor,
        color: textOnAccent.color,
      }}
      onClick={handleSendMessage}
    >
      <ArrowUp />
    </span>
  );
});
