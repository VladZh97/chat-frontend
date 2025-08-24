import account from '@/api/account';
import { PLAN_NAMES, PLANS } from '@/config';
import { environment } from '@/environment';
import type { IAccount } from '@/types/account.type';
import { useQuery } from '@tanstack/react-query';

const SUBSCRIPTIONS = environment.subscriptions;
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
  let plan = PLANS[subscription?.title as keyof typeof PLANS] || PLANS[PLAN_NAMES.FREE];
  if (!isActive) plan = PLANS[PLAN_NAMES.FREE];
  return { plan, subscription, account: data, isActive };
};

export default useCurrentSubscription;
