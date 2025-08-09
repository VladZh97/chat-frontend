export interface IAccount {
  _id: string;
  name: string;
  stripeBillingId?: string;
  billingEmail?: string;
  billingPlan?: string;
  billingStatus?: string;
  trialEndDate?: Date;
  // Stripe subscription fields (stored on Account instead of a separate collection)
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  priceAmount?: number;
  priceCurrency?: string;
  planName?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
