"use client"

import { useState } from "react"
import { Contract, TemplateType } from "@/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MoreHorizontal, 
  Copy, 
  ExternalLink, 
  FileText, 
  Shield, 
  Handshake,
  CheckCircle2,
  Clock
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { formatDate, getSigningUrl, copyToClipboard } from "@/lib/utils"
import { toast } from "sonner"
import { downloadContractPDF } from "@/lib/pdf"

interface ContractCardProps {
  contract: Contract
}

export function ContractCard({ contract }: ContractCardProps) {
  const getIcon = () => {
    switch (contract.template) {
      case 'SCOPE': return <FileText className="h-5 w-5 text-indigo-600" />;
      case 'NDA': return <Shield className="h-5 w-5 text-indigo-600" />;
      case 'DEAL': return <Handshake className="h-5 w-5 text-indigo-600" />;
      default: return <FileText className="h-5 w-5 text-indigo-600" />;
    }
  };

  const statusVariant = {
    pending: "secondary",
    signed: "success",
    expired: "destructive"
  } as const;

  const handleCopyLink = async () => {
    const url = getSigningUrl(contract.id);
    const success = await copyToClipboard(url);
    if (success) {
      toast.success("Link copied to clipboard");
    } else {
      toast.error("Failed to copy link");
    }
  };

  const handleDownload = () => {
    downloadContractPDF(contract);
    toast.success("Downloading PDF...");
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            {getIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 leading-none mb-1">
              {contract.meta.clientName}
            </h3>
            <p className="text-sm text-slate-500">
              {contract.template === 'SCOPE' && 'Scope Change'}
              {contract.template === 'NDA' && 'NDA'}
              {contract.template === 'DEAL' && 'Freelance Deal'}
            </p>
          </div>
        </div>
        <Badge variant={statusVariant[contract.status]}>
          {contract.status.toUpperCase()}
        </Badge>
      </CardHeader>
      
      <CardContent className="pt-4 pb-2">
        <div className="text-sm text-slate-600 space-y-1">
           {contract.meta.amount && (
             <p className="font-medium text-slate-900">
               {new Intl.NumberFormat('en-US', { style: 'currency', currency: contract.meta.currency }).format(contract.meta.amount)}
             </p>
           )}
           <p className="line-clamp-2 text-xs text-slate-500">
             {contract.meta.description || contract.meta.originalProjectRef || contract.meta.newDeliverables || "No description"}
           </p>
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-slate-50 bg-slate-50/50 mt-2 flex justify-between items-center text-xs text-slate-400">
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {formatDate(contract.createdAt)}
        </div>
        
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyLink} title="Copy Link">
            <Copy className="h-4 w-4 text-slate-500" />
          </Button>
          
          {contract.status === 'signed' ? (
             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload} title="Download Proof">
               <CheckCircle2 className="h-4 w-4 text-emerald-600" />
             </Button>
          ) : (
             <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="View Signing Page">
               <a href={`/s/${contract.id}`} target="_blank" rel="noopener noreferrer">
                 <ExternalLink className="h-4 w-4 text-slate-500" />
               </a>
             </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopyLink}>
                <Copy className="h-4 w-4 mr-2" /> Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={`/s/${contract.id}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" /> View Page
                </a>
              </DropdownMenuItem>
              {contract.status === 'signed' && (
                <DropdownMenuItem onClick={handleDownload}>
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Download Proof
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  )
}
