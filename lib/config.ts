
export type PlanType = 'free' | 'single' | 'standard' | 'agency';

export interface PlanConfig {
  id: PlanType;
  name: string;
  limit: number; // number of docs
  isMonthly: boolean;
  price?: number;
  currency?: string;
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
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    limit: Infinity,
    isMonthly: true,
    price: 999,
    currency: 'INR',
  },
};

export const DEFAULT_PLAN: PlanType = 'free';
