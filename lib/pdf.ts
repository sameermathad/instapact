// PDF Generation for InstaPact Contracts
import jsPDF from 'jspdf';
import { Contract } from '@/types';
import { getTemplate, formatCurrency } from './templates';
import { formatDate } from './utils';
import SHA256 from 'crypto-js/sha256';
import QRCode from 'qrcode';

// --- Configuration & Constants ---
const COLORS = {
  primary: [79, 70, 229], // Indigo-600
  secondary: [241, 245, 249], // Slate-100
  textDark: [15, 23, 42], // Slate-900
  textMedium: [51, 65, 85], // Slate-700
  textLight: [100, 116, 139], // Slate-500
  border: [226, 232, 240], // Slate-200
  success: [22, 163, 74], // Green-600
  successBg: [220, 252, 231], // Green-100
  boxBg: [243, 244, 246], // #F3F4F6 - Light Grey
};

const FONTS = {
  header: 'helvetica',
  body: 'helvetica',
  mono: 'courier',
};

const MARGIN = 20;

// --- Helper Functions ---

const LOGO_BASE64 = 'data:image/png;base64,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';

const drawLogo = (doc: jsPDF, x: number, y: number) => {
  // Draw the new image Logo icon
  try {
    doc.addImage(LOGO_BASE64, 'PNG', x, y, 12, 12);
  } catch (e) {
    // Fallback to custom icon if image fails
    doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.roundedRect(x, y, 12, 12, 3, 3, 'F');
  }

  // Text: InstaPact
  doc.setFont(FONTS.header, 'bold');
  doc.setFontSize(18);
  doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
  doc.text('Insta', x + 16, y + 8.5);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text('Pact', x + 16 + doc.getTextWidth('Insta'), y + 8.5);
};

