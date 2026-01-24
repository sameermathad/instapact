"use client"

import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Building2, User, Shield, Info, Settings, Bell, CreditCard, Palette, Signature as SignatureIcon, Lock, Stamp, CheckCircle2, Sparkles, AlertCircle, Calendar, Download, ArrowLeft, FileText } from 'lucide-react'
import { getUserProfile, updateUserProfile, UserProfile } from '@/lib/user'
import { cn } from '@/lib/utils'
import { useUsageLimit } from '@/hooks/useUsageLimit'
import { PLANS, PlanType } from '@/lib/config'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { usePayment, PaymentType } from '@/hooks/usePayment'
import { PaymentModal } from '@/components/payment-modal'
import { PlanSelection } from '@/components/pricing/plan-selection'

type SettingsTab = 'general' | 'legal' | 'branding' | 'payments' | 'plans' | 'billing' | 'notifications' | 'security'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Partial<UserProfile>>({})
  const [saving, setSaving] = useState(false)
  const [fetching, setFetching] = useState(true)
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab') as SettingsTab
  const [activeTab, setActiveTab] = useState<SettingsTab>(tabParam || 'general')
  const { count, limit, plan, isAtLimit, credits, loading: usageLoading } = useUsageLimit()
  const { processPayment, processing: paymentProcessing } = usePayment()
  const [paymentModal, setPaymentModal] = useState<{ open: boolean, type: PaymentType, itemId: string, amount: number, desc: string } | null>(null)
  
  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam)
    }
  }, [tabParam])
  
  // Helper functions for upgrades
  const getNextPlanName = (currentPlan: PlanType) => {
    switch (currentPlan) {
      case 'free': return 'Standard'
      case 'single': return 'Standard'
      case 'standard': return 'Agency'
      default: return 'Agency'
    }
  }

  const getNextPlanPrice = (currentPlan: PlanType) => {
    switch (currentPlan) {
      case 'free': return PLANS.standard.price
      case 'single': return PLANS.standard.price
      case 'standard': return PLANS.agency.price
      default: return PLANS.agency.price
    }
  }
  
  // Canvas Ref for Signature
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const data = await getUserProfile(user.uid)
        if (data) {
          setProfile(data)
        } else {
          setProfile({
            displayName: user.displayName || '',
            email: user.email || '',
            defaultCurrency: 'INR',
            notifyOnView: true,
            notifyOnSign: true,
          })
        }
        setFetching(false)
      }
      fetchProfile()
    }
  }, [user])

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!user) return
    
    setSaving(true)
    try {
      await updateUserProfile(user.uid, profile)
      toast.success("Settings updated successfully")
    } catch (error) {
      toast.error("Failed to update settings")
    } finally {
      setSaving(false)
    }
  }

  // Signature Pad Logic
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL()
      setProfile(prev => ({ ...prev, savedSignature: dataUrl }))
    }
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top

    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#000'
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const clearSignature = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.beginPath()
        setProfile(prev => ({ ...prev, savedSignature: undefined }))
      }
    }
  }

  if (fetching) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-8">
          <Skeleton className="h-[200px] w-48 hidden md:block" />
          <Skeleton className="h-[400px] flex-1" />
        </div>
      </div>
    )
  }

  const sidebarLinks: { id: SettingsTab; label: string; icon: any; locked?: boolean }[] = [
    { id: 'general', label: 'General', icon: User },
    { id: 'legal', label: 'Legal Entity', icon: Building2 },
    { id: 'branding', label: 'Branding', icon: Palette, locked: true },
    { id: 'payments', label: 'Payout Details', icon: CreditCard },
    { id: 'plans', label: 'Subscription Plans', icon: Sparkles },
    { id: 'billing', label: 'Billing & Usage', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <div className="space-y-6">
      <div>
        <Button 
          variant="ghost" 
          className="group pl-0 hover:bg-transparent hover:text-indigo-600 -ml-2 mb-2" 
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-heading">Settings</h1>
            <p className="text-slate-500">Global preferences for your Agreements.</p>
          </div>
          {['general', 'legal', 'payments', 'notifications', 'security'].includes(activeTab) && (
            <Button onClick={() => handleSave()} disabled={saving} className="w-full md:w-auto">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 space-y-1 bg-white p-2 rounded-xl border border-slate-200">
          {sidebarLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                activeTab === link.id 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center space-x-3">
                <link.icon className={cn("h-4 w-4", activeTab === link.id ? "text-indigo-600" : "text-slate-400")} />
                <span>{link.label}</span>
              </div>
              {link.locked && <Lock className="h-3 w-3 text-slate-300" />}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1 w-full">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6 max-w-2xl">
                <Card className="shadow-none border-slate-200">
                  <CardHeader>
                    <CardTitle>Display Identity</CardTitle>
                    <CardDescription>How you appear to your clients.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input 
                        id="displayName" 
                        value={profile.displayName || ''} 
                        onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                        placeholder="e.g. Sam M."
                      />
                      <p className="text-[10px] text-slate-400">What the client sees in the email invitation.</p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input 
                        id="jobTitle" 
                        value={profile.jobTitle || ''} 
                        onChange={(e) => setProfile({...profile, jobTitle: e.target.value})}
                        placeholder="e.g. Product Designer"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-none border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SignatureIcon className="h-5 w-5 text-indigo-600" />
                      Saved Signature
                    </CardTitle>
                    <CardDescription>Sign once, reuse across all agreements.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 relative group">
                      {profile.savedSignature ? (
                        <div className="flex flex-col items-center">
                          <img src={profile.savedSignature} alt="Saved Signature" className="max-h-24" />
                          <Button variant="ghost" size="sm" onClick={clearSignature} className="mt-2 text-slate-400 hover:text-red-500">
                            Clear and Sign Again
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <canvas
                            ref={canvasRef}
                            width={500}
                            height={150}
                            className="w-full bg-white rounded-lg border border-slate-200 cursor-crosshair touch-none"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseOut={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                          />
                          <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-medium">Draw your signature above</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Legal Entity Settings */}
            {activeTab === 'legal' && (
              <div className="max-w-2xl">
                <Card className="shadow-none border-slate-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Legal Information</CardTitle>
                        <CardDescription>Critical data for agreement "BETWEEN" clauses.</CardDescription>
                      </div>
                      <Stamp className="h-8 w-8 text-indigo-100" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 font-sans">
                    <div className="grid gap-2">
                      <Label htmlFor="legalName" className="flex items-center gap-1">
                        Legal Name <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        id="legalName" 
                        value={profile.legalName || ''} 
                        onChange={(e) => setProfile({...profile, legalName: e.target.value})}
                        placeholder="e.g. Vybetech Solutions Pvt Ltd"
                        className="font-medium"
                      />
                      <p className="text-[10px] text-slate-400">Full registered name of your entity or person.</p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="businessAddress" className="flex items-center gap-1">
                        Business Address <span className="text-red-500">*</span>
                      </Label>
                      <Textarea 
                        id="businessAddress" 
                        value={profile.businessAddress || ''} 
                        onChange={(e) => setProfile({...profile, businessAddress: e.target.value})}
                        placeholder="Full physical service address for jurisdiction"
                        className="min-h-[100px] resize-none"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="taxId">Tax ID (Optional)</Label>
                      <Input 
                        id="taxId" 
                        value={profile.taxId || ''} 
                        onChange={(e) => setProfile({...profile, taxId: e.target.value})}
                        placeholder="GSTIN, PAN, or EIN"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Payments Settings */}
            {activeTab === 'payments' && (
              <div className="max-w-2xl">
                <Card className="shadow-none border-slate-200 text-slate-400">
                  <CardHeader>
                    <CardTitle>Payout Details</CardTitle>
                    <CardDescription>How you'd like your clients to pay you.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="currency">Default Currency</Label>
                      <Select 
                        value={profile.defaultCurrency || 'INR'} 
                        onValueChange={(val: 'INR' | 'USD') => setProfile({...profile, defaultCurrency: val})}
                      >
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INR">INR (₹)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="paymentInstructions">Payment Details</Label>
                      <Textarea 
                        id="paymentInstructions" 
                        value={profile.paymentInstructions || ''} 
                        onChange={(e) => setProfile({...profile, paymentInstructions: e.target.value})}
                        placeholder="e.g. Bank Transfer to HDFC: XXXXXXX or UPI: sam@okhdfc"
                        className="min-h-[120px]"
                      />
                      <p className="text-[10px] text-slate-400 italic">Automatically injected into the "Payment Terms" section of new agreements.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Branding Settings (Upsell) */}
            {activeTab === 'branding' && (
              <div className="max-w-2xl">
              <Card className="shadow-none border-indigo-100 bg-indigo-50/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4">
                  <Lock className="h-12 w-12 text-indigo-50" />
                </div>
                <CardHeader>
                  <CardTitle className="text-indigo-900">Custom Branding</CardTitle>
                  <CardDescription>Remove InstaPact branding and use your own.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 opacity-60 pointer-events-none">
                  <div className="grid gap-2">
                    <Label>Brand Logo</Label>
                    <div className="h-20 w-40 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-white text-slate-400 text-xs">
                      No logo uploaded
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Primary Brand Color</Label>
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-indigo-600 border border-slate-200" />
                      <Input value="#6366f1" readOnly className="w-24" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-indigo-50 border-t border-indigo-100 p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
                    <div className="text-center sm:text-left">
                      <p className="text-sm font-bold text-indigo-900 leading-tight">Upgrade to Standard Plan</p>
                      <p className="text-[10px] text-indigo-700">Remove InstaPact watermarks and use custom logos.</p>
                    </div>
                    <Button 
                      onClick={() => setActiveTab('plans')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100"
                    >
                      See Pricing
                    </Button>
                  </div>
                </CardFooter>
              </Card>
              </div>
            )}

            {/* View Plans */}
            {activeTab === 'plans' && (
              <div className="space-y-6 max-w-5xl">
                <div className="text-left mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Subscription Plans</h2>
                  <p className="text-slate-500 mt-2">Choose the plan that fits your execution volume.</p>
                </div>
                <PlanSelection />
              </div>
            )}

            {/* Billing Settings */}
            {activeTab === 'billing' && (
              <div className="space-y-8 max-w-4xl">
                {/* Current Plan Details */}
                <Card className="shadow-none border-slate-200 overflow-hidden">
                  <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          Current Plan: <span className="text-indigo-600 font-bold ml-2">{PLANS[plan].name}</span>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          You are currently paying <span className="font-semibold text-slate-900">
                            {PLANS[plan].price === 0 
                              ? '₹0' 
                              : `₹${PLANS[plan].price}${PLANS[plan].isMonthly ? '/mo' : ''}`}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100 uppercase text-[10px]">
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {/* Usage Bar */}
                      {/* Usage Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {/* Monthly/Plan Usage */}
                         <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-2">
                               <Calendar className="w-4 h-4 text-slate-400" />
                               <span className="text-sm font-medium text-slate-700">
                                 {PLANS[plan].isMonthly ? 'Monthly Cycle' : 'Plan Usage'}
                               </span>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-2xl font-bold text-slate-900">
                                <span>{Math.min(count, limit)} <span className="text-sm font-normal text-slate-400">/ {limit === Infinity ? '∞' : limit}</span></span>
                              </div>
                              {limit !== Infinity && (
                                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div 
                                    className={cn("h-full transition-all duration-500", count >= limit ? "bg-orange-500" : "bg-indigo-600")}
                                    style={{ width: `${Math.min((count / limit) * 100, 100)}%` }}
                                  />
                                </div>
                              )}
                              <p className="text-[10px] text-slate-400">
                                  {PLANS[plan].isMonthly 
                                    ? "Resets on the 1st of next month." 
                                    : `${PLANS[plan].name} document limit.`}
                              </p>
                            </div>
                         </div>

                         {/* Extra Documents */}
                         <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-4 space-y-3 relative overflow-hidden">
                            <div className="flex items-center gap-2">
                               <CreditCard className="w-4 h-4 text-emerald-600" />
                               <span className="text-sm font-medium text-emerald-900">Extra Documents</span>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-2xl font-bold text-emerald-700">
                                {credits} <span className="text-sm font-normal text-emerald-600/80">available</span>
                              </div>
                              <p className="text-[10px] text-emerald-600">
                                Lifetime validity. Used when plan quota is exhausted.
                              </p>
                            </div>

                            <Button 
                              size="sm"
                              variant="outline"
                              className="w-full mt-2 bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                              onClick={() => setPaymentModal({ 
                                open: true, 
                                type: 'credit_purchase', 
                                itemId: '1', 
                                amount: 99, 
                                desc: '1 Extra Document' 
                              })}
                            >
                              Add 1 Document (₹99)
                            </Button>
                         </div>
                      </div>



                      {/* Upgrade Nudge */}
                      {plan !== 'agency' && (
                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 p-2 rounded-lg">
                              <Sparkles className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-indigo-900 text-sm">Need more documents?</h4>
                              <p className="text-xs text-indigo-700/80">Upgrade your plan or buy extra credits.</p>
                            </div>
                          </div>
                          <Button onClick={() => setActiveTab('plans')} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm w-full sm:w-auto">
                            Upgrade Now
                          </Button>
                        </div>
                      )}
                      
                      {plan === 'agency' && (
                         <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex items-center gap-3">
                            <div className="bg-emerald-100 p-2 rounded-full">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            </div>
                            <p className="text-sm text-emerald-800 font-medium">You are on the highest tier. Enjoy unlimited access!</p>
                         </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Billing History */}
                <Card className="shadow-none border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Billing History</CardTitle>
                    <CardDescription>View your past invoices and payment status.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Download</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium text-slate-500 italic" colSpan={5}>
                             No invoices found.
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="max-w-2xl">
                <Card className="shadow-none border-slate-200">
                  <CardHeader>
                    <CardTitle>Email Alerts</CardTitle>
                    <CardDescription>Stay updated on your agreement lifecycle.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Agreement Viewed</Label>
                        <p className="text-xs text-slate-500 italic">Get a high-intent signal when the client opens your link.</p>
                      </div>
                      <Switch 
                        checked={profile.notifyOnView} 
                        onCheckedChange={(val) => setProfile({...profile, notifyOnView: val})} 
                      />
                    </div>
                    <Separator className="bg-slate-100" />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Agreement Signed</Label>
                        <p className="text-xs text-slate-500 italic">Receive confirmation the moment a deal is finalized.</p>
                      </div>
                      <Switch 
                        checked={profile.notifyOnSign} 
                        onCheckedChange={(val) => setProfile({...profile, notifyOnSign: val})} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="max-w-2xl">
                <Card className="shadow-none border-slate-200 bg-slate-50/50">
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>Management of your login credentials.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-3">
                      <Info className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Authentication via Google</p>
                        <p className="text-xs text-slate-500">
                          Your password and security settings are managed by Google. 
                          Visit your <a href="https://myaccount.google.com/security" target="_blank" className="text-indigo-600 hover:underline">Google Security</a> portal to change passwords or enable 2FA.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

          </form>
        </div>
      </div>

      {paymentModal && (
        <PaymentModal 
          isOpen={paymentModal.open}
          onClose={() => setPaymentModal(null)}
          onConfirm={async () => {
             await processPayment(paymentModal.type, paymentModal.itemId, paymentModal.amount)
          }}
          amount={paymentModal.amount}
          currency={profile.defaultCurrency || 'INR'}
          provider={profile.defaultCurrency === 'USD' ? 'lemonsqueezy' : 'razorpay'}
          itemDescription={paymentModal.desc}
        />
      )}
    </div>
  )
}

function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px w-full", className)} />
}

