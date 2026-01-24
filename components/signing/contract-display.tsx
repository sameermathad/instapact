import { Contract } from '@/types';
import { formatCurrency, getTemplate } from '@/lib/templates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, Shield, Handshake, Calendar, DollarSign, User, Mail, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ContractDisplayProps {
  contract: Contract;
}

export function ContractDisplay({ contract }: ContractDisplayProps) {
  const getTemplateLabel = () => {
    switch (contract.template) {
      case 'SCOPE': return 'Statement of Work (Scope Change)';
      case 'NDA': return 'Non-Disclosure Agreement';
      case 'DEAL': return 'Client Service Agreement';
      default: return 'Contract Agreement';
    }
  };

  return (
    <div className="space-y-12 text-slate-800">
      
      {/* 1. Document Header */}
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
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
          

        </div>
      </div>

      <hr className="border-slate-200" />

      {/* 2. Parties Section (2-Col) */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Parties Involved</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Creator */}
          <div className="space-y-1">
            <span className="text-xs font-medium text-indigo-600 uppercase mb-1 block">Service Provider</span>
            <div className="font-bold text-lg text-slate-900">{contract.creatorName}</div>
            <div className="text-slate-500 text-sm flex items-center">
              <Mail className="w-3.5 h-3.5 mr-2" />
              {contract.creatorEmail}
            </div>
          </div>

          {/* Client */}
          <div className="space-y-1">
            <span className="text-xs font-medium text-indigo-600 uppercase mb-1 block">Client / Signer</span>
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
              <dd className="text-2xl font-bold text-emerald-600">
                {formatCurrency(contract.meta.additionalFee || 0, contract.meta.currency)}
              </dd>
            </div>
            <div className="sm:col-span-2 bg-slate-50 p-6 rounded-lg border border-slate-100">
              <dt className="text-xs font-bold uppercase text-slate-400 mb-3">New Deliverables / Changes</dt>
              <dd className="text-base text-slate-700 whitespace-pre-wrap leading-relaxed">
                {contract.meta.newDeliverables}
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
                  <span className="text-3xl font-bold text-emerald-600 tracking-tight">
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
               <p className="text-slate-600 leading-relaxed text-base">
                 {contract.meta.description}
               </p>
             </div>

             {contract.meta.deliverablesList && contract.meta.deliverablesList.length > 0 && (
               <div className="space-y-3">
                 <h4 className="text-sm font-bold text-slate-900">Deliverables</h4>
                 <ul className="grid grid-cols-1 gap-2">
                   {contract.meta.deliverablesList.map((item, i) => (
                     <li key={i} className="flex items-start text-slate-700 bg-white p-3 border border-slate-100 rounded-md shadow-sm">
                       <span className="h-5 w-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                         {i + 1}
                       </span>
                       {item}
                     </li>
                   ))}
                 </ul>
               </div>
             )}
          </div>
        )}

        {/* NDA TEMPLATE */}
        {contract.template === 'NDA' && (
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
             <h4 className="text-sm font-bold text-slate-900 mb-3">Purpose of Disclosure</h4>
             <p className="text-slate-700 leading-relaxed">
               {contract.meta.description || 'Confidential information exchange regarding potential partnership.'}
             </p>
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
                <div className="prose prose-sm prose-slate max-w-none text-slate-600 font-sans whitespace-pre-wrap leading-relaxed h-[400px] overflow-y-auto pr-4 custom-scrollbar bg-white p-6 rounded-md shadow-inner border border-slate-100">
                  {contract.legalText || getTemplate(contract.template).legalText}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

    </div>
  );
}
