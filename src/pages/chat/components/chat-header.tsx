import { ArrowLeft } from 'lucide-react';
import { Options } from './options';
import { CloseWidget } from './close-widget';
import { useConfigStoreShallow } from '../store';
import { memo } from 'preact/compat';

export const Header = memo(() => {
  const { name, publicName } = useConfigStoreShallow(s => ({
    name: s.name,
    publicName: s.publicName,
  }));

  return (
    <div className="flex items-center justify-between p-6">
      <div className="flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-stone-200">
        <ArrowLeft className="size-5 text-stone-700" />
      </div>
      <span className="max-w-[calc(100%-100px)] truncate text-sm font-semibold text-stone-900">
        {publicName || name}
      </span>
      <div className="flex items-center gap-2">
        <Options />
        <CloseWidget />
      </div>
    </div>
  );
});
