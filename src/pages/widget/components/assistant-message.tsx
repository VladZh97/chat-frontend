import { useConfigStoreShallow } from '../store';
import { AssistantMessageActions } from './assistant-message-actions';
import { useTextOnAccentTint } from '@/hooks/use-accent-colors';

export const AssistantMessage = ({ message }: { message: string }) => {
  const { accentColor, avatar } = useConfigStoreShallow(s => ({
    accentColor: s.accentColor,
    avatar: s.avatarIcon,
  }));

  const textOnAccentTint = useTextOnAccentTint(accentColor);
  if (!message) return null;
  return (
    <div
      className="flex items-end gap-2"
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      <div
        className="size-6 shrink-0 overflow-hidden rounded-full"
        style={{ backgroundColor: accentColor }}
      >
        {avatar && <img src={avatar} alt="avatar" className="size-full object-cover" />}
      </div>
      <div className="group relative flex flex-col">
        <div
          className="prose rounded-2xl rounded-bl-none px-4 py-3 text-sm font-normal"
          style={{
            backgroundColor: textOnAccentTint.backgroundColor,
            color: textOnAccentTint.color,
          }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
        <AssistantMessageActions message={message} />
      </div>
    </div>
  );
};
