import { useRef, type Dispatch, type SetStateAction } from 'preact/compat';
import { useConfigStoreShallow } from '../store';
import { cn } from '@/lib/utils';
import { ArrowUp } from 'lucide-react';
import { EmojiPickerComponent } from './emoji-picker';

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
  const { accentColor, removeBranding } = useConfigStoreShallow(s => ({
    accentColor: s.accentColor,
    removeBranding: s.removeBranding,
  }));

  const onEmojiSelect = (emoji: string) => {
    if (inputRef.current) {
      setInputValue(prev => prev + emoji);
      inputRef.current.focus();
    }
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
        className="grow border-none text-sm font-normal text-stone-900 outline-none placeholder:text-stone-900/40 focus:outline-none focus-visible:outline-none"
        value={inputValue}
        onChange={e => setInputValue((e.target as HTMLInputElement).value)}
        onKeyPress={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage({ role: 'user', content: inputValue });
          }
        }}
      />
      <div className="ml-2 flex shrink-0 items-center gap-4">
        <EmojiPickerComponent onEmojiSelect={onEmojiSelect} />

        <span
          className="flex size-8 cursor-pointer items-center justify-center rounded-full text-white"
          style={{ backgroundColor: accentColor }}
          onClick={() => handleSendMessage({ role: 'user', content: inputValue })}
        >
          <ArrowUp />
        </span>
      </div>
    </div>
  );
};
