import { Button } from '@/components/ui/button';
import { PLAN_NAMES, PLANS } from '@/config';
import { cn } from '@/lib/utils';
import { SquareCheckBig } from 'lucide-react';
import { useState } from 'preact/hooks';

const PlansTable = () => {
  const [activePlan, setActivePlan] = useState('monthly');

  return (
    <div className="px-8 pt-8 pb-6">
      <div className="mb-6 flex items-center justify-between">
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

      <div className="grid grid-cols-3 divide-x divide-stone-200 rounded-3xl bg-white shadow-lg max-lg:mx-auto max-lg:max-w-[700px] max-lg:grid-cols-1 max-lg:gap-6 max-lg:divide-none max-lg:bg-transparent max-lg:shadow-none">
        <div
          data-plan={PLANS[PLAN_NAMES.FREE].id}
          data-move
          className="max-lg:rounded-2xl max-lg:bg-white max-lg:shadow-lg"
        >
          <div className="border-b border-stone-200 p-10 max-xl:p-8 max-lg:p-6">
            <h3 className="mb-2 text-2xl font-semibold text-stone-900">
              {PLANS[PLAN_NAMES.FREE].title}
            </h3>
            <p className="mb-6 text-base font-normal text-stone-500">
              {PLANS[PLAN_NAMES.FREE].description}
            </p>
            <p className="text-xl font-normal text-stone-900">
              <span className="--price text-5xl font-semibold">
                ${PLANS[PLAN_NAMES.FREE].price}
              </span>
              /month
            </p>
            <Button
              variant="outline"
              className="mt-6 h-12 w-full text-base font-semibold opacity-50 disabled:pointer-events-none"
              disabled
            >
              Current Plan
            </Button>
          </div>
          <div className="p-10 max-xl:p-8 max-lg:p-6">
            <ul className="space-y-4">
              {PLANS[PLAN_NAMES.FREE].features.map(feature => (
                <li className="flex items-center gap-2.5 text-base font-normal text-stone-700">
                  <SquareCheckBig className="size-4 text-orange-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          data-plan={PLANS[PLAN_NAMES.PRO].id}
          data-move
          className="max-lg:rounded-2xl max-lg:bg-white max-lg:shadow-lg"
        >
          <div className="border-b border-stone-200 p-10 max-xl:p-8 max-lg:p-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-stone-900">
                {PLANS[PLAN_NAMES.PRO].title}
              </h3>
              <span className="flex h-[22px] items-center justify-center rounded-md bg-orange-100 px-2.5 text-xs font-semibold text-orange-600">
                Recommended
              </span>
            </div>
            <p className="mb-6 text-base font-normal text-stone-500">
              {PLANS[PLAN_NAMES.PRO].description}
            </p>
            <p className="text-xl font-normal text-stone-900">
              <span className="--price text-5xl font-semibold tabular-nums">
                $
                {activePlan === 'monthly'
                  ? PLANS[PLAN_NAMES.PRO].price
                  : Math.round((PLANS[PLAN_NAMES.PRO].price * 10) / 12)}
              </span>
              /month
            </p>
            <Button className="mt-6 h-12 w-full text-base font-semibold">Upgrade Now</Button>
          </div>
          <div className="p-10 max-xl:p-8 max-lg:p-6">
            <ul className="space-y-4">
              {PLANS[PLAN_NAMES.PRO].features.map(feature => (
                <li className="flex items-center gap-2.5 text-base font-normal text-stone-700">
                  <SquareCheckBig className="size-4 text-orange-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          data-move
          data-plan={PLANS[PLAN_NAMES.TEAM].id}
          className="max-lg:rounded-2xl max-lg:bg-white max-lg:shadow-lg"
        >
          <div className="border-b border-stone-200 p-10 max-xl:p-8 max-lg:p-6">
            <h3 className="mb-2 text-2xl font-semibold text-stone-900">
              {PLANS[PLAN_NAMES.TEAM].title}
            </h3>
            <p className="mb-6 text-base font-normal text-stone-500">
              {PLANS[PLAN_NAMES.TEAM].description}
            </p>
            <p className="text-xl font-normal text-stone-900">
              <span className="--price text-5xl font-semibold tabular-nums">
                $
                {activePlan === 'monthly'
                  ? PLANS[PLAN_NAMES.TEAM].price
                  : Math.round((PLANS[PLAN_NAMES.TEAM].price * 10) / 12)}
              </span>
              /month
            </p>
            <Button className="mt-6 h-12 w-full text-base font-semibold">Upgrade Now</Button>
          </div>
          <div className="p-10 max-xl:p-8 max-lg:p-6">
            <ul className="space-y-4">
              {PLANS[PLAN_NAMES.TEAM].features.map(feature => (
                <li className="flex items-center gap-2.5 text-base font-normal text-stone-700">
                  <SquareCheckBig className="size-4 text-orange-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansTable;
