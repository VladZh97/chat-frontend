import { cn } from '@/lib/utils';
import { useState } from 'preact/hooks';

const PlansTable = () => {
  const [activePlan, setActivePlan] = useState('monthly');

  return (
    <div className="px-8 pt-8 pb-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-medium text-stone-900">Plans</div>
        <div className="h-11 w-[400px] rounded-xl bg-stone-100 p-1">
          <div className="relative h-full">
            <div className="grid h-full grid-cols-2 text-sm font-normal text-stone-500">
              <span
                className={cn(
                  'relative z-1 flex cursor-pointer items-center justify-center transition-colors duration-200 hover:text-stone-950',
                  activePlan === 'monthly' && 'text-stone-900'
                )}
                onClick={() => setActivePlan('monthly')}
              >
                Monthly
              </span>
              <span
                className={cn(
                  'relative z-1 flex cursor-pointer items-center justify-center transition-colors duration-200 hover:text-stone-950',
                  activePlan === 'yearly' && 'text-stone-900'
                )}
                onClick={() => setActivePlan('yearly')}
              >
                Annually (2 months free)
              </span>
            </div>
            <span
              className={cn(
                'absolute top-0 left-0 h-full w-1/2 rounded-lg bg-white shadow transition-transform duration-200',
                activePlan === 'yearly' && 'translate-x-full'
              )}
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansTable;
