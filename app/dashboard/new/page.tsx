"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { createContract, getContract, updateContractFields } from "@/lib/contracts"
import { TEMPLATES, getTemplate } from "@/lib/templates"
import { ContractMeta, Currency, TemplateType } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2, ArrowLeft, ArrowRight, Target, Shield, Briefcase, FileText, User, Sparkles, Edit3, Check, MessageSquare } from "lucide-react"
import { Contract } from "@/types"
import { toast } from "sonner"
import Link from "next/link"
import { useUsageLimit } from "@/hooks/useUsageLimit"
import { PLANS } from "@/lib/config"
import { getUserProfile, UserProfile } from "@/lib/user"

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
  const { isAtLimit, loading: usageLoading, plan } = useUsageLimit()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  
  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(setUserProfile)
    }
  }, [user])
  
  const [step, setStep] = useState<'template' | 'form'>('template')
  const [activeTemplate, setActiveTemplate] = useState<TemplateType | null>(null)
  const [editableLegalText, setEditableLegalText] = useState<string>('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [clientFeedback, setClientFeedback] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<Record<string, any>>({
    currency: 'USD',
    paymentSchedule: 'upfront'
  })

  useEffect(() => {
    const typeParam = searchParams.get('type')
    const editParam = searchParams.get('edit')

    if (editParam) {
      setEditingId(editParam)
      const fetchEdit = async () => {
        const c = await getContract(editParam)
        if (c && c.creatorId === user?.uid) {
           setActiveTemplate(c.template)
           const meta = { ...c.meta } as any
           if (Array.isArray(meta.deliverablesList)) {
             meta.deliverablesList = meta.deliverablesList.join('\n')
           }
           setFormData(meta)
           setClientFeedback(c.clientFeedback || null)
           setEditableLegalText(c.legalText || getTemplate(c.template).legalText)
           setStep('form')
        }
      }
      fetchEdit()
    } else if (typeParam && ['SCOPE', 'NDA', 'DEAL'].includes(typeParam)) {
       setActiveTemplate(typeParam as TemplateType)
    }

    if (searchParams.get('from') === 'hero') {
      const draft = localStorage.getItem('instapact_draft')
      if (draft) {
        try {
          const parsed = JSON.parse(draft)
          setFormData(prev => ({
            ...prev,
            documentTitle: "Freelance Service Agreement",
            clientName: parsed.clientName,
            description: parsed.description,
            newDeliverables: parsed.description,
            amount: parsed.amount,
            currency: parsed.currency || 'USD'
          }))
          
          // Auto-select template and go to form view
          setActiveTemplate('DEAL') // Default to Freelance Service Agreement
          setStep('form')
          const template = getTemplate('DEAL')
          setEditableLegalText(template.legalText)
          
          localStorage.removeItem('instapact_draft')
        } catch (e) {
          console.error("Failed to parse draft", e)
        }
      }
    }
  }, [searchParams, user])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTemplateSelect = (type: TemplateType) => {
    setActiveTemplate(type)
    setStep('form')
    const template = getTemplate(type)
    setEditableLegalText(template.legalText)
    setFormData(prev => ({
      ...prev,
      documentTitle: template.name
    }))
  }

  const handleBackToSelection = () => {
    if (editingId) {
      router.push(`/s/${editingId}`)
      return
    }
    setActiveTemplate(null)
    setStep('template')
    router.push('/dashboard/new')
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!user) {
      toast.error("You must be logged in")
      return
    }
    if (!activeTemplate) return
    if (isAtLimit && !editingId) {
      toast.error("You have reached your agreement limit")
      return
    }

    setLoading(true)
    try {
      const templateDef = getTemplate(activeTemplate)
      const missing = templateDef.fields
        .filter(f => f.required && !formData[f.name])
        .map(f => f.label)
      
      if (missing.length > 0) {
        toast.error(`Missing: ${missing.join(', ')}`)
        setLoading(false)
        return
      }

      const meta: ContractMeta = {
        documentTitle: formData.documentTitle || templateDef.name,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        currency: formData.currency as Currency,
        description: formData.description || null,
        ...(formData.amount ? { amount: Number(formData.amount) } : {}),
        originalProjectRef: formData.originalProjectRef || null,
        newDeliverables: formData.newDeliverables || null,
        ...(formData.additionalFee ? { additionalFee: Number(formData.additionalFee) } : {}),
        deliverablesList: (typeof formData.deliverablesList === 'string') 
            ? formData.deliverablesList.split('\n').filter(Boolean) 
            : formData.deliverablesList || null,
        paymentSchedule: formData.paymentSchedule || null
      }
      
      if (activeTemplate === 'SCOPE' && formData.amount && !formData.additionalFee) {
         meta.additionalFee = Number(formData.amount)
      }
      
      if (activeTemplate === 'SCOPE' && formData.description && !formData.newDeliverables) {
         meta.newDeliverables = formData.description
      }

      const sanitizedMeta = JSON.parse(JSON.stringify(meta))
      let redirectId = editingId;

      if (editingId) {
        await updateContractFields(editingId, sanitizedMeta, editableLegalText)
        toast.success("Agreement updated!")
      } else {
        const rawBranding = (plan === 'standard' || plan === 'agency' || plan === 'standard_annual' || plan === 'agency_annual') 
          ? { logo: userProfile?.brandLogo, color: userProfile?.brandColor } 
          : undefined;

        // Sanitize branding to remove undefined fields which Firestore doesn't like
        const branding = rawBranding ? JSON.parse(JSON.stringify(rawBranding)) : undefined;

        const contract = await createContract(
          user.uid,
          user.displayName || 'Creator',
          user.email || '',
          activeTemplate,
          sanitizedMeta,
          editableLegalText,
          branding
        )
        redirectId = contract.id;
        toast.success("Agreement created!")
      }
      
      router.push(`/s/${redirectId}`)
    } catch (error) {
      console.error("Action failed:", error)
      toast.error("Failed to process agreement")
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
      default:
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

  if (usageLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-vh-[50vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!activeTemplate) {
    const getTemplateVisuals = (id: string) => {
      switch(id) {
          case 'SCOPE': return { icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50' }
          case 'NDA': return { icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' }
          case 'DEAL': return { icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' }
          default: return { icon: FileText, color: 'text-slate-600', bg: 'bg-slate-50' }
      }
    }
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
                        <div key={template.id} onClick={() => handleTemplateSelect(template.id)} className="group relative bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
                             <div className={`absolute top-0 right-0 p-4 opacity-50`}><Icon className={`w-24 h-24 ${visual.color} opacity-5 group-hover:opacity-10 transition-opacity transform rotate-12`} /></div>
                             <div className={`w-12 h-12 ${visual.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}><Icon className={`w-6 h-6 ${visual.color}`} /></div>
                             <h3 className="text-xl font-bold text-slate-900 mb-2">{template.name}</h3>
                             <p className="text-slate-500 text-sm leading-relaxed mb-6">{template.description}</p>
                             <div className="flex items-center text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">Select Template <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
  }

  const currentTemplateDef = getTemplate(activeTemplate)
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center space-x-4 mb-6">
        <Button onClick={handleBackToSelection} variant="ghost" size="sm" className="pl-0 text-slate-500 hover:text-slate-900">
           <ArrowLeft className="h-4 w-4 mr-1" /> Back to Templates
        </Button>
      </div>
      
      {clientFeedback && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8 flex items-start gap-4 animate-in slide-in-from-top-4 duration-500">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-red-900 mb-1">Client Revision Request</h3>
            <p className="text-red-700 text-sm italic">"{clientFeedback}"</p>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
         <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Agreement Details</h1>
            <p className="text-slate-500 text-sm mt-1">{currentTemplateDef.name}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
             <CardTitle className="text-lg flex items-center gap-2"><Edit3 className="w-5 h-5 text-indigo-600" /> Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-8 space-y-8">
              <form id="contract-form" onSubmit={handleSubmit} className="space-y-6">
                  {currentTemplateDef.fields.map(renderField)}
              </form>
          </CardContent>
        </Card>

        <Card className="border-indigo-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-indigo-50/30 border-b border-indigo-100">
              <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-600" /> Legal Terms</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs text-indigo-600" onClick={() => setEditableLegalText(currentTemplateDef.legalText)}>Reset to Default</Button>
              </div>
          </CardHeader>
          <CardContent className="p-0">
              <Textarea 
                value={editableLegalText} 
                onChange={(e) => setEditableLegalText(e.target.value)} 
                className="min-h-[400px] text-sm font-sans leading-relaxed border-0 focus-visible:ring-0 rounded-none p-8"
              />
          </CardContent>
          <CardFooter className="bg-slate-50 border-t border-slate-100 flex justify-between py-6 px-8">
              <Button variant="ghost" onClick={handleBackToSelection} disabled={loading}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={loading} className="min-w-[180px] bg-indigo-600 hover:bg-indigo-700 h-12 text-base font-bold">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                {editingId ? 'Confirm Changes' : 'Confirm & View'}
              </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
