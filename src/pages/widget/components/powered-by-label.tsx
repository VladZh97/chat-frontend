import { useConfigStoreShallow } from '../store';
import PoveredBy from '@/assets/povered-by.svg?react';

export const PoweredByLabel = () => {
  const { removeBranding } = useConfigStoreShallow(s => ({
    removeBranding: s.removeBranding,
  }));
  if (removeBranding) return null;
  return (
    <div className="mt-2 flex h-8 items-center justify-center gap-1.5 text-xs text-neutral-500">
      Powered by
      <PoveredBy />
    </div>
  );
};
