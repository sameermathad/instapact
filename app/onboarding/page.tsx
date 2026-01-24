"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { updateUserProfile } from "@/lib/user"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { PlanSelection } from "@/components/pricing/plan-selection"
import { Logo } from "@/components/logo"

export default function OnboardingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }
  
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
          <div className="flex justify-center mb-6">
            <Logo showBeta={false} />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Choose your plan
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Select the plan that best fits your needs. You can always change this later.
          </p>
        </div>

        <PlanSelection />

        <div className="pt-4 text-center">
          <button 
            onClick={handleFreePlan}
            className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors underline underline-offset-4"
          >
            I&apos;ll stick with the free tier for now
          </button>
        </div>
      </div>
    </div>
  )
}

