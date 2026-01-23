'use client';

import { useEffect, useState, use } from 'react';
import { Contract } from '@/types';
import { getContract, signContract } from '@/lib/contracts';
import { ContractDisplay } from '@/components/signing/contract-display';
import { SignatureForm } from '@/components/signing/signature-form';
import { SuccessAnimation } from '@/components/signing/success-animation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Download, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { downloadContractPDF } from '@/lib/pdf';
import { getClientIp, formatDate } from '@/lib/utils';
import Link from 'next/link';

// Mock data for development if contract not found (remove in prod)
const MOCK_CONTRACT: Contract = {
  id: 'x9k2p',
  creatorId: 'mock-creator',
  creatorName: 'Sarah Jenkins',
  creatorEmail: 'sarah@designstudio.com',
  template: 'SCOPE',
  status: 'pending',
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  auditTrail: null,
  meta: {
    clientName: 'Acme Corp',
    clientEmail: 'billing@acme.com',
    originalProjectRef: 'Q4 Marketing Campaign',
    newDeliverables: '1. Additional 3 social media reels\n2. Extended copyright license for TV usage\n3. Rush delivery for weekend launch',
    additionalFee: 1500,
    currency: 'USD',
  }
};

export default function SigningPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContract() {
      try {
        const data = await getContract(resolvedParams.id);
        if (data) {
          setContract(data);
          if (data.status === 'signed') {
            setSigned(true);
          }
        } else {
          // Fallback for demo/dev purposes if ID matches "demo"
          if (resolvedParams.id === 'demo') {
             setContract(MOCK_CONTRACT);
          } else {
             setError('Contract not found');
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load contract');
      } finally {
        setLoading(false);
      }
    }
    fetchContract();
  }, [resolvedParams.id]);

  const handleSign = async (signerData: { name: string; email: string }) => {
    if (!contract) return;
    
    setSigning(true);
    try {
      const ip = await getClientIp();
      const userAgent = navigator.userAgent;

      const success = await signContract(
        contract.id,
        signerData.name,
        signerData.email,
        ip,
        userAgent
      );

      if (success) {
        // Update local state immediately
        const updatedContract: Contract = {
          ...contract,
          status: 'signed',
          auditTrail: {
            signedAt: new Date(),
            signerIp: ip,
            signerEmail: signerData.email,
            signerName: signerData.name,
            userAgent: userAgent
          }
        };
        setContract(updatedContract);
        setSigned(true);
        toast.success('Contract signed successfully!');
        
        // Trigger celebration and download
        setTimeout(() => {
           downloadContractPDF(updatedContract);
           toast.message('Downloading your signed copy...');
        }, 2000);

      } else {
        toast.error('Failed to sign contract. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred');
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mx-auto" />
          <p className="text-slate-500 font-medium">Loading agreement...</p>
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Contract Not Found</h1>
          <p className="text-slate-500">
            This contract link may be invalid or expired. Please contact the creator for a new link.
          </p>
          <div className="pt-4">
             <Link href="/">
               <Button variant="outline">Back to Home</Button>
             </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12">
      {/* Navbar / Brand */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
             <div className="bg-indigo-600 text-white p-1.5 rounded-md">
                <FileText className="h-4 w-4" />
             </div>
             <span className="font-bold text-lg tracking-tight text-slate-900">
               Insta<span className="text-indigo-600">Pact</span>
             </span>
          </Link>
          {signed && (
            <Button size="sm" variant="outline" onClick={() => downloadContractPDF(contract)}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {signed && <SuccessAnimation />}
        
        {signed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800">Successfully Signed!</h2>
            <p className="text-green-700 max-w-sm mx-auto">
              This contract is now legally binding. A PDF copy has been generated for your records.
            </p>
            <div className="text-sm text-green-600 pt-2">
              Signed on {formatDate(contract.auditTrail?.signedAt || new Date())}
            </div>
          </div>
        )}

        {/* Contract Visual */}
        <ContractDisplay contract={contract} />

        {/* Action Area */}
        {!signed && (
          <div className="sticky bottom-4 md:static z-20">
             <SignatureForm 
               onSubmit={handleSign} 
               isSubmitting={signing} 
               defaultEmail={contract.meta.clientEmail}
               defaultName={contract.meta.clientName}
             />
          </div>
        )}
      </main>
      
      {/* Powered by Footer */}
      <footer className="text-center py-8 text-slate-400 text-sm">
        <p>Powered by InstaPact &bull; Secure Digital Contracts</p>
      </footer>
    </div>
  );
}
