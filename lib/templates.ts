// Contract Templates - Source of Truth for InstaPact
import { ContractTemplate, TemplateType } from '@/types';

export const TEMPLATES: Record<TemplateType, ContractTemplate> = {
  SCOPE: {
    id: 'SCOPE',
    name: 'Scope Change Agreement',
    description: 'Document changes to project scope with additional fees',
    icon: 'FileEdit',
    fields: [
      {
        name: 'documentTitle',
        label: 'Agreement Title',
        type: 'text',
        placeholder: 'e.g., Scope Change Agreement',
        required: true,
      },
      {
        name: 'clientName',
        label: 'Client Name',
        type: 'text',
        placeholder: 'Enter client or company name',
        required: true,
      },
      {
        name: 'clientEmail',
        label: 'Client Email',
        type: 'email',
        placeholder: 'client@example.com',
        required: true,
      },
      {
        name: 'originalProjectRef',
        label: 'Original Project Reference',
        type: 'text',
        placeholder: 'e.g., Website Redesign - Phase 1',
        required: true,
      },
      {
        name: 'newDeliverables',
        label: 'New Deliverables',
        type: 'textarea',
        placeholder: 'Describe the additional work or changes requested...',
        required: true,
      },
      {
        name: 'additionalFee',
        label: 'Additional Fee',
        type: 'number',
        placeholder: '0.00',
        required: true,
      },
      {
        name: 'currency',
        label: 'Currency',
        type: 'select',
        required: true,
        options: [
          { value: 'USD', label: 'USD ($)' },
          { value: 'INR', label: 'INR (₹)' },
        ],
      },
    ],
    legalText: `SCOPE CHANGE AGREEMENT

This Scope Change Agreement ("Amendment") is entered into as of the date of digital signature below.

1. PARTIES
This Amendment is between the Service Provider ("Creator") and the Client ("Signer") identified in this document.

2. REFERENCE TO ORIGINAL AGREEMENT
This Amendment modifies the original project agreement referenced herein.

3. SCOPE MODIFICATIONS
The parties agree to modify the project scope as detailed in this document. The additional deliverables and associated fees are binding upon digital acceptance.

4. ADDITIONAL COMPENSATION
The Client agrees to pay the additional fee specified for the scope changes. Payment terms follow the original agreement unless otherwise specified.

5. TIMELINE IMPACT
The parties acknowledge that scope changes may affect the original project timeline. Any timeline modifications will be communicated separately.

6. INTEGRATION
This Amendment is incorporated into and made a part of the original agreement. All other terms and conditions of the original agreement remain in full force and effect.

7. DIGITAL ACCEPTANCE
By signing this document digitally, both parties acknowledge receipt, understanding, and acceptance of the modified scope and associated costs.

8. GOVERNING LAW
This Amendment shall be governed by the laws applicable to the original agreement.`,
  },

  NDA: {
    id: 'NDA',
    name: 'Non-Disclosure Agreement',
    description: 'Protect confidential information with a mutual NDA',
    icon: 'Shield',
    fields: [
      {
        name: 'documentTitle',
        label: 'Agreement Title',
        type: 'text',
        placeholder: 'e.g., Non-Disclosure Agreement',
        required: true,
      },
      {
        name: 'clientName',
        label: 'Client/Company Name',
        type: 'text',
        placeholder: 'Enter client or company name',
        required: true,
      },
      {
        name: 'clientEmail',
        label: 'Client Email',
        type: 'email',
        placeholder: 'client@example.com',
        required: false,
      },
      {
        name: 'description',
        label: 'Purpose of Disclosure',
        type: 'textarea',
        placeholder: 'Describe the nature of confidential information to be shared...',
        required: true,
      },
    ],
    legalText: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of the date of digital signature below.

1. PARTIES
This Agreement is between the Disclosing Party and the Receiving Party as identified in this document.

2. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means any and all non-public information, including but not limited to:
- Business strategies, plans, and projections
- Technical data, trade secrets, and know-how
- Financial information and pricing
- Customer and supplier information
- Product designs and specifications
- Any other information marked or designated as confidential

3. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees to:
a) Hold all Confidential Information in strict confidence
b) Use the Confidential Information solely for the purpose stated herein
c) Not disclose Confidential Information to any third party without prior written consent
d) Protect Confidential Information with the same degree of care used to protect its own confidential information

4. EXCLUSIONS
Confidential Information does not include information that:
a) Is or becomes publicly available through no fault of the Receiving Party
b) Was rightfully in the Receiving Party's possession prior to disclosure
c) Is independently developed without use of Confidential Information
d) Is disclosed with the written approval of the Disclosing Party

5. TERM
This Agreement shall remain in effect for a period of two (2) years from the date of execution.

