import { useConfigStoreShallow } from '../store';

export const AssistantMessageLoading = () => {
  const { accentColor, avatar } = useConfigStoreShallow(s => ({
    accentColor: s.accentColor,
    avatar: s.avatarIcon,
  }));
  return (
    <div
      className="flex items-end gap-2"
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      <div className="size-6 overflow-hidden rounded-full" style={{ backgroundColor: accentColor }}>
        {avatar && <img src={avatar} alt="avatar" className="size-full object-cover" />}
      </div>
      <p className="py- flex h-11 items-center gap-1 rounded-2xl rounded-bl-none bg-[var(--accent-color)]/10 px-4">
        <span className="sr-only">Assistant is typing…</span>
        <span className="inline-block size-1.5 animate-bounce rounded-full bg-neutral-900 [animation-delay:-0.3s]"></span>
        <span className="inline-block size-1.5 animate-bounce rounded-full bg-neutral-900 [animation-delay:-0.15s]"></span>
        <span className="inline-block size-1.5 animate-bounce rounded-full bg-neutral-900"></span>
      </p>
    </div>
  );
};
