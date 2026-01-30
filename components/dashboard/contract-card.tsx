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
  Clock,
  MessageSquare,
  AlertCircle
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { formatDate, getSigningUrl, copyToClipboard, stripHtml } from "@/lib/utils"
import { toast } from "sonner"
import { downloadContractPDF } from "@/lib/pdf"
import { deleteContract, archiveContract, unarchiveContract } from "@/lib/contracts"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2, Archive, RotateCcw } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
    expired: "destructive",
    revision_requested: "warning"
  } as const;

  const getStatusLabel = (status: string) => {
    if (status === 'revision_requested') return 'REVISION REQUESTED';
    return status.toUpperCase();
  };

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
    if (contract.signedUrl) {
      window.open(contract.signedUrl, '_blank');
      toast.success("Opening signed PDF...");
    } else {
      downloadContractPDF(contract);
      toast.success("Downloading PDF...");
    }
  };


  const handleArchive = async () => {
    try {
      await archiveContract(contract.id);
      toast.success("Agreement archived");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to archive agreement");
    }
  };

  const handleUnarchive = async () => {
    try {
      await unarchiveContract(contract.id);
      toast.success("Agreement restored");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to restore agreement");
    }
  };

   return (
    <Card className="hover:shadow-lg transition-all duration-200 group relative hover:scale-[1.01] active:scale-[0.99] cursor-pointer ring-offset-background focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2">
      <Link href={`/s/${contract.id}`} className="block">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-50 group-hover:bg-indigo-100 transition-colors rounded-lg">
              {getIcon()}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 leading-none mb-1 group-hover:text-indigo-600 transition-colors">
                {contract.meta.clientName}
              </h3>
              <p className="text-sm text-slate-500">
                {contract.template === 'SCOPE' && 'Scope Change'}
                {contract.template === 'NDA' && 'NDA'}
                {contract.template === 'DEAL' && 'Freelance Service Agreement'}
              </p>
            </div>
          </div>
          <Badge variant={statusVariant[contract.status as keyof typeof statusVariant] || 'secondary'}>
            {getStatusLabel(contract.status)}
          </Badge>
        </CardHeader>
        
        {contract.status === 'revision_requested' && contract.clientFeedback && (
          <div className="mx-4 mt-2 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-black text-red-800 uppercase tracking-widest mb-1">Client Feedback</p>
              <p className="text-xs text-red-700 italic line-clamp-2 leading-relaxed">
                "{contract.clientFeedback}"
              </p>
            </div>
          </div>
        )}
        
        <CardContent className="pt-4 pb-2">
          <div className="text-sm text-slate-600 space-y-1">
             {contract.meta.amount && (
               <p className="font-bold text-slate-900">
                 {new Intl.NumberFormat('en-US', { style: 'currency', currency: contract.meta.currency }).format(contract.meta.amount)}
               </p>
             )}
             <p className="line-clamp-2 text-xs text-slate-500">
               {stripHtml(contract.meta.description || contract.meta.originalProjectRef || contract.meta.newDeliverables) || "No description"}
             </p>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="pt-2 border-t border-slate-50 bg-slate-50/50 mt-2 flex justify-between items-center text-xs text-slate-400">
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {formatDate(contract.createdAt)}
        </div>
        
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleCopyLink(); }} title="Copy Link">
            <Copy className="h-4 w-4 text-slate-500" />
          </Button>
          
          {contract.status === 'signed' ? (
             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleDownload(); }} title="Download Proof">
               <CheckCircle2 className="h-4 w-4 text-emerald-600" />
             </Button>
          ) : (
             <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="View Signing Page" onClick={(e) => e.stopPropagation()}>
               <a href={`/s/${contract.id}`} target="_blank" rel="noopener noreferrer">
                 <ExternalLink className="h-4 w-4 text-slate-500" />
               </a>
             </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
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
              {contract.archived ? (
                <DropdownMenuItem onClick={handleUnarchive}>
                  <RotateCcw className="h-4 w-4 mr-2" /> Restore
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={handleArchive}>
                  <Archive className="h-4 w-4 mr-2" /> Archive
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </CardFooter>
    </Card>
  )
}
