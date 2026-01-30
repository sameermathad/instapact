'use client';

import { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { Contract } from '@/types';
import { getContract } from '@/lib/contracts';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send } from 'lucide-react';
import { ContractDisplay } from '@/components/signing/contract-display';
import { SignatureForm } from '@/components/signing/signature-form';
import { SuccessAnimation } from '@/components/signing/success-animation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Copy, Share2, Eye, Download, CheckCircle, AlertCircle, FileText, ArrowLeft, LayoutDashboard, Edit3, Info, PenTool } from 'lucide-react';
import { downloadContractPDF } from '@/lib/pdf';
import { getClientIp, formatDate, cn } from '@/lib/utils';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { useAuth } from '@/lib/auth-context';
import { Badge } from '@/components/ui/badge';

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
  const searchParams = useSearchParams();
  const securityToken = searchParams.get('t') || undefined;
  
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const { user: authUser } = useAuth();
  const [contract, setContract] = useState<Contract | null>(null);
  const isCreator = !!authUser && authUser.uid === contract?.creatorId;
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [requestingRevision, setRequestingRevision] = useState(false);
  const [revisionText, setRevisionText] = useState('');
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [signed, setSigned] = useState(false);
  const [revisionRequested, setRevisionRequested] = useState(false);
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
          if (data.status === 'revision_requested') {
            setRevisionRequested(true);
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

      const res = await fetch('/api/sign-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractId: contract.id,
          signerName: signerData.name,
          signerEmail: signerData.email,
          signerIp: ip,
          userAgent,
          token: securityToken
        })
      });
      
      const { success, error: signError } = await res.json();
      if (signError) console.error('[SigningPage] Error:', signError);

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
        
        // Trigger completion workflow (Emails & PDFs) in background
        fetch('/api/complete-signature', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contractId: contract.id })
        }).catch(err => console.error('Failed to trigger completion:', err));

        // Trigger celebration and download
        setTimeout(() => {
           if (contract.signedUrl) {
             window.open(contract.signedUrl, '_blank');
           } else {
             downloadContractPDF(updatedContract);
           }
           toast.message('Opening your signed copy...');
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

  const handleRequestRevision = async () => {
    if (!contract || !revisionText.trim()) return;
    
    setRequestingRevision(true);
    try {
      const res = await fetch('/api/request-revision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractId: contract.id, feedback: revisionText })
      });
      const data = await res.json();
      if (data.success) {
        setRevisionRequested(true);
        setContract({ ...contract, status: 'revision_requested', clientFeedback: revisionText });
        setShowRevisionForm(false);
        toast.success('Revision request sent to creator');
      } else {
        toast.error(data.error || 'Failed to send revision request');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to send revision request');
    } finally {
      setRequestingRevision(false);
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
            This agreement link may be invalid or expired. Please contact the creator for a new link.
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

  // Professional "Document Viewer" Layout
  return (
    <div className="min-h-screen bg-slate-100 font-sans selection:bg-indigo-100 text-slate-900 pb-24 md:pb-12">
      {/* Texture Overlay (Optional, for realism) */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] mix-blend-multiply"></div>

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href={authUser ? "/dashboard" : "/"} className="hover:opacity-80 transition-opacity">
             <Logo showBeta={false} />
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-4">
             {isCreator && (
               <div className="hidden sm:flex items-center gap-2">

                 <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="text-slate-600">
                       <LayoutDashboard className="w-4 h-4 mr-1.5" />
                       Dashboard
                    </Button>
                 </Link>
               </div>
             )}

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-24 px-4 sm:px-6 relative z-10">
        <div className="max-w-[850px] mx-auto space-y-8">
          
          {/* Success Banner */}
          {signed && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left animate-in slide-in-from-top-4 fade-in duration-500 shadow-sm">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-emerald-900">Contract E-Signed & Validated</h2>
                <p className="text-emerald-700 text-sm">
                  This document was e-signed on {formatDate(contract.auditTrail?.signedAt || new Date())}.
                  A secure copy has been generated for your downloads.
                </p>
              </div>
              <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800" onClick={() => {
                if (contract.signedUrl) {
                  window.open(contract.signedUrl, '_blank');
                } else {
                  downloadContractPDF(contract);
                }
              }}>
                Download Copy
              </Button>
            </div>
          )}

          {/* Revision Requested Banner (for Creator) */}
          {isCreator && revisionRequested && contract.clientFeedback && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-6 space-y-4 animate-in slide-in-from-top-4 fade-in duration-500 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-red-900">Client Requested Changes</h2>
                  <p className="text-red-700 text-sm italic mt-1 bg-white/50 p-4 rounded-lg border border-red-50">
                    "{contract.clientFeedback}"
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Link href={`/dashboard/new?edit=${contract.id}`}>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit & Resubmit
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Revision Confirmation (for Client) */}
          {!isCreator && revisionRequested && (
             <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex items-center gap-4 text-center sm:text-left animate-in slide-in-from-top-4 fade-in duration-500 shadow-sm">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Send className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-indigo-900">Changes Sent to Creator</h2>
                  <p className="text-indigo-700 text-sm">
                    You've requested some changes. The creator has been notified and will update the agreement shortly.
                  </p>
                </div>
             </div>
          )}

          {/* Electronic Paper Container */}
          <div className="bg-white rounded-md shadow-2xl overflow-hidden border border-slate-200/60 min-h-[1000px] relative">
            {/* Top Brand Bar */}
            <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

            {/* Document Content */}
            <div className="p-8 sm:p-12 md:p-16 space-y-10">
              <ContractDisplay contract={contract} />
            </div>

            {/* Bottom Brand Bar */}
            <div className="bg-slate-50 border-t border-slate-100 p-8 text-center">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
                Secured by InstaPact
              </p>
            </div>
          </div>

          {/* Signature Action */}
          {!signed && !revisionRequested && !isCreator && (
            <div className="w-full relative z-20 space-y-6">
                {!showRevisionForm && (
                  <div className="bg-white rounded-md shadow-2xl overflow-hidden border border-slate-200/60 transition-all duration-300">
                     {/* Top Brand Bar for Signature Card */}
                     <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600" />
                     
                     <SignatureForm 
                       onSubmit={handleSign} 
                       isSubmitting={signing} 
                       defaultEmail={contract.meta.clientEmail}
                       defaultName={contract.meta.clientName}
                       creatorName={contract.creatorName}
                       contractId={contract.id}
                       securityToken={securityToken}
                       onRevisionRequest={() => setShowRevisionForm(true)}
                     />
                  </div>
                )}

               {/* Request Changes (Client) */}


               {showRevisionForm && (
                 <div className="bg-white rounded-md shadow-xl overflow-hidden border border-slate-200 p-8 sm:p-12 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-red-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Suggest Changes</h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">
                      Let the creator know what needs to be changed. They will be notified to update the agreement.
                    </p>
                    <Textarea 
                      placeholder="e.g. Please change the additional fee to $1,200 or add 2 more revisions to the scope."
                      value={revisionText}
                      onChange={(e) => setRevisionText(e.target.value)}
                      className="min-h-[120px] mb-6 border-slate-200 focus:border-red-500 focus:ring-red-500"
                    />
                    <div className="flex justify-end gap-3">
                      <Button variant="ghost" onClick={() => setShowRevisionForm(false)}>Cancel</Button>
                      <Button 
                        onClick={handleRequestRevision}
                        disabled={requestingRevision || !revisionText.trim()}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {requestingRevision ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                        Send Request
                      </Button>
                    </div>
                 </div>
               )}
            </div>
          )}

          {isCreator && !signed && (
            <div className="mx-auto max-w-[850px] w-full">
               <div className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Share Agreement</h4>
                      <p className="text-xs text-slate-500">Ready for client signature.</p>
                    </div>
                  </div>
                  <div className="flex w-full sm:w-auto gap-2">
                    {contract.meta.clientEmail && (
                      <Button 
                        variant="default" 
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 font-bold"
                        onClick={async () => {
                          const loadingToast = toast.loading('Sending invitation email...');
                          try {
                            const res = await fetch('/api/send-agreement', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                contractId: contract.id,
                                clientEmail: contract.meta.clientEmail,
                                creatorName: contract.creatorName,
                                documentTitle: contract.meta.documentTitle
                              })
                            });
                            const data = await res.json();
                              if (data.success) {
                                toast.success('Agreement link shared successfully.', { id: loadingToast });
                              } else {
                              toast.error(data.error || 'Failed to send email', { id: loadingToast });
                            }
                          } catch (err) {
                            toast.error('An error occurred', { id: loadingToast });
                          }
                        }}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send via Email
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 sm:flex-none"
                      onClick={() => {
                        downloadContractPDF(contract, true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 sm:flex-none"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied to clipboard!");
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                    <Link href={`/dashboard/new?edit=${contract.id}`} className="flex-1 sm:flex-none">
                      <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Agreement
                      </Button>
                    </Link>
                  </div>
               </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center space-y-2">
        <p className="text-sm text-slate-500">
          Powered by <span className="font-bold text-slate-700">InstaPact</span>
        </p>
        <p className="text-xs text-slate-400 max-w-md mx-auto px-4">
          This is a legally binding electronic contract. Ip addresses and device signatures are recorded for security and audit purposes.
        </p>
      </footer>
    </div>
  );
}
