import type { Dispatch, SetStateAction } from 'preact/compat';
import { InputContainer } from './input-container';
import { PoweredByLabel } from './powered-by-label';

export const Footer = ({
  inputValue,
  setInputValue,
  handleSendMessage,
}: {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  handleSendMessage: (message: { role: 'user' | 'assistant'; content: string }) => void;
}) => {
  return (
    <div className="flex flex-col px-4">
      <InputContainer
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
      />
      <PoweredByLabel />
    </div>
  );
};
