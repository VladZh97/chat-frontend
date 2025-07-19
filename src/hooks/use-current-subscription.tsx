import account from '@/api/account';
import { PLANS } from '@/config';
import { useQuery } from '@tanstack/react-query';

const useCurrentSubscription = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['account'],
    queryFn: () => account.get(),
  });

  if (isLoading) return { plan: {} } as { plan: typeof PLANS.BASIC };
  const plan = PLANS[data?.subscriptionPlanId as keyof typeof PLANS] || PLANS.BASIC;
  return { plan };
};

export default useCurrentSubscription;
