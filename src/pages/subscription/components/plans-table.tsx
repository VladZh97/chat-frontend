import { Button } from '@/components/ui/button';
import { PLAN_NAMES, PLANS, SUBSCRIPTIONS } from '@/config';
import { cn } from '@/lib/utils';
import { Loader2, SquareCheckBig } from 'lucide-react';
import { useMemo, useState } from 'preact/hooks';
import pricing from '@/api/pricing';
import useCurrentSubscription from '@/hooks/use-current-subscription';

const PlansTable = () => {
  const [activePlan, setActivePlan] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { plan: currentPlan, subscription: currentSubscription } = useCurrentSubscription();

  type PaidPlanKey = typeof PLAN_NAMES.PRO | typeof PLAN_NAMES.TEAM;

  const PLAN_ORDER: Record<'Free' | 'Pro' | 'Team', number> = { Free: 0, Pro: 1, Team: 2 };
  const PERIOD_ORDER: Record<'monthly' | 'yearly', number> = { monthly: 0, yearly: 1 };

  const getCurrentPlanId = (): 'Free' | 'Pro' | 'Team' => {
    const id = (currentPlan?.title as 'Free' | 'Pro' | 'Team') || 'Free';
    return ['Free', 'Pro', 'Team'].includes(id) ? id : 'Free';
  };

  const isHigherThanCurrent = (targetPlanId: 'Free' | 'Pro' | 'Team') => {
    const currentId = getCurrentPlanId();
    if (PLAN_ORDER[targetPlanId] > PLAN_ORDER[currentId]) return true;
    if (PLAN_ORDER[targetPlanId] < PLAN_ORDER[currentId]) return false;
    // Same tier: compare periods (yearly > monthly)
    if (targetPlanId === 'Free') return false;
    if (!currentSubscription?.period) return false;
    return (
      PERIOD_ORDER[activePlan] > PERIOD_ORDER[currentSubscription.period as 'monthly' | 'yearly']
    );
  };

  const isLowerThanCurrent = (targetPlanId: 'Free' | 'Pro' | 'Team') => {
    const currentId = getCurrentPlanId();
    if (PLAN_ORDER[targetPlanId] < PLAN_ORDER[currentId]) return true;
    if (PLAN_ORDER[targetPlanId] > PLAN_ORDER[currentId]) return false;
    // Same tier: compare periods (monthly < yearly)
    if (targetPlanId === 'Free') return false;
    if (!currentSubscription?.period) return false;
    return (
      PERIOD_ORDER[activePlan] < PERIOD_ORDER[currentSubscription.period as 'monthly' | 'yearly']
    );
  };

  const isCurrentPlan = (planId: 'Free' | 'Pro' | 'Team') => {
    const currentId = getCurrentPlanId();
    if (planId === 'Free') return currentId === 'Free';
    // For paid plans, require both title and period to match
    return (
      currentId === planId &&
      (currentSubscription?.period === 'monthly' || currentSubscription?.period === 'yearly') &&
      currentSubscription?.period === activePlan
    );
  };

  const startCheckout = async (plan: PaidPlanKey) => {
    try {
      if (loadingPlan) return;
      setLoadingPlan(plan);
      const priceId = SUBSCRIPTIONS.find(
        subscription => subscription.title === plan && subscription.period === activePlan
      )?.id;
      if (!priceId) throw new Error('Price not configured for selected plan');

      const successUrl = `${window.location.origin}/subscription`;
      const cancelUrl = `${window.location.origin}/subscription`;

      const { url } = await pricing.createCheckoutSession({
        priceId,
        successUrl,
        cancelUrl,
      });
      window.location.href = url;
    } catch (error) {
      console.error(error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const openBillingPortal = async (plan: PaidPlanKey) => {
    if (loadingPlan) return;
    try {
      setLoadingPlan(plan);
      const { url } = await pricing.createPortalSession({
        returnUrl: `${window.location.origin}/subscription`,
      });
      window.location.href = url;
    } catch (e) {
      console.error(e);
      alert('Failed to open billing portal. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const upgradeTo = async (plan: PaidPlanKey) => {
    if (loadingPlan) return;
    const currentId = getCurrentPlanId();
    // Free -> start new subscription via Checkout
    if (currentId === 'Free') {
      await startCheckout(plan);
      return;
    }
    return openBillingPortal(plan);
    // Existing subscription -> compute immediate vs scheduled
    // try {
    //   setLoadingPlan(plan);
    //   const target = SUBSCRIPTIONS.find(
    //     subscription => subscription.title === plan && subscription.period === activePlan
    //   );
    //   const priceId = target?.id;
    //   if (!priceId) throw new Error('Price not configured for selected plan');

    //   let immediateUpdate = false;
    //   if (PLAN_ORDER[plan] > PLAN_ORDER[currentId]) {
    //     // higher tier
    //     immediateUpdate = true;
    //   } else if (PLAN_ORDER[plan] < PLAN_ORDER[currentId]) {
    //     // lower tier
    //     immediateUpdate = false;
    //   } else if (currentSubscription?.period) {
    //     // same tier: compare periods (yearly > monthly)
    //     const currentRank = PERIOD_ORDER[currentSubscription.period as 'monthly' | 'yearly'];
    //     const targetRank = PERIOD_ORDER[target!.period as 'monthly' | 'yearly'];
    //     immediateUpdate = targetRank > currentRank;
    //   }

    //   await pricing.updateSubscription({ priceId, immediateUpdate });
    //   alert(
    //     immediateUpdate
    //       ? 'Your subscription has been upgraded.'
    //       : 'Your subscription change will take effect at the next billing period.'
    //   );
    //   // Optionally: refetch account data here
    // } catch (error) {
    //   console.error(error);
    //   alert('Failed to change subscription. Please try again.');
    // } finally {
    //   setLoadingPlan(null);
    // }
  };

  const getButtonText = (planId: 'Free' | 'Pro' | 'Team') => {
    if (planId === 'Free' && !isCurrentPlan('Free')) {
      return 'Change Plan';
    }
    if (isCurrentPlan(planId)) return 'Current Plan';
    if (isHigherThanCurrent(planId)) return 'Upgrade Now';
    if (isLowerThanCurrent(planId)) return 'Downgrade plan';
    // Same tier but different period
    return 'Change Plan';
  };

  const prices = useMemo(() => {
    return SUBSCRIPTIONS.reduce(
      (acc, subscription) => {
        const key = `${subscription.title}-${subscription.period}`;
        acc[key] = subscription.period === 'yearly' ? subscription.price / 12 : subscription.price;
        return acc;
      },
      {} as Record<string, number | undefined>
    );
  }, []);

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
        <div data-move className="max-lg:rounded-2xl max-lg:bg-white max-lg:shadow-lg">
          <div className="border-b border-stone-200 p-10 max-xl:p-8 max-lg:p-6">
            <h3 className="mb-2 text-2xl font-semibold text-stone-900">
              {PLANS[PLAN_NAMES.FREE].title}
            </h3>
            <p className="mb-6 text-base font-normal text-stone-500">
              {PLANS[PLAN_NAMES.FREE].description}
            </p>
            <p className="text-xl font-normal text-stone-900">
              <span className="--price text-5xl font-semibold">$0</span>
              /month
            </p>
            <Button
              variant="outline"
              className={cn(
                'mt-6 h-12 w-full text-base font-semibold',
                !isCurrentPlan('Free') && 'invisible opacity-0'
              )}
              disabled={isCurrentPlan('Free')}
            >
              {getButtonText('Free')}
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

        <div data-move className="max-lg:rounded-2xl max-lg:bg-white max-lg:shadow-lg">
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
                ${prices[`${PLAN_NAMES.PRO}-${activePlan}`]}
              </span>
              /month
            </p>
            <Button
              className={cn(
                'mt-6 h-12 w-full text-base font-semibold',
                isCurrentPlan('Pro') && '!bg-stone-500 opacity-50'
              )}
              isLoading={loadingPlan === PLAN_NAMES.PRO}
              disabled={isCurrentPlan('Pro')}
              onClick={() => {
                upgradeTo(PLAN_NAMES.PRO);
              }}
            >
              {loadingPlan === PLAN_NAMES.PRO && <Loader2 className="size-4 animate-spin" />}
              {getButtonText('Pro')}
            </Button>
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

        <div className="max-lg:rounded-2xl max-lg:bg-white max-lg:shadow-lg">
          <div className="border-b border-stone-200 p-10 max-xl:p-8 max-lg:p-6">
            <h3 className="mb-2 text-2xl font-semibold text-stone-900">
              {PLANS[PLAN_NAMES.TEAM].title}
            </h3>
            <p className="mb-6 text-base font-normal text-stone-500">
              {PLANS[PLAN_NAMES.TEAM].description}
            </p>
            <p className="text-xl font-normal text-stone-900">
              <span className="--price text-5xl font-semibold tabular-nums">
                ${prices[`${PLAN_NAMES.TEAM}-${activePlan}`]}
              </span>
              /month
            </p>
            <Button
              className="mt-6 h-12 w-full text-base font-semibold"
              isLoading={loadingPlan === PLAN_NAMES.TEAM}
              disabled={isCurrentPlan('Team')}
              onClick={() => {
                upgradeTo(PLAN_NAMES.TEAM);
              }}
            >
              {loadingPlan === PLAN_NAMES.TEAM && <Loader2 className="size-4 animate-spin" />}
              {getButtonText('Team')}
            </Button>
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
