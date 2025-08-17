import { useConfigStoreShallow } from '../store';
import { useTextOnAccent } from '@/hooks/use-accent-colors';

export const UserMessage = ({ message }: { message: string }) => {
  const { accentColor } = useConfigStoreShallow(s => ({
    accentColor: s.accentColor,
  }));

  const textOnAccent = useTextOnAccent(accentColor);

  return (
    <div className="flex justify-end">
      <p
        className="rounded-2xl rounded-br-none px-4 py-3 text-sm font-normal"
        style={{
          backgroundColor: accentColor,
          color: textOnAccent.color,
        }}
      >
        {message}
      </p>
    </div>
  );
};
