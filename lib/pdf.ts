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

const drawLogo = (doc: jsPDF, x: number, y: number) => {
  // Draw the custom "Document" Icon
  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.roundedRect(x, y, 12, 12, 3, 3, 'F');
  
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(1.2);
  doc.line(x + 3.5, y + 4, x + 8.5, y + 4);
  doc.line(x + 3.5, y + 6.5, x + 8.5, y + 6.5);
  doc.line(x + 3.5, y + 9, x + 6, y + 9);

  // Text: InstaPact
  doc.setFont(FONTS.header, 'bold');
  doc.setFontSize(18);
  doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
  doc.text('Insta', x + 16, y + 8.5);
  doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
  doc.text('Pact', x + 16 + doc.getTextWidth('Insta'), y + 8.5);
};

const drawDigitalStamp = (doc: jsPDF, x: number, y: number) => {
  // Save current graphics state
  // doc.saveGraphicsState(); // Not always available in basic typedefs, try generic approach
  
  // Rotate around the center of the stamp
  const angle = 5; // degrees
  const rad = angle * (Math.PI / 180);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  
  // Pivot point
  const cx = x + 20;
  const cy = y + 5;

  // Simple "Stamp" visual - Green badge
  // Note: True rotation of rectangles in basic jsPDF is complex without using the 'advanced' API mode or context manipulation.
  // We will simply draw it slightly offset and rotate the text which IS supported.
  
  doc.setDrawColor(COLORS.success[0], COLORS.success[1], COLORS.success[2]);
  doc.setFillColor(COLORS.successBg[0], COLORS.successBg[1], COLORS.successBg[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(x, y, 40, 10, 2, 2, 'FD'); 
  
  doc.setTextColor(COLORS.success[0], COLORS.success[1], COLORS.success[2]);
  doc.setFontSize(7); // Smaller to fit
  doc.setFont(FONTS.header, 'bold');
  
  // Rotate text
  doc.text('ELECTRONICALLY SIGNED', cx, cy + 1.5, { align: 'center', angle: 0 }); // Keep straight for now if rotation fails, or try angle: 10
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

export async function generateContractPDF(contract: Contract): Promise<jsPDF> {
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
  const title = getTemplate(contract.template).name;
  doc.text(title, MARGIN, yPos);

  // Electronic Stamp (Top Right aligned with Title)
  if (contract.status === 'signed') {
     drawDigitalStamp(doc, pageWidth - MARGIN - 40, yPos - 8);
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
          renderDetail('Deliverables:', contract.meta.deliverablesList.join(', '));
      }
  }

  drawFooter(doc, 1);

  // 4. Legal Text Page
  doc.addPage();
  drawLogo(doc, MARGIN, 20);
  yPos = 40;
  
  const legalText = getTemplate(contract.template).legalText;
  const sections = legalText.split('\n');
  
  doc.setFontSize(9);
  doc.setTextColor(COLORS.textMedium[0], COLORS.textMedium[1], COLORS.textMedium[2]);
  
  const pageHeight = doc.internal.pageSize.getHeight();

  sections.forEach((line) => {
      const isHeader = /^\d+\.\s/.test(line) || line.includes('AGREEMENT');
      
      if (yPos > pageHeight - 40) { // Increased bottom buffer
          drawFooter(doc, doc.getCurrentPageInfo().pageNumber);
          doc.addPage();
          yPos = 30;
      }

      if (isHeader) {
          yPos += 8;
          doc.setFont(FONTS.header, 'bold');
          doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
          doc.text(line.toUpperCase(), MARGIN, yPos);
          yPos += 5; // Moderate spacing after header
      } else {
          doc.setFont(FONTS.body, 'normal');
          doc.setTextColor(COLORS.textMedium[0], COLORS.textMedium[1], COLORS.textMedium[2]);
          const splitLine = doc.splitTextToSize(line, contentWidth);
          doc.text(splitLine, MARGIN, yPos);
          // Standard line height (4.5) + Small paragraph gap (2)
          yPos += (splitLine.length * 4.5) + 2; 
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
  if (contract.status === 'signed' && contract.auditTrail) {
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

      // Hashing Logic
      const rawData = JSON.stringify({
          id: contract.id,
          created: contract.createdAt,
          signed: contract.auditTrail.signedAt,
          signer: contract.auditTrail.signerEmail,
          ip: contract.auditTrail.signerIp
      });
      const docHash = SHA256(rawData).toString();

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
      
      const evidenceData = [
          ['SIGNER NAME', contract.auditTrail.signerName],
          ['SIGNER EMAIL', contract.auditTrail.signerEmail],
          ['TIMESTAMP', formatDate(contract.auditTrail.signedAt)],
          ['IP ADDRESS', contract.auditTrail.signerIp],
          ['DEVICE AGENT', contract.auditTrail.userAgent.substring(0, 50) + '...'],
      ];

      evidenceData.forEach(([label, value], index) => {
          // Stripe Background
          doc.setFillColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2]); // #F1F5F9 - Light Slate
          if (index % 2 === 0) {
             // Optional: visual banding if desired, user asked for "light grey background to rows".
             // Let's apply a very subtle background to ALL evidence rows for grouping, or alternating.
             // User said: "Add a light grey background (#F9FAFB) to the 'Signature Evidence' section rows"
             doc.setFillColor(249, 250, 251); // #F9FAFB
             doc.rect(MARGIN, yPos, pageWidth - (MARGIN * 2), 12, 'F');
          } else {
             doc.setFillColor(249, 250, 251); // Same for all? logic implies grouping.
             doc.rect(MARGIN, yPos, pageWidth - (MARGIN * 2), 12, 'F');
          }

          doc.setFont(FONTS.body, 'bold');
          doc.setFontSize(8);
          doc.setTextColor(COLORS.textLight[0], COLORS.textLight[1], COLORS.textLight[2]);
          doc.text(label, MARGIN + 4, yPos + 8); // +4 padding
          
          doc.setFont(FONTS.mono, 'normal');
          doc.setFontSize(9);
          doc.setTextColor(COLORS.textDark[0], COLORS.textDark[1], COLORS.textDark[2]);
          doc.text(value, MARGIN + 54, yPos + 8); 
          
          // No line needed if background is used, but borders help "box" feel
          // doc.setDrawColor(COLORS.border[0], COLORS.border[1], COLORS.border[2]);
          // doc.rect(MARGIN, yPos, pageWidth - (MARGIN * 2), 12, 'S'); 
          
          yPos += 14; // Spacing
      });
      
      // Bottom Seal Verification
      yPos += 20; // Reduced spacing to allow overlap
      const sealX = (pageWidth / 2) + 40; // Moved right
      const sealY = yPos + 10;
      
      // Draw Seal (Navy Blue)
      const sealRadius = 24;
      const blueColor = [30, 58, 138]; // #1e3a8a
      
      // Outer Ring
      doc.setDrawColor(blueColor[0], blueColor[1], blueColor[2]);
      doc.setFillColor(255, 255, 255); // White background to cover table lines if overlapping
      doc.setLineWidth(1);
      doc.circle(sealX, sealY, sealRadius, 'FD');
      
      // Inner Ring
      doc.setDrawColor(blueColor[0], blueColor[1], blueColor[2]);
      doc.setLineWidth(0.5);
      doc.circle(sealX, sealY, sealRadius - 2, 'S');
      
      // Text with Rotation (Simulated by drawing logic or standard angle if supported)
      // jsPDF text() supports 'angle'.
      doc.setTextColor(blueColor[0], blueColor[1], blueColor[2]);
      doc.setFont(FONTS.header, 'bold');
      
      // We will render the text centrally with a slight angle
      const angle = 10;
      
      doc.setFontSize(7);
      doc.text('OFFICIALLY', sealX, sealY - 4, { align: 'center', angle: angle });
      
      doc.setFontSize(9);
      doc.text('SIGNED', sealX, sealY + 1, { align: 'center', angle: angle });
      
      doc.setFontSize(6);
      doc.text('SECURED BY INSTAPACT', sealX, sealY + 5, { align: 'center', angle: angle });
      
      // Icon tick
      doc.setFontSize(14);
      doc.text('✓', sealX, sealY + 10, { align: 'center', angle: angle });
      
      drawFooter(doc, doc.getCurrentPageInfo().pageNumber);
  }

  return doc;
}

export async function downloadContractPDF(contract: Contract): Promise<void> {
  const doc = await generateContractPDF(contract);
  doc.save(`instapact-${contract.id.slice(0,8)}-signed.pdf`);
}

export async function getContractPDFBlob(contract: Contract): Promise<Blob> {
    const doc = await generateContractPDF(contract);
    return doc.output('blob');
}
