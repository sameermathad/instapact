'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { Loader2, PenTool } from 'lucide-react';
import { toast } from 'sonner';

interface SignatureFormProps {
  onSubmit: (data: { name: string; email: string }) => Promise<void>;
  isSubmitting: boolean;
  defaultEmail?: string;
  defaultName?: string;
  onRevisionRequest?: () => void;
}

export function SignatureForm({ onSubmit, isSubmitting, defaultEmail, defaultName, onRevisionRequest }: SignatureFormProps) {
  const [name, setName] = useState(defaultName || '');
  const [email, setEmail] = useState(defaultEmail || '');
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast.error('Please fill in all fields');
      return;
    }

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
            <h3 className="text-xl font-bold text-slate-900">Sign this Agreement</h3>
            <p className="text-sm text-slate-500">Provide your digital signature to accept this contract.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="signer-name" className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</Label>
              <Input
                id="signer-name"
                placeholder="Ex. Alice Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signer-email" className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</Label>
              <Input
                id="signer-email"
                type="email"
                placeholder="Ex. alice@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-start space-x-4 p-5 bg-slate-50 rounded-xl border border-slate-100 group transition-colors hover:bg-indigo-50/30">
            <Checkbox 
              id="consent" 
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked as boolean)}
              disabled={isSubmitting}
              className="mt-1 border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="consent"
                className="text-sm font-semibold text-slate-700 leading-normal cursor-pointer"
              >
                I agree to the terms and conditions defined in this document and accept the use of this electronic signature as binding.
              </Label>
              <p className="text-xs text-slate-500">
                Your IP address and device information will be recorded securely.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {onRevisionRequest && (
                <Button 
                    type="button"
                    variant="outline"
                    onClick={onRevisionRequest}
                    className="flex-1 h-16 text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200 hover:border-amber-300 font-bold transition-all"
                    disabled={isSubmitting}
                >
                    REQUEST CHANGES
                </Button>
            )}

            <Button 
                type="submit" 
                className="flex-[2] h-16 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]"
                disabled={isSubmitting || !consent}
            >
                {isSubmitting ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Validating Signature...
                </>
                ) : (
                'APPROVE & SIGN'
                )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
