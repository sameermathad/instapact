"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  amount: number
  currency: string
  itemDescription: string
  provider: 'razorpay' | 'lemonsqueezy'
}

export function PaymentModal({ isOpen, onClose, onConfirm, amount, currency, itemDescription, provider }: PaymentModalProps) {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details')
  
  useEffect(() => {
    if (isOpen) setStep('details')
  }, [isOpen])

  const handlePay = async () => {
    setStep('processing')
    try {
      await onConfirm()
      setStep('success')
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      setStep('details') // Go back on error
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {step === 'details' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Pay with {provider === 'razorpay' ? 'Razorpay' : 'LemonSqueezy'}
                <Badge variant="secondary" className="text-xs font-normal">Test Mode</Badge>
              </DialogTitle>
              <DialogDescription>
                Secure payment for <strong>{itemDescription}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-500">Total Amount</span>
                <span className="text-xl font-bold text-slate-900">
                  {currency === 'INR' ? '₹' : '$'} {amount}
                </span>
              </div>
              
              {provider === 'razorpay' ? (
                <div className="bg-[#0c243b] text-white p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold">R</div>
                     <div>
                       <p className="text-sm font-medium">Razorpay Trusted</p>
                       <p className="text-[10px] text-slate-300">UPI, Cards, Netbanking</p>
                     </div>
                  </div>
                </div>
              ) : (
                 <div className="bg-[#7047EB] text-white p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">🍋</div>
                     <div>
                       <p className="text-sm font-medium">Lemon Squeezy</p>
                       <p className="text-[10px] text-white/80">Cards, PayPal, Apple Pay</p>
                     </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
               <Button variant="outline" onClick={onClose}>Cancel</Button>
               <Button onClick={handlePay} className={provider === 'razorpay' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#7047EB] hover:bg-[#5e3bc7]'}>
                 Pay {currency === 'INR' ? '₹' : '$'}{amount}
               </Button>
            </DialogFooter>
          </>
        )}

        {step === 'processing' && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <div>
              <h3 className="text-lg font-medium">Processing Payment...</h3>
              <p className="text-sm text-slate-500">Please do not close this window.</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-emerald-900">Payment Successful!</h3>
              <p className="text-sm text-emerald-700">Your credits have been added.</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
