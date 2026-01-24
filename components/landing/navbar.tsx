"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuLabel 
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, LayoutDashboard, PlusCircle, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";

export function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav 
      className="w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo />
        </Link>
        <div className="flex items-center space-x-4 sm:space-x-6">
          {!loading && (
            <>
              {user ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 outline-none ring-offset-2 hover:ring-2 hover:ring-indigo-100 shadow-sm hover:shadow-md group">
                        <img 
                          src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                          alt="User profile" 
                          className="w-10 h-10 rounded-full border border-slate-200 group-hover:border-indigo-200 transition-colors"
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
                        <Link href="/dashboard/profile?tab=plans" className="flex items-center w-full">
                          <Sparkles className="mr-3 h-4 w-4" />
                          <span>View Plans</span>
                        </Link>
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
                </>
              ) : (
                <>
                  <Link href="/auth" className="text-base font-medium text-slate-500 hover:text-slate-900 transition-colors hidden sm:block">
                    Login
                  </Link>
                  <Link href="/auth">
                    <Button size="lg" className="rounded-xl px-6 font-semibold shadow-lg shadow-indigo-200 bg-indigo-600 hover:bg-indigo-700 text-white border-none">Get Started</Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
