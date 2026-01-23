"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { updateUserProfile } from "@/lib/user"
import { toast } from "sonner"
import { PlanSelection } from "@/components/pricing/plan-selection"

export default function OnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  const handleFreePlan = async () => {
    if (!user) return
    try {
      await updateUserProfile(user.uid, { plan: 'free' })
      toast.success("Welcome to InstaPact!")
      router.push('/dashboard')
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Choose your plan
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Select the plan that best fits your needs. You can always change this later.
          </p>
        </div>

        <PlanSelection />
      </div>
    </div>
  )
}

