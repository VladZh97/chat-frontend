import account from '@/api/account';
import { PLAN_LIMITS, PLAN_NAMES, PLANS } from '@/config';
import { useQuery } from '@tanstack/react-query';

const useCurrentSubscription = () => {
  const { data, isLoading } = useQuery({
    queryKey: account.get.key,
    queryFn: () => account.get.query(),
  });

  if (isLoading)
    return {
      plan: {},
      limits: PLAN_LIMITS[PLAN_NAMES.FREE],
    } as { plan: typeof PLANS.Free; limits: typeof PLAN_LIMITS.Free };
  const plan = PLANS[data?.subscriptionPlanId as keyof typeof PLANS] || PLANS[PLAN_NAMES.FREE];
  const limits = PLAN_LIMITS[plan.id as keyof typeof PLAN_LIMITS] || PLAN_LIMITS[PLAN_NAMES.FREE];
  return { plan, limits };
};

export default useCurrentSubscription;
