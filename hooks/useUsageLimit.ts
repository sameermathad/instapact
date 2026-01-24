"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getUserProfile } from '@/lib/user';
import { getAgreementCount } from '@/lib/contracts';
import { PLANS, DEFAULT_PLAN, PlanType } from '@/lib/config';

export function useUsageLimit() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(0);
  const [credits, setCredits] = useState(0);
  const [plan, setPlan] = useState<PlanType>(DEFAULT_PLAN);
  const [isAtLimit, setIsAtLimit] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const checkLimit = async () => {
      setLoading(true);
      try {
        const profile = await getUserProfile(user.uid);
        const userPlan = profile?.plan || DEFAULT_PLAN;
        const planConfig = PLANS[userPlan];
        
        const userCredits = profile?.credits || 0;
        setCredits(userCredits);
        setPlan(userPlan);
        setLimit(planConfig.limit);

        let currentCount = 0;
        if (planConfig.isMonthly) {
          // Check for billing cycle dates
          if (profile?.currentPeriodStart && profile?.currentPeriodEnd) {
             const start = profile.currentPeriodStart.toDate ? profile.currentPeriodStart.toDate() : new Date(profile.currentPeriodStart);
             const end = profile.currentPeriodEnd.toDate ? profile.currentPeriodEnd.toDate() : new Date(profile.currentPeriodEnd);
             
             currentCount = await getAgreementCount(user.uid, { start, end });
          } else {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
            currentCount = await getAgreementCount(user.uid, { start: startOfMonth, end: endOfMonth });
          }
        } else {
          // For One-Time / Free plans, usage is lifetime based on creation history
          // Fallback to active count if lifetime is not tracked yet (migration)
          currentCount = (profile?.lifetimeCount !== undefined)
             ? profile.lifetimeCount 
             : await getAgreementCount(user.uid);
        }

        setCount(currentCount);
        // If limit is infinity, they are never at limit.
        // Otherwise, effective limit is plan limit + credits.
        const effectiveLimit = planConfig.limit === Infinity ? Infinity : (planConfig.limit + userCredits);
        setIsAtLimit(currentCount >= effectiveLimit);
      } catch (error) {
        console.error("Error checking usage limit:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLimit();
  }, [user]);

  return { count, limit, isAtLimit, loading, plan, credits: credits || 0 };
}
