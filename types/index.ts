// Contract and Template Types for InstaPact

export type TemplateType = 'SCOPE' | 'NDA' | 'DEAL';

export type ContractStatus = 'pending' | 'signed' | 'expired';

export type Currency = 'USD' | 'INR';

export interface ContractMeta {
  clientName: string;
  clientEmail?: string;
  amount?: number;
  currency: Currency;
  description?: string;
  // Scope Change specific
  originalProjectRef?: string;
  newDeliverables?: string;
  additionalFee?: number;
  // Freelance Deal specific
  deliverablesList?: string[];
  paymentSchedule?: string;
}

export interface AuditTrail {
  signedAt: Date;
  signerIp: string;
  signerEmail: string;
  signerName: string;
  userAgent: string;
}

export interface Contract {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  template: TemplateType;
  status: ContractStatus;
  meta: ContractMeta;
  auditTrail: AuditTrail | null;
  createdAt: Date;
  expiresAt: Date;
  archived?: boolean;
  legalText?: string;
}

export interface FieldDefinition {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select';
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
}

export interface ContractTemplate {
  id: TemplateType;
  name: string;
  description: string;
  icon: string;
  fields: FieldDefinition[];
  legalText: string;
}

export interface Creator {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}
