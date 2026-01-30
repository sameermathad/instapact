'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, PenTool, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SignatureFormProps {
  onSubmit: (data: { name: string; email: string }) => Promise<void>;
  isSubmitting: boolean;
  defaultEmail?: string;
  defaultName?: string;
  creatorName: string;
  contractId: string;
  securityToken?: string;
  onRevisionRequest?: () => void;
}

export function SignatureForm({ onSubmit, isSubmitting, defaultEmail, defaultName, creatorName, contractId, securityToken, onRevisionRequest }: SignatureFormProps) {
  const [step, setStep] = useState<'details' | 'otp' | 'consent'>('details');
  const [name, setName] = useState(defaultName || '');
  const [email, setEmail] = useState(defaultEmail || '');
  const [otp, setOtp] = useState('');
  const [consent, setConsent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [preVerified, setPreVerified] = useState(false);

  useEffect(() => {
    async function validateToken() {
      if (securityToken && contractId) {
        setVerifying(true);
        try {
          const res = await fetch('/api/validate-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: securityToken, contractId }),
          });
          const data = await res.json();
          if (data.valid) {
            setPreVerified(true);
            setEmail(data.email);
            // Progress to consent step automatically if we have their details from the contract
            if (name) {
              setStep('consent');
            }
          } else {
            console.warn('[SignatureForm] Invalid token:', data.error);
          }
        } catch (err) {
          console.error('[SignatureForm] Token validation failed:', err);
        } finally {
          setVerifying(false);
        }
      }
    }
    validateToken();
  }, [securityToken, contractId]);

  const handleStartVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Please fill in all fields');
      return;
    }

    if (preVerified) {
      setStep('consent');
      toast.success('Secure link verified!');
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, creatorName, contractId }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('otp');
        toast.success('Verification code sent to your email');
      } else {
        toast.error(data.error || 'Failed to send verification code');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit code');
      return;
    }
    setVerifying(true);
    try {
      const res = await fetch('/api/confirm-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('consent');
        toast.success('Email verified successfully!');
      } else {
        toast.error(data.error || 'Invalid or expired code');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      toast.error('You must agree to the terms to sign');
      return;
    }
    await onSubmit({ name, email });
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="p-8 sm:p-12 md:p-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
            <PenTool className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {step === 'details' && 'Sign this Agreement'}
              {step === 'otp' && 'Verify your Email'}
              {step === 'consent' && 'Accept Terms'}
            </h3>
            <p className="text-sm text-slate-500">
              {step === 'details' && 'Provide your details to begin the signature process.'}
              {step === 'otp' && `We've sent a 6-digit code to ${email}`}
              {step === 'consent' && 'Review and accept the terms to finalize.'}
            </p>
          </div>
        </div>

        {step === 'details' && (
          <form onSubmit={handleStartVerification} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              <div className="space-y-2">
                <div className="h-6 flex items-center">
                  <Label htmlFor="signer-name" className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</Label>
                </div>
                <Input
                  id="signer-name"
                  placeholder="Ex. Alice Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={verifying}
                  className="h-12"
                />
              </div>
              <div className="space-y-2 relative">
                <div className="h-6 flex items-center justify-between">
                  <Label htmlFor="signer-email" className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</Label>
                  {defaultEmail && (
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1 h-5 text-[10px] px-2 py-0">
                      <ShieldCheck className="w-3 h-3" />
                      Secure
                    </Badge>
                  )}
                </div>
                <Input
                  id="signer-email"
                  type="email"
                  placeholder="Ex. alice@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={verifying || !!defaultEmail}
                  className={cn("h-12", defaultEmail && "bg-slate-50 border-emerald-100")}
                />
                {defaultEmail && (
                  <p className="absolute -bottom-5 left-0 text-[10px] text-slate-400 italic whitespace-nowrap">
                    This agreement is securely restricted to this email address.
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              {onRevisionRequest && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onRevisionRequest}
                  className="flex-1 h-14 border-amber-200 text-amber-600 font-bold"
                >
                  REQUEST CHANGES
                </Button>
              )}
              <Button type="submit" className="flex-[2] h-14 text-lg font-bold bg-indigo-600" disabled={verifying}>
                {verifying ? <Loader2 className="animate-spin mr-2" /> : 'VERIFY EMAIL TO SIGN'}
              </Button>
            </div>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-8">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Verification Code</Label>
              <Input
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="h-20 text-center text-4xl font-bold tracking-[1rem] border-2 border-indigo-100 focus:border-indigo-500"
                autoFocus
              />
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" type="button" onClick={() => setStep('details')} className="flex-1">Back</Button>
              <Button type="submit" className="flex-[2] h-14 text-lg font-bold bg-indigo-600" disabled={verifying}>
                {verifying ? <Loader2 className="animate-spin mr-2" /> : 'CONFIRM CODE'}
              </Button>
            </div>
            <p className="text-center text-xs text-slate-400">
              Didn't receive the code? Check your spam folder or <button type="button" onClick={handleStartVerification} className="text-indigo-600 font-bold hover:underline">Resend</button>
            </p>
          </form>
        )}

        {step === 'consent' && (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-start space-x-4 p-5 bg-indigo-50/30 rounded-xl border border-indigo-100">
              <Checkbox 
                id="consent" 
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked as boolean)}
                disabled={isSubmitting}
                className="mt-1"
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="consent" className="text-sm font-semibold text-slate-700 leading-normal cursor-pointer">
                  I agree to the terms and conditions defined in this document and accept the use of this electronic signature as binding.
                </Label>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" type="button" onClick={() => setStep('otp')} className="flex-1" disabled={isSubmitting}>Back</Button>
              <Button type="submit" className="flex-[2] h-16 text-xl font-bold bg-indigo-600 shadow-xl shadow-indigo-100" disabled={isSubmitting || !consent}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Completing E-Signature...
                  </>
                ) : (
                  'APPROVE & SIGN'
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
