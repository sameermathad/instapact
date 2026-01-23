"use client"

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { 
  Building2, 
  User, 
  Shield, 
  Info, 
  Settings, 
  Bell, 
  CreditCard,
  Palette,
  Signature as SignatureIcon,
  Lock,
  Stamp
} from 'lucide-react'
import { getUserProfile, updateUserProfile, UserProfile } from '@/lib/user'
import { cn } from '@/lib/utils'

type SettingsTab = 'general' | 'legal' | 'branding' | 'payments' | 'billing' | 'notifications' | 'security'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Partial<UserProfile>>({})
  const [saving, setSaving] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  
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
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'billing', label: 'Plan & Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-heading">Settings</h1>
          <p className="text-slate-500">Global preferences for your contracts.</p>
        </div>
        <Button onClick={() => handleSave()} disabled={saving} className="w-full md:w-auto">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
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
        <div className="flex-1 max-w-2xl w-full">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
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
                    <CardDescription>Sign once, reuse across all contracts.</CardDescription>
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
              <Card className="shadow-none border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Legal Information</CardTitle>
                      <CardDescription>Critical data for contract "BETWEEN" clauses.</CardDescription>
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
            )}

            {/* Payments Settings */}
            {activeTab === 'payments' && (
              <Card className="shadow-none border-slate-200 text-slate-400">
                <CardHeader>
                  <CardTitle>Payment Instructions</CardTitle>
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
                    <p className="text-[10px] text-slate-400 italic">Automatically injected into the "Payment Terms" section of new contracts.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Branding Settings (Upsell) */}
            {activeTab === 'branding' && (
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
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100">
                      See Pricing
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )}

            {/* Billing Settings */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <Card className="shadow-none border-slate-200">
                  <CardHeader>
                    <CardTitle>Active Subscription</CardTitle>
                    <CardDescription>You are currently on the free tier.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div>
                        <p className="text-sm font-bold text-slate-900 capitalize">{profile.plan || 'Free'} Plan</p>
                        <p className="text-xs text-slate-500">Perfect for getting started with professional agreements.</p>
                      </div>
                      <div className="px-2 py-1 text-[10px] font-bold bg-white border border-slate-200 text-slate-700 rounded-full uppercase tracking-wider">Active</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                       <div className="p-3 border border-slate-100 rounded-lg bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Agreements Signatures</p>
                          <p className="text-xl font-black text-slate-900">Unlimited</p>
                          <p className="text-[9px] text-emerald-600 font-medium">Included in Free</p>
                       </div>
                       <div className="p-3 border border-slate-100 rounded-lg bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Custom Branding</p>
                          <p className="text-xl font-black text-slate-900 italic opacity-50">Locked</p>
                          <p className="text-[9px] text-red-500 font-medium">Standard Plan only</p>
                       </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-none border-indigo-100 bg-indigo-50/20">
                  <CardHeader>
                    <CardTitle className="text-indigo-900">Upgrade to Standard</CardTitle>
                    <CardDescription className="text-indigo-700/70">Unlock professional features for your agency.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {[
                        "Remove InstaPact branding from contracts",
                        "Upload custom agency logo",
                        "Custom brand colors for signing pages",
                        "Priority customer support"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center text-sm text-indigo-900/80">
                          <span className="h-4 w-4 rounded-full bg-indigo-100 flex items-center justify-center mr-2 shrink-0">
                            <span className="h-2 w-2 rounded-full bg-indigo-600" />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100">
                      Upgrade for $19/mo
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <Card className="shadow-none border-slate-200">
                <CardHeader>
                  <CardTitle>Email Alerts</CardTitle>
                  <CardDescription>Stay updated on your contract lifecycle.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Contract Viewed</Label>
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
                      <Label className="text-base">Contract Signed</Label>
                      <p className="text-xs text-slate-500 italic">Receive confirmation the moment a deal is finalized.</p>
                    </div>
                    <Switch 
                      checked={profile.notifyOnSign} 
                      onCheckedChange={(val) => setProfile({...profile, notifyOnSign: val})} 
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security */}
            {activeTab === 'security' && (
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
            )}

          </form>
        </div>
      </div>
    </div>
  )
}

function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px w-full", className)} />
}