const drawDigitalStamp = (doc: jsPDF, x: number, y: number, status: 'signed' | 'pending' = 'signed') => {
  const isPending = status === 'pending';
  
  doc.setDrawColor(isPending ? COLORS.textLight[0] : COLORS.success[0], isPending ? COLORS.textLight[1] : COLORS.success[1], isPending ? COLORS.textLight[2] : COLORS.success[2]);
  doc.setFillColor(isPending ? COLORS.secondary[0] : COLORS.successBg[0], isPending ? COLORS.secondary[1] : COLORS.successBg[1], isPending ? COLORS.secondary[2] : COLORS.successBg[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(x, y, 40, 10, 2, 2, 'FD'); 
  
  doc.setTextColor(isPending ? COLORS.textLight[0] : COLORS.success[0], isPending ? COLORS.textLight[1] : COLORS.success[1], isPending ? COLORS.textLight[2] : COLORS.success[2]);
  doc.setFontSize(7);
  doc.setFont(FONTS.header, 'bold');
  
  const cx = x + 20;
  const cy = y + 5;
  doc.text(isPending ? 'PENDING SIGNATURE' : 'ELECTRONICALLY SIGNED', cx, cy + 1.5, { align: 'center', angle: 0 });
};

const drawSectionHeader = (doc: jsPDF, title: string, y: number) => {
  doc.setFont(FONTS.header, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
  doc.text(title.toUpperCase(), MARGIN, y);
  
  doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y + 3, doc.internal.pageSize.getWidth() - MARGIN, y + 3);
  return y + 12;
};

const drawFooter = (doc: jsPDF, pageNum: number) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
  doc.setLineWidth(0.1);
  doc.line(MARGIN, pageHeight - 15, pageWidth - MARGIN, pageHeight - 15);
  
  doc.setFontSize(8);
  doc.setFont(FONTS.body, 'normal');
  doc.setTextColor(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
  doc.text('Powered by InstaPact.in', MARGIN, pageHeight - 8);
  doc.text(`Page ${pageNum}`, pageWidth - MARGIN - 10, pageHeight - 8);
};

// --- Generate Logic ---

export async function generateContractPDF(contract: Contract, isPreview: boolean = false): Promise<jsPDF> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - (MARGIN * 2);
  let yPos = 20;

  // 1. Header (2-Column)
  drawLogo(doc, MARGIN, yPos);
  
  // Right Side: ID & Date
  doc.setFontSize(9);
  doc.setFont(FONTS.header, 'bold');
  doc.setTextColor(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
  const dateText = formatDate(contract.createdAt);
  const idText = `ID: ${contract.id.toUpperCase()}`;
  
  const rightAlignX = pageWidth - MARGIN;
  doc.text(idText, rightAlignX, yPos + 4, { align: 'right' });
  
  doc.setFont(FONTS.header, 'normal');
  doc.text(dateText, rightAlignX, yPos + 10, { align: 'right' });

  yPos += 30;

  // Title
  doc.setFont(FONTS.header, 'bold');
  doc.setFontSize(24);
  doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
  const title = contract.meta.documentTitle || getTemplate(contract.template).name;
  doc.text(title, MARGIN, yPos);

  // Electronic Stamp (Top Right aligned with Title)
  if (contract.status === 'signed' || isPreview) {
     drawDigitalStamp(doc, pageWidth - MARGIN - 40, yPos - 8, isPreview ? 'pending' : 'signed');
  }

  yPos += 30;

  // 2. Parties Section (Boxed & Side-by-Side)
  yPos = drawSectionHeader(doc, '1. PARTIES', yPos);
  yPos += 5; // Extra spacing

  const boxWidth = (contentWidth - 10) / 2;
  const boxHeight = 45;
  
  // Service Provider Box
  doc.setFillColor(COLORS.boxBg[0], COLORS.boxBg[1], COLORS.boxBg[2]);
  doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
  doc.roundedRect(MARGIN, yPos, boxWidth, boxHeight, 2, 2, 'FD');
  
  // Client Box
  doc.roundedRect(MARGIN + boxWidth + 10, yPos, boxWidth, boxHeight, 2, 2, 'FD');

  const printPartyDetails = (x: number, y: number, role: string, name: string, email: string) => {
      doc.setFontSize(8);
      doc.setFont(FONTS.header, 'bold');
      doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]); // Indigo label
      doc.text(role.toUpperCase(), x, y);
      
      doc.setFontSize(11);
      doc.setFont(FONTS.header, 'bold');
      doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
      doc.text(name, x, y + 8);
      
      doc.setFontSize(9);
      doc.setFont(FONTS.body, 'normal');
      doc.setTextColor(COLORS.textMedium[0], COLORS.textMedium[1], COLORS.textMedium[2]);
      doc.text(email, x, y + 16);
  };

  printPartyDetails(MARGIN + 10, yPos + 10, 'SERVICE PROVIDER', contract.creatorName, contract.creatorEmail);
  printPartyDetails(MARGIN + boxWidth + 20, yPos + 10, 'CLIENT', contract.meta.clientName, contract.meta.clientEmail || '');

  yPos += boxHeight + 25;

  // 3. Agreement Terms (Dynamic Data)
  yPos = drawSectionHeader(doc, '2. KEY TERMS', yPos);
  yPos += 5;

  const renderDetail = (label: string, value: string | null | undefined, isCurrency = false) => {
    if (!value) return;
    
    doc.setFontSize(10);
    doc.setFont(FONTS.header, 'bold');
    doc.setTextColor(COLORS.textMedium[0], COLORS.textMedium[1], COLORS.textMedium[2]);
    doc.text(label, MARGIN, yPos);

    const valueX = MARGIN + 50;
    
    doc.setFont(FONTS.body, isCurrency ? 'bold' : 'normal'); // Bold amounts
    if (isCurrency) {
        doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
    } else {
        doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
    }
    
    const splitValue = doc.splitTextToSize(value, contentWidth - 50);
    doc.text(splitValue, valueX, yPos);
    
    yPos += (splitValue.length * 6) + 8; // Comfortable spacing
  };

  // RENDER BASED ON TEMPLATE
  if (contract.template === 'SCOPE') {
      renderDetail('Original Project:', contract.meta.originalProjectRef);
      renderDetail('New Deliverables:', contract.meta.newDeliverables);
      renderDetail('Additional Fee:', formatCurrency(contract.meta.additionalFee || 0, contract.meta.currency), true);
  } else if (contract.template === 'NDA') {
      renderDetail('Effective Date:', formatDate(contract.createdAt));
      renderDetail('Term:', '2 Years');
      renderDetail('Purpose:', contract.meta.description);
  } else if (contract.template === 'DEAL') {
      renderDetail('Project:', contract.meta.description);
      renderDetail('Total Fee:', formatCurrency(contract.meta.amount || 0, contract.meta.currency), true);
      renderDetail('Payment:', contract.meta.paymentSchedule === 'upfront' ? '100% Upfront' : contract.meta.paymentSchedule);
      if (contract.meta.deliverablesList) {
          renderDetail('Deliverables:', (contract.meta.deliverablesList as unknown as string[]).join(', '));
      }
  }

  drawFooter(doc, 1);

  // 4. Legal Text Page
  doc.addPage();
  drawLogo(doc, MARGIN, 20);
  yPos = 40;
  
  const legalText = contract.legalText || getTemplate(contract.template).legalText;
  const sections = legalText.split('\n');
  
  doc.setFontSize(9);
  doc.setTextColor(COLORS.textMedium[0], COLORS.textMedium[1], COLORS.textMedium[2]);
  
  const pageHeight = doc.internal.pageSize.getHeight();

  sections.forEach((line) => {
      const isHeader = /^\d+\.\s/.test(line) || line.includes('AGREEMENT');
      
      if (yPos > pageHeight - 40) {
          drawFooter(doc, doc.getCurrentPageInfo().pageNumber);
          doc.addPage();
          yPos = 30;
      }

      if (line.trim() === '') {
          yPos += 1; 
          return;
      }

      if (isHeader) {
          yPos += 3; 
          doc.setFont(FONTS.header, 'bold');
          doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
          doc.text(line.toUpperCase(), MARGIN, yPos);
          yPos += 6; 
      } else {
          doc.setFont(FONTS.body, 'normal');
          doc.setTextColor(COLORS.textMedium[0], COLORS.textMedium[1], COLORS.textMedium[2]);
          const splitLine = doc.splitTextToSize(line, contentWidth);
          doc.text(splitLine, MARGIN, yPos);
          yPos += (splitLine.length * 4.5) + 1; 
      }
  });

  // End of Document Marker
  yPos += 12;
  doc.setFont(FONTS.mono, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
  doc.text('*** END OF AGREEMENT ***', pageWidth / 2, yPos, { align: 'center' });

  drawFooter(doc, doc.getCurrentPageInfo().pageNumber);

  // 5. Audit Trail Page
  if (isPreview || (contract.status === 'signed' && contract.auditTrail)) {
      doc.addPage();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Clean Header (No Block)
      yPos = 30;
      doc.setFont(FONTS.header, 'bold');
      doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
      doc.setFontSize(24);
      doc.text('Audit Trail & Evidence Log', MARGIN, yPos);
      
      doc.setFontSize(10);
      doc.setFont(FONTS.header, 'normal');
      doc.setTextColor(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
      doc.text('InstaPact Electronic Signature Verification', MARGIN, yPos + 6);

      // QR Code (Top Right)
      const qrDataUrl = await QRCode.toDataURL(`https://instapact.in/s/${contract.id}`, { width: 100, margin: 0 });
      doc.addImage(qrDataUrl, 'PNG', pageWidth - MARGIN - 32, yPos - 10, 32, 32);

      yPos += 40;

      // Hashing Logic (Empty for preview)
      let docHash = '----------------------------------------------------------------';
      if (!isPreview && contract.auditTrail) {
          const rawData = JSON.stringify({
              id: contract.id,
              created: contract.createdAt,
              signed: contract.auditTrail.signedAt,
              signer: contract.auditTrail.signerEmail,
              ip: contract.auditTrail.signerIp
          });
          docHash = SHA256(rawData).toString();
      }

      // Document Metadata Section
      doc.setFont(FONTS.header, 'bold');
      doc.setFontSize(10);
      doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
      doc.text('DOCUMENT METADATA', MARGIN, yPos);
      yPos += 8;
      
      const metaData = [
          ['CONTRACT ID', contract.id.toUpperCase()],
          ['DOCUMENT HASH', docHash],
          ['TEMPLATE', getTemplate(contract.template).name],
          ['CREATED', formatDate(contract.createdAt)],
      ];

      doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
      doc.setLineWidth(0.1);

      metaData.forEach(([label, value]) => {
          doc.setFont(FONTS.body, 'bold');
          doc.setFontSize(8);
          doc.setTextColor(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
          doc.text(label, MARGIN, yPos + 5);
          
          doc.setFont(FONTS.mono, 'normal');
          if (label.includes('HASH')) {
              doc.setFontSize(7);
          } else {
              doc.setFontSize(9);
          }
          doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
          
          if (label.includes('HASH')) {
             doc.text(value, MARGIN + 50, yPos + 5);
          } else {
             const splitVal = doc.splitTextToSize(value, contentWidth - 60);
             doc.text(splitVal, MARGIN + 50, yPos + 5);
          }
          
          doc.line(MARGIN, yPos + 10, pageWidth - MARGIN, yPos + 10);
          yPos += 12;
      });

      yPos += 15;

      // Signature Evidence Section (Striped)
      doc.setFont(FONTS.header, 'bold');
      doc.setFontSize(10);
      doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
      doc.text('SIGNATURE EVIDENCE', MARGIN, yPos);
      yPos += 8;
      
      const evidenceData = isPreview ? [
          ['SIGNER NAME', 'PENDING...'],
          ['SIGNER EMAIL', 'PENDING...'],
          ['TIMESTAMP', 'PENDING...'],
          ['IP ADDRESS', 'PENDING...'],
          ['DEVICE AGENT', 'PENDING...'],
      ] : [
          ['SIGNER NAME', contract.auditTrail?.signerName || ''],
          ['SIGNER EMAIL', contract.auditTrail?.signerEmail || ''],
          ['TIMESTAMP', contract.auditTrail ? formatDate(contract.auditTrail.signedAt) : ''],
          ['IP ADDRESS', contract.auditTrail?.signerIp || ''],
          ['DEVICE AGENT', (contract.auditTrail?.userAgent || '').substring(0, 50) + '...'],
      ];

      evidenceData.forEach(([label, value], index) => {
          doc.setFillColor(249, 250, 251); // #F9FAFB
          doc.rect(MARGIN, yPos, pageWidth - (MARGIN * 2), 12, 'F');

          doc.setFont(FONTS.body, 'bold');
          doc.setFontSize(8);
          doc.setTextColor(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
          doc.text(label, MARGIN + 4, yPos + 8); // +4 padding
          
          doc.setFont(FONTS.mono, 'normal');
          doc.setFontSize(9);
          doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
          doc.text(value, MARGIN + 54, yPos + 8); 
          
          yPos += 14; // Spacing
      });
      
      // Seal (Omit for preview)
      if (!isPreview) {
          yPos += 20; 
          const sealX = (pageWidth / 2) + 40;
          const sealY = yPos + 10;
          const sealRadius = 24;
          const blueColor = [30, 58, 138];
          
          doc.setDrawColor(blueColor[0], blueColor[1], blueColor[2]);
          doc.setFillColor(255, 255, 255);
          doc.setLineWidth(1);
          doc.circle(sealX, sealY, sealRadius, 'FD');
          
          doc.setDrawColor(blueColor[0], blueColor[1], blueColor[2]);
          doc.setLineWidth(0.5);
          doc.circle(sealX, sealY, sealRadius - 2, 'S');
          
          const angle = 10;
          doc.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
          doc.setFont(FONTS.header, 'bold');
          
          doc.setFontSize(7);
          doc.text('OFFICIALLY', sealX, sealY - 4, { align: 'center', angle: angle });
          
          doc.setFontSize(9);
          doc.text('SIGNED', sealX, sealY + 1, { align: 'center', angle: angle });
          
          doc.setFontSize(6);
          doc.text('SECURED BY INSTAPACT', sealX, sealY + 5, { align: 'center', angle: angle });
          
          doc.setFontSize(14);
          doc.text('✓', sealX, sealY + 10, { align: 'center', angle: angle });
      }

      drawFooter(doc, doc.getCurrentPageInfo().pageNumber);
  }

  return doc;
}

export async function downloadContractPDF(contract: Contract, isPreview: boolean = false): Promise<void> {
  const doc = await generateContractPDF(contract, isPreview);
  const suffix = isPreview ? 'preview' : 'signed';
  doc.save(`instapact-${contract.id.slice(0,8)}-${suffix}.pdf`);
}

export async function getContractPDFBlob(contract: Contract, isPreview: boolean = false): Promise<Blob> {
    const doc = await generateContractPDF(contract, isPreview);
    return doc.output('blob');
}
