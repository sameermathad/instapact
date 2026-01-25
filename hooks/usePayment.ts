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

    const loadSDK = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    return new Promise(async (resolve) => {
        try {
            console.log("Preparing payment...", { type, itemId, amount });
            
            if (!window.Razorpay) {
                console.log("Razorpay SDK missing, attempting to load...");
                const loaded = await loadSDK();
                if (!loaded) {
                    console.error("SDK load failed");
                    toast.error("Payment SDK failed to load. Please disable ad-blockers.", { id: 'payment-process' });
                    setProcessing(false);
                    return resolve(false);
                }
            }

            const planConfig = PLANS[itemId as PlanType];
            const useSubscription = type === 'plan_upgrade' && planConfig?.razorpayPlanId;
            const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

            if (!keyId) {
                console.error("Razorpay Key ID missing from environment");
                throw new Error("Razorpay configuration missing (Key ID)");
            }

            console.log("Fetching payment data from API...", { useSubscription });
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

            console.log("Payment data received, opening Razorpay modal", paymentData);

            let isResolved = false;
            const safeResolve = (val: boolean) => {
                if (!isResolved) {
                    isResolved = true;
                    clearTimeout(watchdog);
                    resolve(val);
                }
            };

            // Watchdog timer: If modal doesn't open or dismiss within 15 seconds, reset state
            const watchdog = setTimeout(() => {
                console.log("Watchdog timer triggered: resetting processing state after 15s");
                setProcessing(false);
                toast.dismiss('payment-process');
                safeResolve(false);
            }, 15000);

            const options: any = {
                key: keyId,
                name: "InstaPact",
                description: type === 'plan_upgrade' ? `Upgrade to ${planConfig?.name || itemId}` : 'Credit Purchase',
                image: "https://www.instapact.in/logo/logo.png",
                handler: async function (response: any) {
                    console.log("Payment successful, verifying...", response);
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
                           console.log("Verification successful");
                           await fulfillPurchase(type, itemId);
                           safeResolve(true);
                       } else {
                           throw new Error(verifyData.message || 'Verification failed');
                       }
                    } catch(e: any) {
                        console.error("Verification error:", e);
                        toast.error(e.message || "Payment verification failed", { id: 'payment-process' });
                        safeResolve(false);
                    } finally {
                        setProcessing(false);
                    }
                },
                prefill: {
                    name: user.displayName || '',
                    email: user.email || '',
                },
                theme: {
                    color: "#6366f1"
                },
                modal: {
                    ondismiss: function() {
                        console.log("Payment modal dismissed by user");
                        setProcessing(false);
                        toast.dismiss('payment-process');
                        toast.error("Payment cancelled");
                        safeResolve(false);
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

            console.log("Initializing Razorpay checkout...");
            const rzp1 = new window.Razorpay(options);
            
            rzp1.on('payment.failed', function (response: any){
                console.error("Payment failed:", response.error);
                toast.error(response.error.description || "Payment failed", { id: 'payment-process' });
                setProcessing(false);
                safeResolve(false);
            });

            rzp1.open();
        } catch (error: any) {
            console.error("Payment initialization error:", error);
            toast.error(error.message || "Payment initialization failed", { id: 'payment-process' });
            setProcessing(false);
            resolve(false);
        }
    });
  }

  return { processPayment, processing }
}
