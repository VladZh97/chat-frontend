import { useMemo } from 'preact/hooks';
import type { IAccount } from '@/types/account.type';
import useCurrentSubscription from '@/hooks/use-current-subscription';

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
    // Prefer currentPeriodEnd
    const periodEnd = parseDate(account?.currentPeriodEnd);
    if (periodEnd) return periodEnd;

    // Fallback: next month on the day of createdAt (clamped to last day of month)
    const now = new Date();
    const createdAt = parseDate(account?.createdAt) ?? now;
    const createdDay = createdAt.getDate();
    const nextMonthFirst = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const lastDay = new Date(
      nextMonthFirst.getFullYear(),
      nextMonthFirst.getMonth() + 1,
      0
    ).getDate();
    const targetDay = Math.min(createdDay, lastDay);
    return new Date(nextMonthFirst.getFullYear(), nextMonthFirst.getMonth(), targetDay);
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
