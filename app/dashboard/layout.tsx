"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const router = useRouter()

  useEffect(() => {
    // Optional: Redirect logic if needed
  }, [user, loading, router])

  // Show Skeleton Loading state instead of full-screen spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
               {/* Static Logo always visible */}
              <span className="text-2xl font-black tracking-tighter text-slate-900">
                Insta<span className="text-indigo-600">Pact</span>
              </span>
              <Badge variant="secondary" className="hidden sm:inline-flex text-xs font-semibold bg-indigo-50 text-indigo-700 border-indigo-100 rounded-full px-2.5 py-0.5">Beta</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-right hidden sm:block space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="w-8 h-8 rounded-full" />
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
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">Sign in to InstaPact</h1>
            <p className="text-slate-500">
              Access your contracts, create new agreements, and track approvals.
            </p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <span className="text-2xl font-black tracking-tighter text-slate-900">
                Insta<span className="text-indigo-600">Pact</span>
              </span>
              <Badge variant="secondary" className="hidden sm:inline-flex text-xs font-semibold bg-indigo-50 text-indigo-700 border-indigo-100 rounded-full px-2.5 py-0.5">Beta</Badge>
            </Link>
          </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hidden sm:flex text-slate-600 hover:text-indigo-600 hover:bg-indigo-50">
                  Creator Dashboard
                </Button>
              </Link>
              
              <div className="text-sm text-right hidden sm:block">
                <p className="font-medium text-slate-900">{user.displayName}</p>
                <p className="text-slate-500 text-xs">{user.email}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center rounded-full hover:ring-2 hover:ring-indigo-100 transition-all outline-none">
                    <img 
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                      alt="User profile" 
                      className="w-8 h-8 rounded-full border border-slate-200"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <div className="px-2 py-1.5 sm:hidden">
                    <p className="text-sm font-medium text-slate-900 truncate">{user.displayName}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="sm:hidden">
                    <Link href="/dashboard" className="cursor-pointer">
                      Creator Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => logout()} 
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  >
                    Sign Out
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
