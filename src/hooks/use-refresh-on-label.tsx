import { useMemo } from 'preact/hooks';
import type { IAccount } from '@/types/account.type';
import useCurrentSubscription from '@/hooks/use-current-subscription';
import moment from 'moment';

type UseRefreshOnLabelOptions = {
  accountOverride?: IAccount | null;
  prefix?: string; // default: 'Refresh on'
};

const parseDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  const d = new Date(String(value));
  return isNaN(d.getTime()) ? null : d;
};

const useRefreshOnLabel = (options?: UseRefreshOnLabelOptions) => {
  const { account: hookAccount } = useCurrentSubscription();
  const account = options?.accountOverride ?? hookAccount;
  const prefix = options?.prefix ?? 'Refresh on';

  const refreshDate = useMemo(() => {
    const isActiveSubscription = account?.billingStatus === 'active';
    const periodStart = parseDate(account?.currentPeriodStart);
    const now = moment();
    if (isActiveSubscription && periodStart) {
      const periodDay = moment(periodStart).date();
      const nextMonth = now.clone().add(1, 'month').startOf('month');
      const lastDayOfNextMonth = nextMonth.clone().endOf('month').date();
      const targetDay = Math.min(periodDay, lastDayOfNextMonth);
      return nextMonth.clone().date(targetDay).toDate();
    }

    // Fallback: next month on the day of createdAt (clamped to last day of month)
    const createdAt = parseDate(account?.createdAt) ?? now;
    const createdDay = moment(createdAt).date();
    const nextMonthFirst = now.clone().add(1, 'month').startOf('month');
    const lastDay = nextMonthFirst.clone().endOf('month').date();
    const targetDay = Math.min(createdDay, lastDay);
    return nextMonthFirst.clone().date(targetDay).toDate();
  }, [account?.currentPeriodEnd, account?.createdAt]);

  const label = useMemo(() => {
    return `${prefix} ${refreshDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`;
  }, [prefix, refreshDate]);

  return { label, date: refreshDate };
};

export default useRefreshOnLabel;
