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
}

export function SignatureForm({ onSubmit, isSubmitting, defaultEmail, defaultName }: SignatureFormProps) {
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
    <Card className="shadow-lg border-indigo-100 ring-4 ring-indigo-50/50">
      <CardHeader className="bg-slate-50 border-b border-slate-100">
        <CardTitle className="flex items-center text-lg">
          <PenTool className="w-5 h-5 mr-2 text-indigo-600" />
          Sign this Agreement
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="signer-name">Full Name</Label>
              <Input
                id="signer-name"
                placeholder="Ex. Alice Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="bg-white"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="signer-email">Email Address</Label>
              <Input
                id="signer-email"
                type="email"
                placeholder="Ex. alice@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                 className="bg-white"
              />
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-indigo-50/50 rounded-md border border-indigo-100">
            <Checkbox 
              id="consent" 
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked as boolean)}
              disabled={isSubmitting}
              className="mt-1"
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="consent"
                className="text-sm font-medium leading-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                I agree to the terms and conditions defined in this document and accept the use of this digital signature as binding.
              </Label>
              <p className="text-xs text-slate-500">
                Your IP address and device information will be recorded securely.
              </p>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-semibold shadow-lg shadow-indigo-200"
            disabled={isSubmitting || !consent}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing...
              </>
            ) : (
              'APPROVE & SIGN'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
