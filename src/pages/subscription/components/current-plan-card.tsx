import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import useCurrentSubscription from '@/hooks/use-current-subscription';
import pricing from '@/api/pricing';
import { useMemo, useState } from 'preact/hooks';

const CurrentPlanCard = () => {
  const { plan, subscription, account } = useCurrentSubscription();
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  const periodLabel = useMemo(() => {
    const p = subscription?.period === 'yearly' ? 'yearly' : 'monthly';
    return p === 'yearly' ? 'Yearly' : 'Monthly';
  }, [subscription?.period]);

  const priceLabel = useMemo(() => {
    const price = subscription?.price ?? 0;
    return `$${price}`;
  }, [subscription?.price, periodLabel]);

  const renewalDate = useMemo(() => {
    const iso = (account as any)?.currentPeriodEnd as string | undefined;
    if (!iso) return '-';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }, [account?.currentPeriodEnd]);

  const openBillingPortal = async () => {
    if (isPortalLoading) return;
    try {
      setIsPortalLoading(true);
      const { url } = await pricing.createPortalSession({
        returnUrl: `${window.location.origin}/subscription`,
      });
      window.location.href = url;
    } catch (e) {
      console.error(e);
      alert('Failed to open billing portal. Please try again.');
    } finally {
      setIsPortalLoading(false);
    }
  };

  const title = plan?.title ?? 'Free';

  return (
    <Card className="block p-0">
      <div className="flex items-center gap-2 px-6 pt-6 pb-5 text-base font-semibold">
        <CreditCard className="size-4 text-stone-500" />
        Current plan
      </div>
      <div className="px-6 pb-8">
        <p className="mb-6 text-2xl font-bold">{title}</p>
        <div className="space-y-2.5">
          <p className="flex items-center justify-between text-base font-normal">
            <span>Price</span>
            <span>{title === 'Free' ? '$0 / monthly' : priceLabel}</span>
          </p>
          {title !== 'Free' && (
            <>
              <p className="flex items-center justify-between text-base font-normal">
                <span>Billing cycle</span>
                <span>{periodLabel}</span>
              </p>
              <p className="flex items-center justify-between text-base font-normal">
                <span>Renewal date</span>
                <span>{renewalDate}</span>
              </p>
            </>
          )}
        </div>
        {plan?.title !== 'Free' && (
          <div className="mt-6 grid grid-cols-3 gap-2.5">
            <Button variant="outline" isLoading={isPortalLoading} onClick={openBillingPortal}>
              Edit Billing
            </Button>
            <Button variant="outline" isLoading={isPortalLoading} onClick={openBillingPortal}>
              View Invoices
            </Button>
            <Button variant="outline" isLoading={isPortalLoading} onClick={openBillingPortal}>
              Cancel plan
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CurrentPlanCard;
