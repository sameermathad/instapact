"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Check, Sparkles, Zap, Building2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePayment } from "@/hooks/usePayment"
import { PaymentModal } from "@/components/payment-modal"
import { toast } from "sonner"

interface PlanSelectionProps {
  onSuccess?: () => void
  redirectPath?: string
}

export function PlanSelection({ onSuccess, redirectPath = '/dashboard' }: PlanSelectionProps) {
  const router = useRouter()
  const { processPayment, processing } = usePayment()
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'standard' | 'agency' | null>(null)

  return (
    <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Single Document (Pay-as-you-go) */}
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow relative">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-900">One-time</CardTitle>
              <CardDescription>Perfect for one-off agreements.</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-black text-slate-900">₹99</span>
                <span className="text-slate-500">/document</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-slate-600">
                  <Check className="w-4 h-4 mr-2 text-green-500" /> 1 Document included
                </li>
                <li className="flex items-center text-sm text-slate-600">
                  <Check className="w-4 h-4 mr-2 text-green-500" /> Lifetime access
                </li>
                <li className="flex items-center text-sm text-slate-600">
                  <Check className="w-4 h-4 mr-2 text-green-500" /> Basic Templates
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                 onClick={() => setSelectedPlan('single')} 
                 variant="outline" 
                 className="w-full"
              >
                Buy 1 Document
              </Button>
            </CardFooter>
          </Card>

          {/* Standard Plan */}
          <Card className="border-indigo-200 shadow-lg scale-105 relative bg-white z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Badge className="bg-indigo-600 hover:bg-indigo-700">Most Popular</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
                Standard <Zap className="w-5 h-5 text-indigo-600" />
              </CardTitle>
              <CardDescription>For freelancers & pros</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-black text-indigo-900">₹399</span>
                <span className="text-slate-500">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-slate-600">
                  <Check className="w-4 h-4 mr-2 text-indigo-600" /> <strong>10 Documents</strong> / month
                </li>
                <li className="flex items-center text-sm text-slate-600">
                  <Check className="w-4 h-4 mr-2 text-indigo-600" /> Priority Support
                </li>
                <li className="flex items-center text-sm text-slate-600">
                  <Check className="w-4 h-4 mr-2 text-indigo-600" /> Custom Branding
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => setSelectedPlan('standard')} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 shadow-lg"
              >
                Upgrade to Standard
              </Button>
            </CardFooter>
          </Card>

          {/* Agency Plan */}
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                Agency <Building2 className="w-5 h-5 text-purple-600" />
              </CardTitle>
              <CardDescription>For teams & scale</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-black text-slate-900">₹999</span>
                <span className="text-slate-500">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-slate-600">
                  <Check className="w-4 h-4 mr-2 text-purple-600" /> <strong>Unlimited</strong> Documents
                </li>
                <li className="flex items-center text-sm text-slate-600">
                  <Check className="w-4 h-4 mr-2 text-purple-600" /> API Access
                </li>
                <li className="flex items-center text-sm text-slate-600">
                  <Check className="w-4 h-4 mr-2 text-purple-600" /> 24/7 Dedicated Support
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setSelectedPlan('agency')} variant="outline" className="w-full hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200">
                Upgrade to Agency
              </Button>
            </CardFooter>
          </Card>
        </div>

      {selectedPlan && (
        <PaymentModal
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onConfirm={async () => {
            const amount = selectedPlan === 'single' ? 99 : (selectedPlan === 'standard' ? 399 : 999)
            // For Single plan, we can treat it as a plan_upgrade to 'single'
            const success = await processPayment('plan_upgrade', selectedPlan, amount)
            if (success) {
               if (onSuccess) onSuccess()
               else router.push(redirectPath)
            }
          }}
          amount={selectedPlan === 'single' ? 99 : (selectedPlan === 'standard' ? 399 : 999)}
          currency="INR"
          provider="razorpay" 
          itemDescription={`${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan`}
        />
      )}
    </>
  )
}
