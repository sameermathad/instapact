"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { createContract } from "@/lib/contracts"
import { TEMPLATES, getTemplate } from "@/lib/templates"
import { ContractMeta, Currency, TemplateType } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowLeft, ArrowRight, Target, Shield, Briefcase, FileText, User, Sparkles, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { useUsageLimit } from "@/hooks/useUsageLimit"
import { PLANS } from "@/lib/config"

export default function NewContractPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>}>
      <NewContractContent />
    </Suspense>
  )
}

function NewContractContent() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const { isAtLimit, loading: usageLoading } = useUsageLimit()
  
  // Use null as default to show selection screen
  const [activeTemplate, setActiveTemplate] = useState<TemplateType | null>(null)
  
  // Generic form state holder
  const [formData, setFormData] = useState<Record<string, any>>({
    currency: 'USD',
    paymentSchedule: 'upfront'
  })

  // Load draft from localStorage on mount if "from=hero"
  useEffect(() => {
    // Handle Template Type from URL
    const typeParam = searchParams.get('type')
    if (typeParam && ['SCOPE', 'NDA', 'DEAL'].includes(typeParam)) {
       setActiveTemplate(typeParam as TemplateType)
    }

    if (searchParams.get('from') === 'hero') {
      const draft = localStorage.getItem('instapact_draft')
      if (draft) {
        try {
          const parsed = JSON.parse(draft)
          setFormData(prev => ({
            ...prev,
            clientName: parsed.clientName,
            description: parsed.description, // Generic description used for Scope or NDA
            newDeliverables: parsed.description, // Map to newDeliverables for SCOPE
            amount: parsed.amount,
            currency: parsed.currency || 'USD'
          }))
          // Clear it so we don't reload it next time unnecessarily
          localStorage.removeItem('instapact_draft')
        } catch (e) {
          console.error("Failed to parse draft", e)
        }
      }
    }
  }, [searchParams])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTemplateSelect = (type: TemplateType) => {
    setActiveTemplate(type)
    // Update URL without refreshing to support deep linking / sharing if needed (optional)
    // router.push(`/dashboard/new?type=${type}`, { scroll: false })
  }

  const handleBackToSelection = () => {
    setActiveTemplate(null)
    router.push('/dashboard/new') // Clean URL
  }

  if (usageLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-slate-500 text-sm">Checking your usage limits...</p>
      </div>
    )
  }

  if (isAtLimit) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-indigo-600" />
          </div>
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-4">Agreement Limit Reached</h1>
        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
          You've used your free agreement. To create more legally binding agreements and access premium features, please upgrade your plan.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <Card className="border-indigo-100 bg-indigo-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Standard</CardTitle>
              <CardDescription>Perfect for regular use</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">₹{PLANS.standard.price}<span className="text-sm font-normal text-slate-500">/mo</span></p>
              <ul className="text-sm text-left mt-4 space-y-2 text-slate-600">
                <li className="flex items-center"><Sparkles className="w-3 h-3 mr-2 text-indigo-500" /> 10 agreements / month</li>
                <li className="flex items-center"><Sparkles className="w-3 h-3 mr-2 text-indigo-500" /> No watermarks</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/profile?tab=plans" className="w-full">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Upgrade to Standard</Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Agency</CardTitle>
              <CardDescription>For power users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">₹{PLANS.agency.price}<span className="text-sm font-normal text-slate-500">/mo</span></p>
              <ul className="text-sm text-left mt-4 space-y-2 text-slate-600">
                <li className="flex items-center"><Sparkles className="w-3 h-3 mr-2 text-indigo-500" /> Unlimited agreements</li>
                <li className="flex items-center"><Sparkles className="w-3 h-3 mr-2 text-indigo-500" /> Custom branding</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/profile?tab=plans" className="w-full">
                <Button variant="outline" className="w-full">View Agency Plan</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 font-medium transition-colors">
          <div className="flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </div>
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error("You must be logged in")
      return
    }
    if (!activeTemplate) return
    if (isAtLimit) {
      toast.error("You have reached your agreement limit")
      return
    }

    setLoading(true)
    try {
      // Construct meta based on template and form data
      const templateDef = getTemplate(activeTemplate)
      
      // Validate required fields
      const missing = templateDef.fields
        .filter(f => f.required && !formData[f.name])
        .map(f => f.label)
      
      if (missing.length > 0) {
        toast.error(`Missing required fields: ${missing.join(', ')}`)
        setLoading(false)
        return
      }

      // Prepare meta object with null instead of undefined for Firestore compatibility
      // OR use conditional spreading to avoid the keys entirely
      const meta: ContractMeta = {
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        currency: formData.currency as Currency,
        description: formData.description || null,
        
        // Use spread for optional numeric/complex fields to avoid 'undefined'
        ...(formData.amount ? { amount: Number(formData.amount) } : {}),
        
        // Scope Specific
        originalProjectRef: formData.originalProjectRef || null,
        newDeliverables: formData.newDeliverables || null,
        ...(formData.additionalFee ? { additionalFee: Number(formData.additionalFee) } : {}),
        
        // Deal Specific
        deliverablesList: formData.deliverablesList ? formData.deliverablesList.split('\n').filter(Boolean) : null,
        paymentSchedule: formData.paymentSchedule || null
      }
      
      // Map amount for SCOPE from additionalFee if generic amount was used
      if (activeTemplate === 'SCOPE' && formData.amount && !formData.additionalFee) {
         meta.additionalFee = Number(formData.amount)
      }
      
      // Map description for SCOPE if used
      if (activeTemplate === 'SCOPE' && formData.description && !formData.newDeliverables) {
         meta.newDeliverables = formData.description
      }

      // Sanitize: Firestore hates 'undefined', remove any remaining if any
      const sanitizedMeta = JSON.parse(JSON.stringify(meta))
      
      console.log("Submitting agreement payload:", {
        uid: user.uid,
        template: activeTemplate,
        meta: sanitizedMeta
      })

      const contract = await createContract(
        user.uid,
        user.displayName || 'Creator',
        user.email || '',
        activeTemplate,
        sanitizedMeta
      )
      
      console.log("Agreement created successfully:", contract.id)

      toast.success("Agreement created successfully!")
      router.push('/dashboard')
      
    } catch (error) {
      console.error("Agreement creation failed:", error)
      toast.error("Failed to create agreement")
    } finally {
      setLoading(false)
    }
  }

  const renderField = (field: any) => {
    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Textarea
              id={field.name}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className="resize-none h-32"
            />
          </div>
        )
      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label>{field.label}</Label>
            <Select 
              value={formData[field.name] || ''} 
              onValueChange={(val) => handleInputChange(field.name, val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((opt: any) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      default: // text, email, number
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            />
          </div>
        )
    }
  }

  // Define icons/colors for templates
  const getTemplateVisuals = (id: string) => {
    switch(id) {
        case 'SCOPE': return { icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' }
        case 'NDA': return { icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' }
        case 'DEAL': return { icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' }
        default: return { icon: FileText, color: 'text-slate-600', bg: 'bg-slate-50' }
    }
  }

  // --- Render Selection Screen ---
  if (!activeTemplate) {
    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="mb-8">
                <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 flex items-center mb-4 text-sm font-medium transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Create New Agreement</h1>
                <p className="text-slate-500">Choose an agreement type to get started. All templates are legally vetted.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.values(TEMPLATES).map((template) => {
                    const visual = getTemplateVisuals(template.id)
                    const Icon = visual.icon
                    return (
                        <div 
                            key={template.id}
                            onClick={() => handleTemplateSelect(template.id)}
                            className="group relative bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                        >
                             <div className={`absolute top-0 right-0 p-4 opacity-50`}>
                                <Icon className={`w-24 h-24 ${visual.color} opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12`} />
                             </div>

                            <div className={`w-12 h-12 ${visual.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <Icon className={`w-6 h-6 ${visual.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{template.name}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                {template.description}
                            </p>
                            <div className="flex items-center text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                Select Template <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </div>
                        </div>
                    )
                })}
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-full">
                        <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900">Custom Agreement?</h4>
                        <p className="text-sm text-slate-500">Need something specific? We can help you draft a custom agreement.</p>
                    </div>
                </div>
                 <Button variant="outline">Contact Support</Button>
            </div>
        </div>
    )
  }

  // --- Render Form Screen ---
  const currentTemplateDef = getTemplate(activeTemplate)

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center space-x-4 mb-6">
        <Button onClick={handleBackToSelection} variant="ghost" size="sm" className="pl-0 text-slate-500 hover:text-slate-900">
           <ArrowLeft className="h-4 w-4 mr-1" /> Back to Templates
        </Button>
      </div>
      
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
         <div>
            <h1 className="text-2xl font-bold text-slate-900">Create New {currentTemplateDef.name}</h1>
            <p className="text-slate-500 text-sm mt-1">{currentTemplateDef.description}</p>
         </div>
      </div>

      <Card className="border-indigo-100 shadow-sm overflow-hidden">
        <CardContent className="pt-8 space-y-8">
            <form id="contract-form" onSubmit={handleSubmit} className="space-y-6">
                {currentTemplateDef.fields.map(renderField)}
            </form>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t border-slate-100 flex justify-between py-6 px-8">
            <Button variant="ghost" onClick={handleBackToSelection}>Cancel</Button>
            <Button 
            type="submit" 
            form="contract-form"
            disabled={loading}
            className="min-w-[140px]"
            >
            {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <>
                Create Agreement <ArrowRight className="ml-2 h-4 w-4" />
                </>
            )}
            </Button>
        </CardFooter>
      </Card>
      
      {/* Preview hint */}
      <div className="text-center text-xs text-slate-400">
        <p>A legally binding PDF will be generated upon signing.</p>
      </div>
    </div>
  )
}
