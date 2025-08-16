import { ArrowLeft } from 'lucide-react';
import { Options } from './options';
import { CloseWidget } from './close-widget';

export const Header = ({
  messages,
}: {
  messages: { role: 'user' | 'assistant'; content: string }[];
}) => {
  const firstMessage = messages[0];

  return (
    <div className="flex items-center justify-between p-6">
      <ArrowLeft className="size-5 text-stone-700" />
      <span className="max-w-[calc(100%-100px)] truncate text-sm font-semibold text-stone-900">
        {!firstMessage ? 'New chat' : firstMessage.content}
      </span>
      <div className="flex items-center gap-2">
        <Options />
        <CloseWidget />
      </div>
    </div>
  );
};
