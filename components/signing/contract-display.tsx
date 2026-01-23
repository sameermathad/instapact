import { Contract } from '@/types';
import { formatCurrency } from '@/lib/templates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, Shield, Handshake, Calendar, DollarSign, User, Mail } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ContractDisplayProps {
  contract: Contract;
}

export function ContractDisplay({ contract }: ContractDisplayProps) {
  const getIcon = () => {
    switch (contract.template) {
      case 'SCOPE': return <FileText className="h-6 w-6 text-indigo-600" />;
      case 'NDA': return <Shield className="h-6 w-6 text-indigo-600" />;
      case 'DEAL': return <Handshake className="h-6 w-6 text-indigo-600" />;
      default: return <FileText className="h-6 w-6 text-indigo-600" />;
    }
  };

  const getTemplateLabel = () => {
    switch (contract.template) {
      case 'SCOPE': return 'Scope Change';
      case 'NDA': return 'Non-Disclosure Agreement';
      case 'DEAL': return 'Freelance Agreement';
      default: return 'Contract';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-t-4 border-t-indigo-600 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-50 rounded-full">
                {getIcon()}
              </div>
              <div>
                <CardTitle className="text-xl">{getTemplateLabel()}</CardTitle>
                <CardDescription>ID: {contract.id.toUpperCase()}</CardDescription>
              </div>
            </div>
            <Badge variant={contract.status === 'signed' ? 'success' : 'secondary'}>
              {contract.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-md">
              <User className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500">Service Provider</p>
                <p className="font-semibold text-slate-900">{contract.creatorName}</p>
                <p className="text-sm text-slate-500">{contract.creatorEmail}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-md">
              <User className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-500">Client</p>
                <p className="font-semibold text-slate-900">{contract.meta.clientName}</p>
                {contract.meta.clientEmail && (
                  <p className="text-sm text-slate-500">{contract.meta.clientEmail}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Details */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Agreement Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {contract.template === 'SCOPE' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-1">Original Project Reference</h4>
                <p className="text-slate-900">{contract.meta.originalProjectRef}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-md">
                  <div className="flex items-center space-x-2 mb-1">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">Additional Fee</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-700">
                    {formatCurrency(contract.meta.additionalFee || 0, contract.meta.currency)}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-1">New Deliverables</h4>
                <p className="text-slate-900 whitespace-pre-wrap">{contract.meta.newDeliverables}</p>
              </div>
            </div>
          )}

          {contract.template === 'DEAL' && (
            <div className="space-y-4">
               <div>
                <h4 className="text-sm font-medium text-slate-500 mb-1">Project Description</h4>
                <p className="text-slate-900 whitespace-pre-wrap">{contract.meta.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-md">
                  <div className="flex items-center space-x-2 mb-1">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">Total Fee</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-700">
                    {formatCurrency(contract.meta.amount || 0, contract.meta.currency)}
                  </p>
                </div>
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-md">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-800">Payment Schedule</span>
                  </div>
                  <p className="text-lg font-semibold text-indigo-900">
                    {contract.meta.paymentSchedule}
                  </p>
                </div>
              </div>
              {contract.meta.deliverablesList && (
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">Deliverables</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-900 bg-slate-50 p-4 rounded-md">
                    {contract.meta.deliverablesList.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {contract.template === 'NDA' && (
             <div>
                <h4 className="text-sm font-medium text-slate-500 mb-1">Purpose of Disclosure</h4>
                <p className="text-slate-900 whitespace-pre-wrap">{contract.meta.description}</p>
              </div>
          )}
        </CardContent>
      </Card>

      {/* Legal Text Accordion */}
      <Card className="shadow-sm overflow-hidden">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="legal-terms" className="border-b-0">
            <AccordionTrigger className="px-6 hover:no-underline hover:bg-slate-50">
              <span className="font-semibold text-slate-900">Review Legal Terms & Conditions</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-6 pb-6 pt-2">
                <div className="prose prose-sm prose-slate max-w-none text-slate-600 font-serif bg-slate-50 p-6 rounded-md border border-slate-100 h-64 overflow-y-auto">
                    {/* We would fetch the actual legal text here based on template */}
                    <p className="italic text-slate-400 mb-4">
                      Scroll to read the full terms...
                    </p>
                    {/* Placeholder for dynamic injection, though we usually render this server side or pass it in */}
                    The legal text associated with this {contract.template} agreement governs the relationship between {contract.creatorName} and {contract.meta.clientName}. 
                    <br /><br />
                    By signing, you agree to all terms herein.
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
      
      {/* Footer info */}
      <div className="text-center text-xs text-slate-400">
        <p>Created: {formatDate(contract.createdAt)}</p>
        <p>Expires: {formatDate(contract.expiresAt)}</p>
      </div>
    </div>
  );
}
