"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuLabel 
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User as UserIcon, LayoutDashboard, CreditCard, HelpCircle, PlusCircle, Sparkles } from "lucide-react";
import { useUsageLimit } from "@/hooks/useUsageLimit";
import { getUserProfile } from "@/lib/user";
import { Logo } from "@/components/logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter()

  useEffect(() => {
    // 1. Auth Protection
    if (!loading && !user) {
      router.push('/auth');
      return;
    }

    // 2. Profile/Onboarding Check
    async function checkProfile() {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid)
          if (!profile || !profile.plan) {
             router.push('/onboarding')
          }
        } catch (e) {
          console.error("Error checking profile", e)
        }
      }
    }
    
    if (!loading && user) {
      checkProfile()
    }
  }, [user, loading, router])

  // Single source of truth for loading/auth-pending states
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-white border-b border-slate-200 h-20 flex items-center px-4 sm:px-6 lg:px-8">
           <Logo />
        </header>
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto" />
            <p className="text-slate-500 font-medium">Authorizing access...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
              <Logo />
            </Link>
          </div>
            <div className="flex items-center space-x-4 sm:space-x-6">


               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 outline-none ring-offset-2 hover:ring-2 hover:ring-indigo-100 shadow-sm hover:shadow-md group">
                    <img 
                      src={user.photoURL || user.providerData?.[0]?.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                      alt="User profile" 
                      className="w-10 h-10 rounded-full border border-slate-200 group-hover:border-indigo-200 transition-colors"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 mt-2">
                  <DropdownMenuLabel className="font-normal px-2 py-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold text-slate-900 leading-none">{user.displayName}</p>
                      <p className="text-xs text-slate-500 leading-none">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer py-2.5 rounded-lg focus:bg-indigo-50 focus:text-indigo-700">
                    <Link href="/dashboard/new" className="flex items-center w-full font-medium">
                      <PlusCircle className="mr-3 h-4 w-4" />
                      <span>Create New</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer py-2.5 rounded-lg focus:bg-indigo-50 focus:text-indigo-700">
                    <Link href="/dashboard" className="flex items-center w-full">
                      <LayoutDashboard className="mr-3 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer py-2.5 rounded-lg focus:bg-indigo-50 focus:text-indigo-700">
                    <Link href="/dashboard/profile" className="flex items-center w-full">
                      <Settings className="mr-3 h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer py-2.5 rounded-lg focus:bg-indigo-50 focus:text-indigo-700">
                    <Link href="/dashboard/profile?tab=billing" className="flex items-center w-full">
                      <CreditCard className="mr-3 h-4 w-4" />
                      <span>Plan & Billing</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer py-2.5 rounded-lg focus:bg-indigo-50 focus:text-indigo-700 group">
                    <div className="flex items-center w-full">
                      <HelpCircle className="mr-3 h-4 w-4 text-slate-400 group-focus:text-indigo-600" />
                      <span>Help & Support</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => logout()} 
                    className="flex items-center text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer py-2.5 rounded-lg"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}


