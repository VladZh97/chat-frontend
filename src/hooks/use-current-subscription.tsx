import account from '@/api/account';
import { PLANS } from '@/config';
import { useQuery } from '@tanstack/react-query';

const useCurrentSubscription = () => {
  const { data, isLoading } = useQuery({
    queryKey: account.get.key,
    queryFn: () => account.get.query(),
  });

  if (isLoading) return { plan: {} } as { plan: typeof PLANS.FREE };
  const plan = PLANS[data?.subscriptionPlanId as keyof typeof PLANS] || PLANS.FREE;
  return { plan };
};

export default useCurrentSubscription;
