"use client"

import { useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'
import { updateUserProfile, getUserProfile } from '@/lib/user'
import { PlanType, PLANS } from '@/lib/config'

export type PaymentType = 'plan_upgrade' | 'credit_purchase'

interface UsePaymentReturn {
  processPayment: (type: PaymentType, itemId: string, amount: number) => Promise<boolean>
  processing: boolean
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function usePayment(): UsePaymentReturn {
  const { user } = useAuth()
  const [processing, setProcessing] = useState(false)

  const fulfillPurchase = async (type: PaymentType, itemId: string) => {
    if (!user) return;
    
    try {
        const currentProfile = await getUserProfile(user.uid)
        const updates: any = {}

        if (type === 'plan_upgrade') {
            updates.plan = itemId as PlanType
            
            // Calculate subscription end date
            const now = new Date()
            const endDate = new Date(now)
            
            if (PLANS[itemId as PlanType]?.isAnnual) {
                endDate.setFullYear(now.getFullYear() + 1)
            } else {
                endDate.setMonth(now.getMonth() + 1)
            }
            
            updates.subscriptionStatus = 'active'
            updates.subscriptionId = 'sub_rzp_' + Math.random().toString(36).substring(7)
            updates.currentPeriodStart = now
            updates.currentPeriodEnd = endDate
            
            toast.success(`Successfully upgraded to ${PLANS[itemId as PlanType].name} plan!`, { id: 'payment-process' })
        } else if (type === 'credit_purchase') {
            const currentCredits = currentProfile?.credits || 0
            const creditsToAdd = parseInt(itemId) || 1
            updates.credits = currentCredits + creditsToAdd
            toast.success(`Successfully added ${creditsToAdd} credit${creditsToAdd > 1 ? 's' : ''}!`, { id: 'payment-process' })
        }

        await updateUserProfile(user.uid, updates)
    } catch (error) {
        console.error("Error updating profile:", error)
        toast.error("Payment successful but profile update failed. Please contact support.")
    }
  }

  const processPayment = async (type: PaymentType, itemId: string, amount: number): Promise<boolean> => {
    if (!user) {
      toast.error("You must be logged in to make a purchase")
      return false
    }

    setProcessing(true)
    toast.loading("Initializing payment...", { id: 'payment-process' })

    if (!window.Razorpay) {
        toast.error("Payment SDK not loaded. Please check your internet connection.", { id: 'payment-process' });
        setProcessing(false);
        return false;
    }

    return new Promise(async (resolve) => {
        try {
            const planConfig = PLANS[itemId as PlanType];
            const useSubscription = type === 'plan_upgrade' && planConfig?.razorpayPlanId;

            let paymentData;
            if (useSubscription) {
                const res = await fetch('/api/razorpay/subscription', {
                    method: 'POST',
                    body: JSON.stringify({ planId: planConfig.razorpayPlanId }),
                    headers: { 'Content-Type': 'application/json' }
                });
                paymentData = await res.json();
                if (!res.ok) throw new Error(paymentData.error || 'Failed to create subscription');
            } else {
                const res = await fetch('/api/razorpay/order', {
                    method: 'POST',
                    body: JSON.stringify({ amount, currency: 'INR' }),
                    headers: { 'Content-Type': 'application/json' }
                });
                paymentData = await res.json();
                if (!res.ok) throw new Error(paymentData.error || 'Failed to create order');
            }

            const options: any = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                name: "InstaPact",
                description: type === 'plan_upgrade' ? `Upgrade to ${planConfig?.name || itemId}` : 'Credit Purchase',
                handler: async function (response: any) {
                    toast.loading("Verifying payment...", { id: 'payment-process' });
                    try {
                       const verifyRes = await fetch('/api/razorpay/verify', {
                           method: 'POST',
                           body: JSON.stringify({
                               razorpay_order_id: response.razorpay_order_id,
                               razorpay_subscription_id: response.razorpay_subscription_id,
                               razorpay_payment_id: response.razorpay_payment_id,
                               razorpay_signature: response.razorpay_signature
                           }),
                           headers: { 'Content-Type': 'application/json' }
                       });
                       
                       const verifyData = await verifyRes.json();
                       if (verifyRes.ok && verifyData.status === 'success') {
                           await fulfillPurchase(type, itemId);
                           resolve(true);
                       } else {
                           throw new Error('Verification failed');
                       }
                    } catch(e) {
                        toast.error("Payment verification failed", { id: 'payment-process' });
                        console.error(e);
                        resolve(false);
                    } finally {
                        setProcessing(false);
                    }
                },
                prefill: {
                    name: user.displayName || '',
                    email: user.email || '',
                },
                theme: {
                    color: "#2563eb"
                },
                modal: {
                    ondismiss: function() {
                        setProcessing(false);
                        toast.dismiss('payment-process');
                        toast.error("Payment cancelled");
                        resolve(false);
                    }
                }
            };

            if (useSubscription) {
                options.subscription_id = paymentData.id;
            } else {
                options.amount = paymentData.amount;
                options.currency = paymentData.currency;
                options.order_id = paymentData.id;
            }

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Payment initialization failed", { id: 'payment-process' });
            setProcessing(false);
            resolve(false);
        }
    });
  }

  return { processPayment, processing }
}
