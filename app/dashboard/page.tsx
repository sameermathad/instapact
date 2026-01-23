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
import { Archive, LayoutDashboard } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'active' | 'archived'>('active')

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Your Agreements</h1>
           <p className="text-slate-500 mt-1">Manage and track your agreements.</p>
        </div>
        <Link href="/dashboard/new">
          <Button className="w-full sm:w-auto shadow-lg shadow-indigo-100">
            <Plus className="w-5 h-5 mr-2" /> Create New
          </Button>
        </Link>
      </div>

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
                <Link href="/dashboard/new">
                  <Button variant="outline" className="mt-4">
                    Create My First Agreement
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
