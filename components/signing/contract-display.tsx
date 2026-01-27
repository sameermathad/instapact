import { Contract } from '@/types';
import { formatCurrency, getTemplate } from '@/lib/templates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, Shield, Handshake, Calendar, DollarSign, User, Mail, AlertCircle } from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';

interface ContractDisplayProps {
  contract: Contract;
}

const SafeHtml = ({ content, className }: { content: string, className?: string }) => {
  if (!content) return null;
  // Basic check to see if it's HTML or plain text
  const isHtml = /<[a-z][\s\S]*>/i.test(content);
  
  if (!isHtml) {
    return <p className={cn("whitespace-pre-wrap leading-relaxed", className)}>{content}</p>;
  }

  return (
    <div 
      className={cn("prose prose-sm max-w-none text-slate-700 leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export function ContractDisplay({ contract }: ContractDisplayProps) {
  const getTemplateLabel = () => {
    switch (contract.template) {
      case 'SCOPE': return 'Statement of Work (Scope Change)';
      case 'NDA': return 'Non-Disclosure Agreement';
      case 'DEAL': return 'Client Service Agreement';
      default: return 'Contract Agreement';
    }
  };

  const accentColor = contract.creatorBranding?.color || '#6366f1';

  return (
    <div className="space-y-12 text-slate-800">
      
      {/* 1. Document Header */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="space-y-2 flex-1">
            <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 font-mono tracking-wider text-[10px] py-1 px-2 mb-2">
              ID: {contract.id.toUpperCase()}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {contract.meta.documentTitle || getTemplateLabel()}
            </h1>
            <p className="text-slate-500 font-medium">
              Created on {formatDate(contract.createdAt)}
            </p>
          </div>
          
          {contract.creatorBranding?.logo && (
            <div className="h-16 w-32 flex items-center justify-end flex-shrink-0 self-end sm:self-start">
               <img src={contract.creatorBranding.logo} alt="Brand Logo" className="max-h-16 max-w-full object-contain" />
            </div>
          )}
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* 2. Parties Section (2-Col) */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Parties Involved</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Creator */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase mb-1 block" style={{ color: accentColor }}>Service Provider</span>
            <div className="font-bold text-lg text-slate-900">{contract.creatorName}</div>
            <div className="text-slate-500 text-sm flex items-center">
              <Mail className="w-3.5 h-3.5 mr-2" />
              {contract.creatorEmail}
            </div>
          </div>

          {/* Client */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase mb-1 block" style={{ color: accentColor }}>Client / Signer</span>
            <div className="font-bold text-lg text-slate-900">{contract.meta.clientName}</div>
            {contract.meta.clientEmail && (
              <div className="text-slate-500 text-sm flex items-center">
                <Mail className="w-3.5 h-3.5 mr-2" />
                {contract.meta.clientEmail}
              </div>
            )}
          </div>

        </div>
      </section>

      <hr className="border-slate-200" />

      {/* 3. Contract Core Details */}
      <section className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Agreement Details</h3>

        {/* SCOPE TEMPLATE */}
        {contract.template === 'SCOPE' && (
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-slate-500 mb-1">Original Project</dt>
              <dd className="text-lg font-medium text-slate-900">{contract.meta.originalProjectRef}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-slate-500 mb-1">Additional Fee</dt>
              <dd className="text-2xl font-bold" style={{ color: accentColor === '#000000' ? '#059669' : accentColor }}>
                {formatCurrency(contract.meta.additionalFee || 0, contract.meta.currency)}
              </dd>
            </div>
            <div className="sm:col-span-2 bg-slate-50 p-6 rounded-lg border border-slate-100">
              <dt className="text-xs font-bold uppercase text-slate-400 mb-3">New Deliverables / Changes</dt>
              <dd className="text-base text-slate-700">
                <SafeHtml content={contract.meta.newDeliverables || ''} />
              </dd>
            </div>
          </dl>
        )}

        {/* DEAL TEMPLATE */}
        {contract.template === 'DEAL' && (
          <div className="space-y-8">
             <div className="flex flex-col sm:flex-row gap-6 p-6 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex-1">
                   <span className="text-sm text-slate-500 font-medium block mb-1">Total Project Fee</span>
                   <span className="text-3xl font-bold tracking-tight" style={{ color: accentColor === '#000000' ? '#059669' : accentColor }}>
                     {formatCurrency(contract.meta.amount || 0, contract.meta.currency)}
                   </span>
                </div>
                <div className="flex-1 border-l border-slate-200 pl-6 border-dashed">
                   <span className="text-sm text-slate-500 font-medium block mb-1">Payment Schedule</span>
                   <span className="text-lg font-semibold text-slate-900">
                      {contract.meta.paymentSchedule || 'Standard 50/50 Split'}
                   </span>
                </div>
             </div>

             <div className="space-y-2">
               <h4 className="text-sm font-bold text-slate-900">Project Description</h4>
               <SafeHtml content={contract.meta.description || ''} className="text-slate-600 text-base" />
             </div>

             {contract.meta.milestones && (
                <div className="space-y-2">
                   <h4 className="text-sm font-bold text-slate-900">Milestones</h4>
                   <SafeHtml content={contract.meta.milestones} className="text-slate-600 text-base" />
                </div>
             )}

             {contract.meta.timeline && (
                <div className="space-y-2">
                   <h4 className="text-sm font-bold text-slate-900">Timeline</h4>
                   <p className="text-slate-600 text-base">{contract.meta.timeline}</p>
                </div>
             )}

             {contract.meta.deliverablesList && contract.meta.deliverablesList.length > 0 && (
               <div className="space-y-3">
                 <h4 className="text-sm font-bold text-slate-900">Deliverables</h4>
                 <div className="grid grid-cols-1 gap-2">
                   {/* Fix: If single item contains rich text bullets, don't wrap in numbered list to avoid double bullets/weird layout */}
                   {contract.meta.deliverablesList.length === 1 && /<ul|<ol|<li/i.test(contract.meta.deliverablesList[0]) ? (
                      <div className="text-slate-700 bg-white p-4 border border-slate-100 rounded-md shadow-sm">
                         <SafeHtml content={contract.meta.deliverablesList[0]} className="text-sm [&_ul]:mb-0 [&_ol]:mb-0" />
                      </div>
                   ) : (
                     contract.meta.deliverablesList.map((item, i) => (
                       <div key={i} className="flex items-start text-slate-700 bg-white p-4 border border-slate-100 rounded-md shadow-sm">
                         <span 
                          className="h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-1 flex-shrink-0"
                          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                         >
                           {i + 1}
                         </span>
                         <div className="flex-1 min-w-0">
                            <SafeHtml content={item} className="[&_p]:mb-2 text-sm" />
                         </div>
                       </div>
                     ))
                   )}
                 </div>
               </div>
             )}

             {/* Tax / Global Tax Info */}
             {(contract.meta.gstApplicable || (contract.meta.taxRate && contract.meta.taxRate > 0)) && (
               <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                     <span className="font-semibold text-slate-700">
                        {contract.meta.taxName || 'Tax'} ({contract.meta.taxRate || 0}%)
                     </span>
                     <span className="font-mono text-slate-600">
                        {/* Note: This is just a display label, actual calc happens in payment/invoice usually unless shown here */}
                        Included in final invoice
                     </span>
                  </div>
                  {contract.meta.creatorTaxId && (
                     <div className="mt-2 text-xs text-slate-500">
                        Service Provider Tax ID: {contract.meta.creatorTaxId}
                     </div>
                  )}
               </div>
             )}

             {/* Payment Details (Bank Info) - Only shown if exists */}
             {contract.meta.paymentDetails && (
               <div className="mt-8 space-y-2 pt-6 border-t border-slate-200 border-dashed">
                  <h4 className="text-sm font-bold text-slate-900">Payment Instructions</h4>
                  <SafeHtml content={contract.meta.paymentDetails} className="text-sm text-slate-600" />
               </div>
             )}

          </div>
        )}

        {/* NDA TEMPLATE */}
        {contract.template === 'NDA' && (
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
             <h4 className="text-sm font-bold text-slate-900 mb-3">Purpose of Disclosure</h4>
             <SafeHtml content={contract.meta.description || 'Confidential information exchange regarding potential partnership.'} />
          </div>
        )}
      </section>

      {/* 4. Terms Accordion / Section */}
      <section className="pt-8 border-t border-slate-200">
        <Accordion type="single" collapsible className="w-full bg-slate-50 rounded-lg border border-slate-200">
          <AccordionItem value="terms" className="border-0">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-100 transition-colors rounded-t-lg">
              <div className="flex items-center space-x-3 text-slate-800">
                <FileText className="w-5 h-5 text-slate-400" />
                <span className="font-semibold text-sm">Read Full Legal Standard Terms</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-6 pb-6 pt-2 border-t border-slate-200">
                <div className="bg-white p-8 rounded-md shadow-inner border border-slate-100 h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                   <SafeHtml 
                      content={contract.legalText || getTemplate(contract.template).legalText} 
                      className="text-slate-600 font-sans text-sm [&_p]:mb-4"
                   />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

    </div>
  );
}
