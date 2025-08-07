import { cn } from '@/lib/utils';

const OPTIONS: { label: string; value: 'links' | 'files' | 'text-snippet' }[] = [
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
  type,
  setType,
}: {
  type: 'links' | 'files' | 'text-snippet';
  setType: (type: 'links' | 'files' | 'text-snippet') => void;
}) => {
  return (
    <div className="mb-5 h-10 rounded-lg bg-stone-100 p-1">
      <div className="relative h-full">
        <div className="relative z-10 grid h-full grid-cols-3">
          {OPTIONS.map(option => (
            <span
              key={option.value}
              onClick={() => setType(option.value)}
              className={cn(
                'flex cursor-pointer items-center justify-center text-sm font-medium text-stone-500 transition-colors hover:text-stone-900',
                type === option.value && 'text-stone-900'
              )}
            >
              {option.label}
            </span>
          ))}
        </div>
        <span
          className={cn(
            'absolute top-0 left-0 h-full w-1/3 rounded-md bg-white shadow transition-transform duration-300',
            type === 'links' && 'translate-x-0',
            type === 'files' && 'translate-x-full',
            type === 'text-snippet' && 'translate-x-[200%]'
          )}
        ></span>
      </div>
    </div>
  );
};

export default Tabs;
