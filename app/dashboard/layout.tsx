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
import { usePayment } from "@/hooks/usePayment";
import { useState } from "react";
import { PaymentModal } from "@/components/payment-modal";
import { getUserProfile } from "@/lib/user";
import { Logo } from "@/components/logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const router = useRouter()

  useEffect(() => {
    // Check if user has a profile/plan
    async function checkProfile() {
      if (user) {
        // If we are already on the onboarding page, don't redirect (but this logic is in dashboard layout so it shouldn't trigger?)
        // Wait, dashboard layout wraps /dashboard/*
        
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

  // Show Skeleton Loading state instead of full-screen spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
               {/* Static Logo always visible */}
               <Logo />
            </div>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="text-sm text-right hidden sm:block space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           {/* Content Skeleton */}
           <div className="space-y-6">
             <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-32" />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-xl" />
                ))}
             </div>
           </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center space-y-6">
          <div className="space-y-4 flex flex-col items-center">
            <Logo showBeta={false} />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">Sign in to InstaPact</h1>
              <p className="text-slate-500">
                Access your contracts, create new agreements, and track approvals.
              </p>
            </div>
          </div>
          <Button 
            onClick={() => signInWithGoogle()} 
            size="lg" 
            className="w-full bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.-1.19-.58z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
          <p className="text-xs text-slate-400">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Logo />
            </Link>
          </div>
            <div className="flex items-center space-x-4 sm:space-x-6">
               {/* Upgrade Button - Persistent "Shill" */}
               {!loading && user && (
                 <UpgradeButtonShim />
               )}

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
                    <Link href="/dashboard/upgrade" className="flex items-center w-full">
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

function UpgradeButtonShim() {
  const { plan, loading } = useUsageLimit()
  const { user } = useAuth()
  
  if (loading || !plan || plan === 'agency') return null

  return (
    <Link href="/dashboard/upgrade">
      <Button 
        size="sm" 
        className="hidden sm:inline-flex bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-md"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Upgrade Plan
      </Button>
    </Link>
  )
}
