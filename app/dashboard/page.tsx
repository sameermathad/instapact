"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getCreatorContracts } from "@/lib/contracts"
import { Contract } from "@/types"
import { ContractCard } from "@/components/dashboard/contract-card"
import { Button } from "@/components/ui/button"
import { Plus, Loader2, FileText } from "lucide-react"
import Link from "next/link"

import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { user } = useAuth()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContracts() {
      if (user) {
        console.time("fetchContracts")
        console.log("Fetching contracts for user:", user.uid)
        try {
          const data = await getCreatorContracts(user.uid)
          console.log("Contracts fetched:", data.length)
          setContracts(data)
        } catch (error) {
          console.error("Failed to fetch contracts", error)
        } finally {
          console.timeEnd("fetchContracts")
          setLoading(false)
        }
      } else {
        console.log("User not ready yet for fetching contracts")
      }
    }

    if (!user) return
    fetchContracts()
  }, [user])

  // Removed full page loading check to allow header to render immediately
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Your Agreements</h1>
           <p className="text-slate-500 mt-1">Manage and track your agreements.</p>
        </div>
        <Link href="/dashboard/new">
          <Button className="shadow-lg shadow-indigo-100">
            <Plus className="w-5 h-5 mr-2" /> Create New
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
          ))}
        </div>
      ) : contracts.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center space-y-4 bg-slate-50/50">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No contracts yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Create your first contract to stop scope creep and get professional agreements signed instantly.
          </p>
          <Link href="/dashboard/new">
            <Button variant="outline" className="mt-4">
              Create My First Contract
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((contract) => (
            <ContractCard key={contract.id} contract={contract} />
          ))}
        </div>
      )}
    </div>
  )
}