6. RETURN OF MATERIALS
Upon request or termination of this Agreement, the Receiving Party shall promptly return or destroy all Confidential Information.

7. NO LICENSE
Nothing in this Agreement grants any rights to intellectual property.

8. REMEDIES
The parties acknowledge that breach may cause irreparable harm for which monetary damages may be inadequate.

9. DIGITAL ACCEPTANCE
By signing this document digitally, both parties acknowledge receipt, understanding, and acceptance of these terms.

10. GOVERNING LAW
This Agreement shall be governed by applicable laws.`,
  },

  DEAL: {
    id: 'DEAL',
    name: 'Freelance Service Agreement',
    description: 'Complete freelance project agreement with deliverables and payment',
    icon: 'Handshake',
    fields: [
      {
        name: 'documentTitle',
        label: 'Agreement Title',
        type: 'text',
        placeholder: 'e.g., Freelance Service Agreement',
        required: true,
      },
      {
        name: 'clientName',
        label: 'Client Name',
        type: 'text',
        placeholder: 'Enter client or company name',
        required: true,
      },
      {
        name: 'clientEmail',
        label: 'Client Email',
        type: 'email',
        placeholder: 'client@example.com',
        required: false,
      },
      {
        name: 'description',
        label: 'Project Description',
        type: 'textarea',
        placeholder: 'Describe the project objectives and goals...',
        required: true,
      },
      {
        name: 'deliverablesList',
        label: 'Deliverables',
        type: 'textarea',
        placeholder: 'List each deliverable on a new line...',
        required: true,
      },
      {
        name: 'timeline',
        label: 'Project Timeline',
        type: 'text',
        placeholder: 'e.g., 4 weeks, Delivered by Jan 20th',
        required: false,
      },
      {
        name: 'amount',
        label: 'Total Fee',
        type: 'number',
        placeholder: '0.00',
        required: true,
      },
      {
        name: 'currency',
        label: 'Currency',
        type: 'select',
        required: true,
        options: [
          { value: 'USD', label: 'USD ($)' },
          { value: 'INR', label: 'INR (₹)' },
        ],
      },
      {
        name: 'paymentSchedule',
        label: 'Payment Schedule',
        type: 'select',
        required: true,
        options: [
          { value: 'upfront', label: '100% Upfront' },
          { value: '50-50', label: '50% Upfront, 50% on Completion' },
          { value: 'milestone', label: 'Milestone-based' },
          { value: 'completion', label: '100% on Completion' },
        ],
      },
    ],
    legalText: `FREELANCE SERVICE AGREEMENT

This Freelance Service Agreement ("Agreement") is entered into as of the date of digital signature below.

1. PARTIES
This Agreement is between the Service Provider ("Freelancer") and the Client as identified in this document.

2. SCOPE OF WORK
The Freelancer agrees to provide the services and deliverables as described in this document. Any work outside this scope requires a separate Scope Change Agreement.

3. DELIVERABLES
The specific deliverables are listed in this document. Each deliverable shall meet professional standards and be delivered in appropriate formats.

4. COMPENSATION
a) The Client agrees to pay the Total Fee as specified in this document
b) Payment shall be made according to the Payment Schedule selected
c) Late payments may incur additional fees at the Freelancer's discretion

5. TIMELINE
The project timeline will be mutually agreed upon. Delays caused by the Client may extend deadlines accordingly.

6. REVISIONS
a) This Agreement includes up to two (2) rounds of revisions per deliverable
b) Additional revisions may be subject to additional fees
c) Revision requests must be submitted within 7 days of deliverable submission

7. INTELLECTUAL PROPERTY
a) Upon full payment, the Client receives full rights to the final deliverables
b) The Freelancer retains the right to display work in portfolio
c) Work-in-progress and unused concepts remain the Freelancer's property

8. CONFIDENTIALITY
Both parties agree to maintain confidentiality of proprietary information shared during the project.

9. TERMINATION
a) Either party may terminate with 14 days written notice
b) Upon termination, the Client shall pay for all work completed
c) Deposits are non-refundable once work has commenced

10. LIMITATION OF LIABILITY
The Freelancer's liability is limited to the amount paid under this Agreement.

11. INDEPENDENT CONTRACTOR
The Freelancer is an independent contractor, not an employee of the Client.

12. DIGITAL ACCEPTANCE
By signing this document digitally, both parties acknowledge receipt, understanding, and acceptance of all terms and conditions.

13. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the parties.

14. GOVERNING LAW
This Agreement shall be governed by applicable laws.`,
  },
};

export const getTemplate = (type: TemplateType): ContractTemplate => {
  return TEMPLATES[type];
};

export const getAllTemplates = (): ContractTemplate[] => {
  return Object.values(TEMPLATES);
};

export const formatCurrency = (amount: number, currency: 'USD' | 'INR'): string => {
  const formatter = new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
};
