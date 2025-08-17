import { memo, useRef, useState, type Dispatch, type SetStateAction } from 'preact/compat';
import { useConfigStoreShallow } from '../store';
import { useWidgetStoreShallow } from '../store/widget.store';
import { cn } from '@/lib/utils';
import { ArrowUp } from 'lucide-react';
import { EmojiPickerComponent } from './emoji-picker';
import { useTextOnAccent } from '@/hooks/use-accent-colors';
import { z } from 'zod';

const emailSchema = z.string().email();

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
  const [emailError, setEmailError] = useState<string | null>(null);

  const { removeBranding, collectLeads } = useConfigStoreShallow(s => ({
    removeBranding: s.removeBranding,
    collectLeads: s.collectLeads,
  }));

  const { awaitingEmail } = useWidgetStoreShallow(s => ({
    awaitingEmail: s.awaitingEmail,
  }));

  const onEmojiSelect = (emoji: string) => {
    if (inputRef.current) {
      setInputValue(prev => prev + emoji);
      inputRef.current.focus();
    }
  };

  const handleSubmit = () => {
    if (awaitingEmail) {
      const emailValidation = emailSchema.safeParse(inputValue);
      if (!emailValidation.success) {
        setEmailError('Please enter a valid email address');
        return;
      }
      setEmailError(null);
      handleSendMessage({ role: 'user', content: inputValue });
    } else {
      handleSendMessage({ role: 'user', content: inputValue });
    }
  };

  const getPlaceholder = () => {
    if (collectLeads && awaitingEmail) return 'Provide your email';
    return 'Ask me anything';
  };

  return (
    <div
      className={cn(
        'flex h-14 items-center rounded-xl py-3 pr-3 pl-4',
        removeBranding && 'mb-2',
        emailError ? 'border border-red-200 bg-red-50' : 'bg-stone-100'
      )}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder={getPlaceholder()}
        className={cn(
          'grow border-none text-sm font-normal outline-none focus:outline-none focus-visible:outline-none',
          emailError
            ? 'text-red-600 placeholder:text-red-400'
            : 'text-stone-900 placeholder:text-stone-900/40'
        )}
        value={inputValue}
        onChange={e => {
          setInputValue((e.target as HTMLInputElement).value);
          if (emailError) setEmailError(null);
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
