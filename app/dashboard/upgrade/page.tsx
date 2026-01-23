"use client"

import { Button } from "@/components/ui/button"
import { PlanSelection } from "@/components/pricing/plan-selection"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function UpgradePage() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/dashboard">
          <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-indigo-600 -ml-2 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Upgrade your Plan</h1>
        <p className="text-slate-500 max-w-2xl mt-2">
          Unlock more documents, features, and priority support.
        </p>
      </div>

      <PlanSelection />
    </div>
  )
}
