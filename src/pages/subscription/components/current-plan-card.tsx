import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

const CurrentPlanCard = () => {
  return (
    <Card className="block p-0">
      <div className="flex items-center gap-2 px-6 pt-6 pb-5 text-base font-semibold">
        <CreditCard className="size-4 text-stone-500" />
        Current plan
      </div>
      <div className="px-6 pb-8">
        <p className="mb-6 text-2xl font-bold">Basic</p>
        <div className="space-y-2.5">
          <p className="flex items-center justify-between text-base font-normal">
            <span>Price</span>
            <span>$10 / monthly</span>
          </p>
          <p className="flex items-center justify-between text-base font-normal">
            <span>Billing cycle</span>
            <span>Monthly</span>
          </p>
          <p className="flex items-center justify-between text-base font-normal">
            <span>Renewal date</span>
            <span>August 15, 2025</span>
          </p>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2.5">
          <Button>Change plan</Button>
          <Button variant="outline">Edit Billing</Button>
          <Button variant="outline">View Invoices</Button>
        </div>
      </div>
    </Card>
  );
};

export default CurrentPlanCard;
