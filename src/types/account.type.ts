export interface IAccount {
  _id: string;
  name: string;
  stripeBillingId?: string;
  billingEmail?: string;
  billingPlan?: string;
  billingStatus?: string;
  trialEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
