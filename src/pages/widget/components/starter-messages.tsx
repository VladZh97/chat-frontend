import { useConfigStoreShallow } from '../store';

export const StarterMessages = ({
  hasMessages,
  onSelect,
}: {
  hasMessages: boolean;
  onSelect: (starter: string) => void;
}) => {
  const { conversationStarters } = useConfigStoreShallow(s => ({
    conversationStarters: s.conversationStarters,
  }));
  if (conversationStarters.length === 0 || hasMessages) return null;
  return (
    <div className="absolute bottom-0 left-0 mt-auto flex w-full flex-wrap justify-end gap-2 p-6">
      {conversationStarters.map(starter => (
        <span
          key={starter.id}
          className="shadow-card flex cursor-pointer items-center justify-center rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50"
          onClick={() => onSelect(starter.value)}
        >
          {starter.value}
        </span>
      ))}
    </div>
  );
};
