import { cn } from '@/lib/utils';
import { useState } from 'preact/hooks';

const OPTIONS = [
  {
    label: 'Links',
    value: 'links',
  },
  {
    label: 'Files',
    value: 'files',
  },
  {
    label: 'Text snippet',
    value: 'text-snippet',
  },
];

const Tabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  return (
    <div className="mb-5 h-10 rounded-lg bg-neutral-100 p-1">
      <div className="relative h-full">
        <div className="relative z-10 grid h-full grid-cols-3">
          {OPTIONS.map(option => (
            <span
              key={option.value}
              onClick={() => setActiveTab(option.value)}
              className={cn(
                'flex cursor-pointer items-center justify-center text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900',
                activeTab === option.value && 'text-neutral-900'
              )}
            >
              {option.label}
            </span>
          ))}
        </div>
        <span
          className={cn(
            'absolute top-0 left-0 h-full w-1/3 rounded-md bg-white shadow transition-transform duration-300',
            activeTab === 'links' && 'translate-x-0',
            activeTab === 'files' && 'translate-x-full',
            activeTab === 'text-snippet' && 'translate-x-[200%]'
          )}
        ></span>
      </div>
    </div>
  );
};

export default Tabs;
