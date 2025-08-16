import { useConfigStoreShallow } from '../store';
import { AssistantMessageActions } from './assistant-message-actions';

export const AssistantMessage = ({ message }: { message: string }) => {
  const { accentColor, avatar } = useConfigStoreShallow(s => ({
    accentColor: s.accentColor,
    avatar: s.avatarIcon,
  }));
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
      <div className="flex flex-col">
        <div
          className="prose rounded-2xl rounded-bl-none bg-[var(--accent-color)]/10 px-4 py-3 text-sm font-normal text-stone-900"
          dangerouslySetInnerHTML={{ __html: message }}
        />
        <AssistantMessageActions />
      </div>
    </div>
  );
};
