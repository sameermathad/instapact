// PDF Generation for InstaPact Contracts
import jsPDF from 'jspdf';
import { Contract } from '@/types';
import { getTemplate, formatCurrency } from './templates';
import { formatDate } from './utils';

// Generate contract PDF with Certificate of Completion
export function generateContractPDF(contract: Contract): jsPDF {
  const doc = new jsPDF();
  const template = getTemplate(contract.template);
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Helper function to add wrapped text
  const addWrappedText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number = 7
  ): number => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * lineHeight;
  };

  // ============ PAGE 1: Contract Overview ============
  // Header
  doc.setFillColor(79, 70, 229); // Indigo
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('INSTAPACT', margin, 25);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(template.name, margin, 35);

  // Contract ID badge
  doc.setFillColor(16, 185, 129); // Emerald
  doc.roundedRect(pageWidth - margin - 50, 15, 50, 15, 3, 3, 'F');
  doc.setFontSize(10);
  doc.text(`ID: ${contract.id.toUpperCase()}`, pageWidth - margin - 45, 25);

  // Reset text color
  doc.setTextColor(30, 41, 59); // Slate-800

  let yPos = 55;

  // Status badge
  const statusColor =
    contract.status === 'signed'
      ? { r: 16, g: 185, b: 129 } // Emerald
      : { r: 100, g: 116, b: 139 }; // Slate
  doc.setFillColor(statusColor.r, statusColor.g, statusColor.b);
  doc.roundedRect(margin, yPos, 60, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(contract.status.toUpperCase(), margin + 5, yPos + 7);

  doc.setTextColor(30, 41, 59);
  yPos += 25;

  // Parties section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PARTIES', margin, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Service Provider (Creator)', margin, yPos);
  yPos += 6;
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text(contract.creatorName, margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(contract.creatorEmail, margin + 80, yPos);
  yPos += 12;

  doc.setTextColor(100, 116, 139);
  doc.text('Client (Signer)', margin, yPos);
  yPos += 6;
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text(contract.meta.clientName, margin, yPos);
  if (contract.meta.clientEmail) {
    doc.setFont('helvetica', 'normal');
    doc.text(contract.meta.clientEmail, margin + 80, yPos);
  }
  yPos += 15;

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Contract Details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('CONTRACT DETAILS', margin, yPos);
  yPos += 12;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  // Template-specific details
  if (contract.template === 'SCOPE') {
    doc.setTextColor(100, 116, 139);
    doc.text('Original Project:', margin, yPos);
    doc.setTextColor(30, 41, 59);
    doc.text(contract.meta.originalProjectRef || 'N/A', margin + 50, yPos);
    yPos += 8;

    doc.setTextColor(100, 116, 139);
    doc.text('Additional Fee:', margin, yPos);
    doc.setTextColor(16, 185, 129);
    doc.setFont('helvetica', 'bold');
    doc.text(
      formatCurrency(contract.meta.additionalFee || 0, contract.meta.currency),
      margin + 50,
      yPos
    );
    doc.setFont('helvetica', 'normal');
    yPos += 12;

    doc.setTextColor(100, 116, 139);
    doc.text('New Deliverables:', margin, yPos);
    yPos += 6;
    doc.setTextColor(30, 41, 59);
    yPos = addWrappedText(contract.meta.newDeliverables || 'N/A', margin, yPos, contentWidth);
  } else if (contract.template === 'DEAL') {
    doc.setTextColor(100, 116, 139);
    doc.text('Total Fee:', margin, yPos);
    doc.setTextColor(16, 185, 129);
    doc.setFont('helvetica', 'bold');
    doc.text(
      formatCurrency(contract.meta.amount || 0, contract.meta.currency),
      margin + 50,
      yPos
    );
    doc.setFont('helvetica', 'normal');
    yPos += 8;

    doc.setTextColor(100, 116, 139);
    doc.text('Payment:', margin, yPos);
    doc.setTextColor(30, 41, 59);
    doc.text(contract.meta.paymentSchedule || 'N/A', margin + 50, yPos);
    yPos += 12;

    doc.setTextColor(100, 116, 139);
    doc.text('Project Description:', margin, yPos);
    yPos += 6;
    doc.setTextColor(30, 41, 59);
    yPos = addWrappedText(contract.meta.description || 'N/A', margin, yPos, contentWidth);
    yPos += 5;

    if (contract.meta.deliverablesList && contract.meta.deliverablesList.length > 0) {
      doc.setTextColor(100, 116, 139);
      doc.text('Deliverables:', margin, yPos);
      yPos += 6;
      doc.setTextColor(30, 41, 59);
      contract.meta.deliverablesList.forEach((item) => {
        doc.text(`• ${item}`, margin + 5, yPos);
        yPos += 6;
      });
    }
  } else if (contract.template === 'NDA') {
    doc.setTextColor(100, 116, 139);
    doc.text('Purpose of Disclosure:', margin, yPos);
    yPos += 6;
    doc.setTextColor(30, 41, 59);
    yPos = addWrappedText(contract.meta.description || 'N/A', margin, yPos, contentWidth);
  }

  yPos += 10;

  // Dates
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Created: ${formatDate(contract.createdAt)}`, margin, yPos);
  doc.text(`Expires: ${formatDate(contract.expiresAt)}`, margin + 100, yPos);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'InstaPact is a technology platform, not a law firm. Use at your own risk.',
    margin,
    285
  );

  // ============ PAGE 2: Legal Terms ============
  doc.addPage();

  // Header
  doc.setFillColor(100, 116, 139); // Slate
  doc.rect(0, 0, pageWidth, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TERMS & CONDITIONS', margin, 20);

  doc.setTextColor(30, 41, 59);
  yPos = 45;

  // Legal text (using Times for legal look)
  doc.setFont('times', 'normal');
  doc.setFontSize(10);

  const legalLines = doc.splitTextToSize(template.legalText, contentWidth);
  const linesPerPage = 45;

  for (let i = 0; i < legalLines.length; i++) {
    if (yPos > 270) {
      doc.addPage();
      yPos = 30;
    }
    doc.text(legalLines[i], margin, yPos);
    yPos += 5;
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'InstaPact is a technology platform, not a law firm. Use at your own risk.',
    margin,
    285
  );

  // ============ PAGE 3: Certificate of Completion ============
  if (contract.status === 'signed' && contract.auditTrail) {
    doc.addPage();

    // Header with checkmark
    doc.setFillColor(16, 185, 129); // Emerald
    doc.rect(0, 0, pageWidth, 50, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATE OF COMPLETION', pageWidth / 2, 25, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('This document has been digitally signed', pageWidth / 2, 40, { align: 'center' });

    yPos = 70;

    // Certificate content
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Document Information', margin, yPos);
    yPos += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const certDetails = [
      ['Contract ID:', contract.id.toUpperCase()],
      ['Contract Type:', template.name],
      ['Creator:', `${contract.creatorName} (${contract.creatorEmail})`],
      ['Client:', `${contract.meta.clientName} (${contract.meta.clientEmail || 'N/A'})`],
    ];

    certDetails.forEach(([label, value]) => {
      doc.setTextColor(100, 116, 139);
      doc.text(label, margin, yPos);
      doc.setTextColor(30, 41, 59);
      doc.text(value, margin + 50, yPos);
      yPos += 10;
    });

    yPos += 10;

    // Divider
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(2);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    doc.setLineWidth(0.5);
    yPos += 15;

    // Audit Trail
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Digital Signature Audit Trail', margin, yPos);
    yPos += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const auditDetails = [
      ['Signer Name:', contract.auditTrail.signerName],
      ['Signer Email:', contract.auditTrail.signerEmail],
      ['Signed At:', formatDate(contract.auditTrail.signedAt)],
      ['IP Address:', contract.auditTrail.signerIp],
      ['User Agent:', contract.auditTrail.userAgent.substring(0, 80) + '...'],
    ];

    auditDetails.forEach(([label, value]) => {
      doc.setTextColor(100, 116, 139);
      doc.text(label, margin, yPos);
      doc.setTextColor(30, 41, 59);
      yPos = addWrappedText(value, margin + 50, yPos, contentWidth - 50, 6);
      yPos += 4;
    });

    yPos += 20;

    // Verification box
    doc.setFillColor(240, 253, 244); // Green-50
    doc.roundedRect(margin, yPos, contentWidth, 40, 5, 5, 'F');
    doc.setDrawColor(16, 185, 129);
    doc.roundedRect(margin, yPos, contentWidth, 40, 5, 5, 'S');

    doc.setTextColor(16, 185, 129);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('✓ VERIFIED DIGITAL SIGNATURE', pageWidth / 2, yPos + 15, { align: 'center' });

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'This certificate confirms the authenticity of the digital signature.',
      pageWidth / 2,
      yPos + 28,
      { align: 'center' }
    );

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'InstaPact is a technology platform, not a law firm. Use at your own risk.',
      margin,
      285
    );
    doc.text(`Generated: ${formatDate(new Date())}`, pageWidth - margin - 60, 285);
  }

  return doc;
}

// Download the PDF
export function downloadContractPDF(contract: Contract): void {
  const doc = generateContractPDF(contract);
  const filename = `instapact-${contract.template.toLowerCase()}-${contract.id}.pdf`;
  doc.save(filename);
}

// Get PDF as blob for email attachment
export function getContractPDFBlob(contract: Contract): Blob {
  const doc = generateContractPDF(contract);
  return doc.output('blob');
}
