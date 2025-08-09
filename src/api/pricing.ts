import api from './api';

// Types
export type CreateCheckoutSessionBody = {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
};

export type CreateCheckoutSessionResponse = {
  sessionId?: string;
  url: string;
};

export type CreatePaymentIntentBody = {
  amount: number; // in smallest currency unit (e.g., cents)
  currency?: string; // default decided by server (e.g., 'usd')
};

export type CreatePaymentIntentResponse = {
  clientSecret: string;
};

export type CreateSetupIntentResponse = {
  clientSecret: string;
};

export type PaymentConfigResponse = {
  config: Record<string, unknown>;
  publishableKey: string;
};

export type PlanFeature = string;

export type Plan = {
  id: string; // Stripe price id
  productId: string; // Stripe product id
  name: string;
  description?: string;
  interval?: 'day' | 'week' | 'month' | 'year';
  currency: string;
  unitAmount: number; // smallest currency unit
  metadata?: Record<string, string>;
  features?: PlanFeature[];
};

export type UpdateSubscriptionBody = {
  priceId: string;
  immediateUpdate?: boolean; // true for immediate change (upgrade), false to schedule (downgrade)
};

export type UpdateSubscriptionResponse = {
  subscription: SubscriptionLike | null;
  isImmediateChange: boolean;
  nextBillingDate?: string | null; // ISO
};

export type CancelSubscriptionBody = {
  cancelAtPeriodEnd?: boolean; // default true for end-of-period
};

export type CancelSubscriptionResponse = {
  subscription: SubscriptionLike | null;
  immediatelyCanceled: boolean;
  effectiveDate: string | null; // ISO
};

export type CreatePortalSessionBody = {
  returnUrl: string;
};

export type CreatePortalSessionResponse = {
  url: string;
};

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'canceling'
  | 'incomplete'
  | 'incomplete_expired';

export type SubscriptionLike = {
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  stripeBillingId?: string | null; // customer id
  billingEmail?: string | null;
  billingPlan?: string | null;
  billingStatus?: SubscriptionStatus | null;
  planName?: string | null;
  priceAmount?: number | null;
  priceCurrency?: string | null;
  trialEndDate?: string | null; // ISO
  currentPeriodStart?: string | null; // ISO
  currentPeriodEnd?: string | null; // ISO
  cancelAtPeriodEnd?: boolean | null;
  // Optional live Stripe data when fetched by id route
  stripeData?: Record<string, unknown>;
};

export type StatusResponse = {
  accountStatus: SubscriptionStatus | null;
  subscription: SubscriptionLike | null;
  hasPendingCancellation: boolean;
  isActive: boolean;
  isSubscriptionManager: boolean;
  hasBillingAccount: boolean;
  trialEndDate: string | null;
  billingPlan: string | null;
};

export const pricing = {
  createCheckoutSession: async (
    body: CreateCheckoutSessionBody
  ): Promise<CreateCheckoutSessionResponse> => {
    const { data } = await api.post<CreateCheckoutSessionResponse>(
      '/pricing/create-checkout-session',
      body
    );
    return data;
  },

  createPaymentIntent: async (
    body: CreatePaymentIntentBody
  ): Promise<CreatePaymentIntentResponse> => {
    const { data } = await api.post<CreatePaymentIntentResponse>(
      '/pricing/create-payment-intent',
      body
    );
    return data;
  },

  createSetupIntent: async (): Promise<CreateSetupIntentResponse> => {
    const { data } = await api.post<CreateSetupIntentResponse>('/pricing/create-setup-intent', {});
    return data;
  },

  paymentConfig: async (): Promise<PaymentConfigResponse> => {
    const { data } = await api.get<PaymentConfigResponse>('/pricing/payment-config');
    return data;
  },

  plans: async (): Promise<Plan[]> => {
    const { data } = await api.get<Plan[]>('/pricing/plans');
    return data;
  },

  updateSubscription: async (body: UpdateSubscriptionBody): Promise<UpdateSubscriptionResponse> => {
    const { data } = await api.post<UpdateSubscriptionResponse>(
      '/pricing/update-subscription',
      body
    );
    return data;
  },

  cancelSubscription: async (body: CancelSubscriptionBody): Promise<CancelSubscriptionResponse> => {
    const { data } = await api.post<CancelSubscriptionResponse>(
      '/pricing/cancel-subscription',
      body
    );
    return data;
  },

  createPortalSession: async (
    body: CreatePortalSessionBody
  ): Promise<CreatePortalSessionResponse> => {
    const { data } = await api.post<CreatePortalSessionResponse>(
      '/pricing/create-portal-session',
      body
    );
    return data;
  },

  // Backwards-compat list; at most one item is expected
  subscriptions: async (): Promise<SubscriptionLike[]> => {
    const { data } = await api.get<SubscriptionLike[]>('/pricing/subscriptions');
    return data;
  },

  getSubscription: async (id: string): Promise<SubscriptionLike> => {
    const { data } = await api.get<SubscriptionLike>(`/pricing/subscriptions/${id}`);
    return data;
  },

  status: async (): Promise<StatusResponse> => {
    const { data } = await api.get<StatusResponse>('/pricing/status');
    return data;
  },
};

export default pricing;
