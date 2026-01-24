"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Zap, Building2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePayment } from "@/hooks/usePayment"
import { cn } from "@/lib/utils"

interface PlanSelectionProps {
  onSuccess?: () => void
  redirectPath?: string
}

export function PlanSelection({ onSuccess, redirectPath = '/dashboard' }: PlanSelectionProps) {
  const router = useRouter()
  const { processPayment, processing } = usePayment()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  const plans = [
    {
      id: 'single',
      name: 'One-time',
      description: 'Perfect for one-off agreements.',
      price: 99,
      unit: '/document',
      features: ['1 Document included', 'Lifetime access', 'Basic Templates'],
      buttonText: 'Buy 1 Document',
      variant: 'outline' as const,
    },
    {
      id: billingCycle === 'monthly' ? 'standard' : 'standard_annual',
      name: 'Standard',
      description: 'For freelancers & pros',
      price: billingCycle === 'monthly' ? 399 : 3999,
      unit: billingCycle === 'monthly' ? '/month' : '/year',
      features: ['10 Documents / month', 'Priority Support', 'Custom Branding'],
      buttonText: 'Upgrade to Standard',
      isPopular: true,
      accentColor: 'indigo',
    },
    {
      id: billingCycle === 'monthly' ? 'agency' : 'agency_annual',
      name: 'Agency',
      description: 'For teams & scale',
      price: billingCycle === 'monthly' ? 999 : 9999,
      unit: billingCycle === 'monthly' ? '/month' : '/year',
      features: ['Unlimited Documents', 'API Access', '24/7 Dedicated Support'],
      buttonText: 'Upgrade to Agency',
      accentColor: 'purple',
    }
  ]

  return (
    <>
        <div className="flex flex-col items-center mb-12">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                billingCycle === 'monthly' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                billingCycle === 'annual' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Annual
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none text-[10px] py-0 px-2">
                SAVE 20%
              </Badge>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={cn(
                "transition-all duration-300 relative",
                plan.isPopular ? "border-indigo-200 shadow-lg scale-105 z-10 bg-white" : "border-slate-200 shadow-sm hover:shadow-md"
              )}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-indigo-600 hover:bg-indigo-700">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className={cn(
                  "text-2xl font-bold flex items-center gap-2",
                  plan.accentColor === 'indigo' ? "text-indigo-900" : plan.accentColor === 'purple' ? "text-purple-900" : "text-slate-900"
                )}>
                  {plan.name} 
                  {plan.accentColor === 'indigo' && <Zap className="w-5 h-5 text-indigo-600" />}
                  {plan.accentColor === 'purple' && <Building2 className="w-5 h-5 text-purple-600" />}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className={cn(
                    "text-4xl font-black",
                    plan.accentColor === 'indigo' ? "text-indigo-900" : plan.accentColor === 'purple' ? "text-purple-900" : "text-slate-900"
                  )}>₹{plan.price.toLocaleString()}</span>
                  <span className="text-slate-500 font-medium ml-1">{plan.unit}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-slate-600">
                      <Check className={cn(
                        "w-4 h-4 mr-2",
                        plan.accentColor === 'indigo' ? "text-indigo-600" : plan.accentColor === 'purple' ? "text-purple-600" : "text-green-500"
                      )} /> 
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={async () => {
                    const planDetails = plans.find(p => p.id === plan.id) || plans[0]
                    const success = await processPayment('plan_upgrade', plan.id as any, planDetails.price)
                    if (success) {
                       if (onSuccess) onSuccess()
                       else router.push(redirectPath)
                    }
                  }} 
                  disabled={processing}
                  variant={plan.variant || 'default'}
                  className={cn(
                    "w-full font-bold h-11",
                    plan.isPopular && "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 shadow-lg",
                    plan.id.includes('agency') && "hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
                  )}
                >
                  {processing ? "Starting..." : plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
    </>
  )
}
