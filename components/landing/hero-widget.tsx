"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowRight } from "lucide-react"

export function HeroWidget() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Widget State
  const [clientName, setClientName] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Store in localStorage for the "onboarding wizard" effect
    const draftContract = {
      clientName,
      description,
      amount,
      currency,
      timestamp: Date.now()
    }
    
    // In a real app, we'd persist this more robustly or pass via query params
    if (typeof window !== 'undefined') {
      localStorage.setItem('instapact_draft', JSON.stringify(draftContract))
    }
    
    // Simulate delay for effect then redirect
    setTimeout(() => {
      // Redirect to dashboard (which would be protected)
      // or login if we had that flow set up perfectly
      router.push('/dashboard/new?from=hero')
    }, 800)
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl shadow-indigo-500/10 border-white/50 ring-1 ring-slate-900/5 backdrop-blur-sm bg-white/95 transform transition-all hover:scale-[1.01]">
      <CardHeader className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-100 py-6">
        <CardTitle className="text-2xl font-black text-slate-900">
          Draft in Seconds
        </CardTitle>
        <CardDescription className="text-base text-slate-500 font-medium">
          No sign-up required. Start now.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-8 pb-6 px-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="client-name" className="text-sm font-bold text-slate-700">Who is this for?</Label>
            <Input 
              id="client-name" 
              placeholder="e.g. Acme Corp" 
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              className="h-12 text-lg bg-slate-50 border-slate-200 focus:bg-white transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scope" className="text-sm font-bold text-slate-700">What are you doing?</Label>
            <Input 
              id="scope" 
              placeholder="Project Description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="h-12 text-lg bg-slate-50 border-slate-200 focus:bg-white transition-colors"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
             <div className="col-span-2 space-y-2">
                <Label htmlFor="amount" className="text-sm font-bold text-slate-700">How much?</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-500 font-medium text-lg">
                     {currency === 'USD' ? '$' : '₹'}
                  </span>
                  <Input 
                    id="amount" 
                    type="number" 
                    placeholder="0.00" 
                    className="pl-7 h-12 text-lg bg-slate-50 border-slate-200 focus:bg-white"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
             </div>
             <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="h-12 bg-slate-50 border-slate-200">
                    <SelectValue placeholder="USD" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                  </SelectContent>
                </Select>
             </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 mt-2 transition-transform active:scale-95"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <span className="flex items-center">
                Generate Agreement <ArrowRight className="ml-2 w-5 h-5" />
              </span>
            )}
          </Button>
          
          <p className="text-xs text-center text-slate-400 font-medium">
            Start your first Agreement for free. No credit card required.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
