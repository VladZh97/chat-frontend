import { useConfigStoreShallow } from '../store';

export const UserMessage = ({ message }: { message: string }) => {
  const { accentColor } = useConfigStoreShallow(s => ({
    accentColor: s.accentColor,
  }));
  return (
    <div className="flex justify-end">
      <p
        className="rounded-2xl rounded-br-none px-4 py-3 text-sm font-normal text-white"
        style={{ backgroundColor: accentColor }}
      >
        {message}
      </p>
    </div>
  );
};
