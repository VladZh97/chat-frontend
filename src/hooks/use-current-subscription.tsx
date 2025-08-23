import account from '@/api/account';
import { PLAN_NAMES, PLANS, SUBSCRIPTIONS } from '@/config';
import type { IAccount } from '@/types/account.type';
import { useQuery } from '@tanstack/react-query';

const useCurrentSubscription = () => {
  const { data, isLoading } = useQuery({
    queryKey: account.get.key,
    queryFn: () => account.get.query(),
  });

  if (isLoading)
    return {
      plan: {},
      subscription: SUBSCRIPTIONS[0],
      account: {} as IAccount,
    } as {
      plan: typeof PLANS.Free;
      subscription: (typeof SUBSCRIPTIONS)[0];
      account: IAccount;
    };

  const subscription = SUBSCRIPTIONS.find(subscription => subscription.id === data?.billingPlan);
  const isActive =
    !data?.cancelAtPeriodEnd ||
    (data.currentPeriodEnd && new Date(data.currentPeriodEnd) > new Date());
  const plan = PLANS[isActive ? (subscription?.title as keyof typeof PLANS) : PLAN_NAMES.FREE];
  return { plan, subscription, account: data, isActive };
};

export default useCurrentSubscription;
