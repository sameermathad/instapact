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

export function usePayment(): UsePaymentReturn {
  const { user } = useAuth()
  const [processing, setProcessing] = useState(false)

  const processPayment = async (type: PaymentType, itemId: string, amount: number): Promise<boolean> => {
    if (!user) {
      toast.error("You must be logged in to make a purchase")
      return false
    }

    setProcessing(true)
    
    // Simulate payment delay
    // In a real app, this would involve Stripe/LemonSqueezy initialization
    const paymentPromise = new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Mock 90% success rate
        // Mock 100% success rate for testing
        resolve()
      }, 2000)
    })

    try {
      toast.loading("Processing payment...", { id: 'payment-process' })
      await paymentPromise
      
      // Update User Profile based on purchase
      const currentProfile = await getUserProfile(user.uid)
      const updates: any = {}

      if (type === 'plan_upgrade') {
        updates.plan = itemId as PlanType
        
        // Simulate subscription start
        const now = new Date()
        const oneMonthLater = new Date(now)
        oneMonthLater.setMonth(now.getMonth() + 1)
        
        updates.subscriptionStatus = 'active'
        updates.subscriptionId = 'sub_mock_' + Math.random().toString(36).substring(7)
        updates.currentPeriodStart = now
        updates.currentPeriodEnd = oneMonthLater
        
        toast.success(`Successfully upgraded to ${PLANS[itemId as PlanType].name} plan!`, { id: 'payment-process' })
      } else if (type === 'credit_purchase') {
        const currentCredits = currentProfile?.credits || 0
        // parsed mock logic: itemId could be "1_credit", "5_credits" etc if we had packages
        // for now assuming itemId is number of credits stringified or just fixed logic
        const creditsToAdd = parseInt(itemId) || 1
        updates.credits = currentCredits + creditsToAdd
        toast.success(`Successfully added ${creditsToAdd} credit${creditsToAdd > 1 ? 's' : ''}!`, { id: 'payment-process' })
      }

      await updateUserProfile(user.uid, updates)
      return true
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("Payment failed. Please try again.", { id: 'payment-process' })
      return false
    } finally {
      setProcessing(false)
    }
  }

  return { processPayment, processing }
}
