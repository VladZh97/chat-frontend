import { Card } from '@/components/ui/card';
import { ListChecks, SquareCheckBig } from 'lucide-react';
import useCurrentSubscription from '@/hooks/use-current-subscription';

const PlanFeaturesCard = () => {
  const { plan } = useCurrentSubscription();
  const features = plan?.features || [];

  return (
    <Card className="block p-0">
      <div className="flex items-center gap-2 px-6 pt-6 pb-5 text-base font-semibold">
        <ListChecks className="size-4 text-stone-500" />
        {plan?.title ? `${plan.title} Plan Features` : 'Plan Features'}
      </div>
      <div className="space-y-4 px-6 pb-6">
        {features.length === 0 ? (
          <p className="text-base font-normal text-stone-500">No features available.</p>
        ) : (
          features.map(feature => (
            <p key={feature} className="flex items-center gap-3 text-base font-normal">
              <SquareCheckBig className="size-4 text-orange-500" />
              {feature}
            </p>
          ))
        )}
      </div>
    </Card>
  );
};

export default PlanFeaturesCard;
