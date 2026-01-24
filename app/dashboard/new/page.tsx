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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowLeft, ArrowRight, Target, Shield, Briefcase, FileText, User, Sparkles, AlertCircle, Eye, Edit3, Check, PlusCircle } from "lucide-react"
import { ContractDisplay } from "@/components/signing/contract-display"
import { Contract } from "@/types"
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
  
  const [step, setStep] = useState<'template' | 'form' | 'preview'>('template')
  const [activeTemplate, setActiveTemplate] = useState<TemplateType | null>(null)
  const [editableLegalText, setEditableLegalText] = useState<string>('')
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Generic form state holder
  const [formData, setFormData] = useState<Record<string, any>>({
    currency: 'USD',
    paymentSchedule: 'upfront'
  })

  // Load draft from localStorage on mount if "from=hero"
  useEffect(() => {
    // Handle Template Type from URL
    const typeParam = searchParams.get('type')
    const editParam = searchParams.get('edit')

    if (editParam) {
      setEditingId(editParam)
      const fetchEdit = async () => {
        const c = await getContract(editParam)
        if (c && c.creatorId === user?.uid) {
           setActiveTemplate(c.template)
           
           // Ensure deliverablesList is a string for the textarea
           const meta = { ...c.meta } as any
           if (Array.isArray(meta.deliverablesList)) {
             meta.deliverablesList = meta.deliverablesList.join('\n')
           }

           setFormData(meta)
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
    setStep('form')
    setEditableLegalText(getTemplate(type).legalText)
  }

  const handleGoToPreview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeTemplate) return
    
    const templateDef = getTemplate(activeTemplate)
    const missing = templateDef.fields
      .filter(f => f.required && !formData[f.name])
      .map(f => f.label)
    
    if (missing.length > 0) {
      toast.error(`Missing required fields: ${missing.join(', ')}`)
      return
    }

    setStep('preview')
  }

  const handleBackToForm = () => {
    setStep('form')
  }

  const handleBackToSelection = () => {
    setActiveTemplate(null)
    setStep('template')
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

  const handleSubmit = async () => {
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
        deliverablesList: (typeof formData.deliverablesList === 'string') 
            ? formData.deliverablesList.split('\n').filter(Boolean) 
            : formData.deliverablesList || null,
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
        meta: sanitizedMeta,
        editingId
      })

      if (editingId) {
        await updateContractFields(editingId, sanitizedMeta, editableLegalText)
        toast.success("Agreement updated successfully!")
      } else {
        const contract = await createContract(
          user.uid,
          user.displayName || 'Creator',
          user.email || '',
          activeTemplate,
          sanitizedMeta,
          editableLegalText
        )
        console.log("Agreement created successfully:", contract.id)
        toast.success("Agreement created successfully!")
      }
      
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
  if (step === 'form' && activeTemplate) {
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
              <h1 className="text-2xl font-bold text-slate-900">Step 2: Agreement Details</h1>
              <p className="text-slate-500 text-sm mt-1">{currentTemplateDef.name} — {currentTemplateDef.description}</p>
           </div>
        </div>

        <Card className="border-indigo-100 shadow-sm overflow-hidden">
          <CardContent className="pt-8 space-y-8">
              <form id="contract-form" onSubmit={handleGoToPreview} className="space-y-6">
                  {currentTemplateDef.fields.map(renderField)}
              </form>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t border-slate-100 flex justify-between py-6 px-8">
              <Button variant="ghost" onClick={handleBackToSelection}>Cancel</Button>
              <Button 
                type="submit" 
                form="contract-form"
                className="min-w-[140px]"
              >
                Preview Agreement <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // --- Render Preview Screen ---
  if (step === 'preview' && activeTemplate) {
      const templateDef = getTemplate(activeTemplate)
      
      // Create a preview contract object
      const previewContract: Contract = {
          id: 'preview',
          creatorId: user?.uid || '',
          creatorName: user?.displayName || 'Creator',
          creatorEmail: user?.email || '',
          template: activeTemplate,
          status: 'pending',
          meta: {
            clientName: formData.clientName,
            clientEmail: formData.clientEmail,
            currency: formData.currency as Currency,
            description: formData.description,
            amount: Number(formData.amount),
            originalProjectRef: formData.originalProjectRef,
            newDeliverables: formData.newDeliverables,
            additionalFee: Number(formData.additionalFee),
            deliverablesList: (typeof formData.deliverablesList === 'string') 
              ? formData.deliverablesList.split('\n').filter(Boolean) 
              : formData.deliverablesList || [],
            paymentSchedule: formData.paymentSchedule
          } as any,
          auditTrail: null,
          createdAt: new Date(),
          expiresAt: new Date(),
          legalText: editableLegalText
      }

      return (
          <div className="max-w-5xl mx-auto space-y-8 pb-20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                      <Button onClick={handleBackToForm} variant="ghost" size="sm" className="pl-0 text-slate-500 hover:text-slate-900 mb-2">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Edit Fields
                      </Button>
                      <h1 className="text-2xl font-bold text-slate-900">Step 3: Review & Customize Terms</h1>
                      <p className="text-slate-500 text-sm">Review the preview below. You can edit the legal terms directly.</p>
                  </div>
                  <div className="flex items-center gap-3">
                      <Button variant="outline" onClick={handleBackToForm}>
                         <Edit3 className="w-4 h-4 mr-2" /> Edit Fields
                      </Button>
                      <Button 
                        onClick={handleSubmit} 
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
                      >
                         {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <PlusCircle className="w-4 h-4 mr-2" />}
                         {editingId ? 'Update Agreement' : 'Finalize & Create'}
                      </Button>
                  </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Digital Paper Preview */}
                  <div className="lg:col-span-2 order-2 lg:order-1">
                      <Card className="shadow-2xl border-slate-200 overflow-hidden bg-white">
                          <div className="h-2 bg-indigo-600 w-full" />
                          <div className="p-8 sm:p-12">
                              <ContractDisplay contract={previewContract} />
                          </div>
                          <div className="bg-slate-50 p-6 border-t border-slate-100 text-center text-[10px] text-slate-400 uppercase tracking-widest">
                              This is a live preview of your generated agreement
                          </div>
                      </Card>
                  </div>

                  {/* Terms Editor */}
                  <div className="lg:col-span-1 order-1 lg:order-2 space-y-4">
                      <Card className="sticky top-24 border-indigo-100 shadow-sm">
                          <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center gap-2">
                                  <FileText className="w-5 h-5 text-indigo-600" />
                                  Edit Legal Terms
                              </CardTitle>
                              <CardDescription>
                                  Modify the boilerplate text if needed.
                              </CardDescription>
                          </CardHeader>
                          <CardContent>
                              <Textarea 
                                value={editableLegalText}
                                onChange={(e) => setEditableLegalText(e.target.value)}
                                className="min-h-[500px] text-sm font-sans leading-relaxed custom-scrollbar focus-visible:ring-indigo-500"
                              />
                          </CardContent>
                          <CardFooter className="bg-indigo-50/50 flex justify-between py-4">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-xs text-indigo-600"
                                    onClick={() => setEditableLegalText(templateDef.legalText)}
                                >
                                    Reset to Default
                                </Button>
                                <div className="text-[10px] text-slate-400 flex items-center">
                                    <Check className="w-3 h-3 mr-1 text-emerald-500" /> Auto-saving in preview
                                </div>
                          </CardFooter>
                      </Card>
                  </div>
              </div>
          </div>
      )
  }

  return null // Should not reach here
}
