
export type PlanType = 'free' | 'single' | 'standard' | 'agency' | 'standard_annual' | 'agency_annual';

export interface PlanConfig {
  id: PlanType;
  name: string;
  limit: number; // number of docs
  isMonthly: boolean;
  isAnnual?: boolean;
  price?: number;
  currency?: string;
  razorpayPlanId?: string;
}

export const PLANS: Record<PlanType, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    limit: 1,
    isMonthly: false,
    price: 0,
    currency: 'INR',
  },
  single: {
    id: 'single',
    name: 'Single Doc',
    limit: 1, // 1 doc per purchase
    isMonthly: false,
    price: 99,
    currency: 'INR',
  },
  standard: {
    id: 'standard',
    name: 'Standard',
    limit: 10,
    isMonthly: true,
    price: 399,
    currency: 'INR',
    razorpayPlanId: 'plan_S7pWo2zduZIP8R',
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    limit: 999999, // Use a large number instead of Infinity for serialization
    isMonthly: true,
    price: 999,
    currency: 'INR',
    razorpayPlanId: 'plan_S7pXAqJTVyu3Ta',
  },
  standard_annual: {
    id: 'standard_annual',
    name: 'Standard Annual',
    limit: 10,
    isMonthly: false,
    isAnnual: true,
    price: 3999,
    currency: 'INR',
    razorpayPlanId: 'plan_S7pyCu509F383e',
  },
  agency_annual: {
    id: 'agency_annual',
    name: 'Agency Annual',
    limit: 999999,
    isMonthly: false,
    isAnnual: true,
    price: 9999,
    currency: 'INR',
    razorpayPlanId: 'plan_S7pzR0dbTQIapW',
  },
};

export const DEFAULT_PLAN: PlanType = 'free';
