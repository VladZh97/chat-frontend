import { Card } from '@/components/ui/card';
import { CircleCheckBig, ListChecks } from 'lucide-react';

const features = [
  'Up to 3 chatbots',
  '1,500 messages/month',
  'Full design customization',
  'Remove branding',
  'Full chat history + basic analytics',
  'Priority embed support',
];

const PlanFeaturesCard = () => {
  return (
    <Card className="block p-0">
      <div className="flex items-center gap-2 px-6 pt-6 pb-5 text-base font-semibold">
        <ListChecks className="size-4 text-neutral-500" />
        Basic Plan Features
      </div>
      <div className="space-y-4 px-6 pb-6">
        {features.map(feature => (
          <p key={feature} className="flex items-center gap-3 text-base font-normal">
            <CircleCheckBig className="size-4 text-neutral-500" />
            {feature}
          </p>
        ))}
      </div>
    </Card>
  );
};

export default PlanFeaturesCard;
