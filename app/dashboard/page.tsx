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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Archive, LayoutDashboard, AlertCircle, Sparkles } from "lucide-react"
import { useUsageLimit } from "@/hooks/useUsageLimit"
import { PLANS } from "@/lib/config"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const { user } = useAuth()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'active' | 'archived'>('active')
  const { count, limit, isAtLimit, loading: usageLoading, plan } = useUsageLimit()

  useEffect(() => {
    async function fetchContracts() {
      if (user) {
        setLoading(true)
        try {
          const data = await getCreatorContracts(user.uid, view)
          setContracts(data)
        } catch (error) {
          console.error("Failed to fetch contracts", error)
        } finally {
          setLoading(false)
        }
      }
    }

    if (!user) return
    fetchContracts()
  }, [user, view])

  return (
    <div className="space-y-8">
      {/* Upgrade Shill Banner */}


      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Your Agreements</h1>
           <div className="flex items-center space-x-2 mt-1">
             <p className="text-slate-500">Manage and track your agreements.</p>
             {!usageLoading && limit !== Infinity && (
               <Badge variant="secondary" className={cn(
                 "ml-2 font-medium px-2 py-0 border",
                 isAtLimit ? "bg-red-50 text-red-700 border-red-100" : "bg-indigo-50 text-indigo-700 border-indigo-100"
               )}>
                 {count} / {limit} Used
               </Badge>
             )}
           </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {user && (
            <Link href={isAtLimit ? "/dashboard/upgrade" : "/dashboard/new"}>
              <Button 
                disabled={isAtLimit}
                className={cn(
                  "w-full sm:w-auto shadow-lg transition-all",
                  isAtLimit 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" 
                    : "shadow-indigo-100 bg-indigo-600 hover:bg-indigo-700"
                )}
              >
                {isAtLimit ? (
                  <>Limit Reached</>
                ) : (
                  <><Plus className="w-5 h-5 mr-2" /> Create New</>
                )}
              </Button>
            </Link>
          )}
          {isAtLimit && (
            <Link href="/dashboard/upgrade">
              <Button variant="outline" className="w-full sm:w-auto border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                <Sparkles className="w-4 h-4 mr-2" /> Upgrade
              </Button>
            </Link>
          )}
        </div>
      </div>

      {isAtLimit && (
        <div className="bg-indigo-600 rounded-xl p-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm sm:text-base">You've reached your agreement limit</p>
              <p className="text-indigo-100 text-xs sm:text-sm">Upgrade to Standard to create up to 10 agreements per month.</p>
            </div>
          </div>
          <Link href="/dashboard/upgrade">
            <Button size="sm" className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold whitespace-nowrap">
              Upgrade Now
            </Button>
          </Link>
        </div>
      )}

      <Tabs defaultValue="active" onValueChange={(val) => setView(val as 'active' | 'archived')} className="w-full">
        <TabsList className="bg-slate-100 p-1 mb-8">
          <TabsTrigger value="active" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Active
          </TabsTrigger>
          <TabsTrigger value="archived" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Archive className="w-4 h-4 mr-2" />
            Archived
          </TabsTrigger>
        </TabsList>

        <TabsContent value={view} className="mt-0 outline-none">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
              ))}
            </div>
          ) : contracts.length === 0 ? (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center space-y-4 bg-slate-50/50">
              <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                {view === 'active' ? <FileText className="w-8 h-8 text-slate-400" /> : <Archive className="w-8 h-8 text-slate-400" />}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                No {view} agreements yet
              </h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                {view === 'active' 
                  ? "Create your first agreement to stop scope creep and get professional agreements signed instantly."
                  : "Archived agreements will appear here. You can archive agreements from the menu on each card."}
              </p>
              {view === 'active' && (
                <Link href={isAtLimit ? "/dashboard/profile?tab=billing" : "/dashboard/new"}>
                  <Button variant="outline" className="mt-4" disabled={isAtLimit}>
                    {isAtLimit ? "Upgrade to Create" : "Create My First Agreement"}
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contracts.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
