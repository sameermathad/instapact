import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { adminDb, adminStorage } from '@/lib/firebase-admin';
import { generateContractPDF } from '@/lib/pdf';
import { Contract } from '@/types';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { contractId } = await request.json();

    if (!contractId) {
      return NextResponse.json({ error: 'Missing contractId' }, { status: 400 });
    }

    console.log(`[complete-signature] Processing completion (ADMIN) for ${contractId}`);

    // 0. Defensive Check for Admin SDK
    if (!adminDb || !adminStorage) {
      console.error('[complete-signature] Firebase Admin SDK not initialized');
      return NextResponse.json({ error: 'Server configuration error: Admin SDK missing' }, { status: 500 });
    }

    // 1. Fetch Contract Data from Firestore using Admin SDK
    const docRef = adminDb.collection('contracts').doc(contractId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const contractData = docSnap.data();
    if (!contractData) {
      return NextResponse.json({ error: 'Contract data is empty' }, { status: 404 });
    }

    const contract: Contract = {
      ...contractData,
      id: docSnap.id,
      createdAt: contractData.createdAt?.toDate() || new Date(),
      expiresAt: contractData.expiresAt?.toDate() || new Date(),
      auditTrail: contractData.auditTrail ? {
        ...contractData.auditTrail,
        signedAt: contractData.auditTrail.signedAt?.toDate() || new Date(),
      } : null,
    } as Contract;

    if (contract.status !== 'signed') {
      return NextResponse.json({ error: 'Contract is not in signed state' }, { status: 400 });
    }

    // 2. Generate PDF on Server
    const docPdf = await generateContractPDF(contract);
    const pdfArrayBuffer = docPdf.output('arraybuffer');
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    // 2.5 Upload PDF to Firebase Storage using Admin SDK
    console.log(`[complete-signature] Uploading PDF via Admin SDK: ${contractId}`);
    const bucket = adminStorage.bucket();
    const file = bucket.file(`signed_contracts/${contractId}.pdf`);
    
    await file.save(pdfBuffer, {
      metadata: { contentType: 'application/pdf' },
      public: true, // Make it public for easy access via URL
    });

    const signedUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    
    // Update Firestore using Admin SDK
    await docRef.update({ signedUrl });
    console.log(`[complete-signature] PDF uploaded and URL saved: ${signedUrl}`);

    // 3. Prepare Recipients
    const creatorEmail = contract.creatorEmail;
    const clientEmail = contract.auditTrail?.signerEmail || contract.meta.clientEmail;
    const creatorName = contract.creatorName;
    const clientName = contract.auditTrail?.signerName || contract.meta.clientName;
    const docTitle = contract.meta.documentTitle || 'Service Agreement';

    if (!creatorEmail || !clientEmail) {
      return NextResponse.json({ error: 'Missing required emails' }, { status: 400 });
    }

    // 4. Send Email to Creator
    console.log(`[complete-signature] Sending receipt to creator: ${creatorEmail}`);
    await resend.emails.send({
      from: 'InstaPact Agreements <agreements@instapact.in>',
      to: [creatorEmail],
      subject: `Signed: ${docTitle} with ${clientName}`,
      attachments: [
        {
          filename: `instapact-${contractId.slice(0, 8)}-signed.pdf`,
          content: pdfBuffer,
        },
      ],
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #4f46e5; margin-bottom: 16px;">Agreement Signed Successfully</h2>
          <p style="font-size: 16px; color: #334155; line-height: 1.5;">
            Great news! <strong>${clientName}</strong> has signed the agreement <strong>"${docTitle}"</strong>.
          </p>
          <p style="font-size: 16px; color: #334155; line-height: 1.5;">
            The final signed document with the full audit trail is attached to this email for your records.
          </p>
          <div style="margin: 32px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://instapact.in'}/dashboard" style="background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">
              View in Dashboard
            </a>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            Sent via InstaPact - Professional agreements at the speed of chat.
          </p>
        </div>
      `,
    });

    // 5. Send Email to Client (with Marketing)
    console.log(`[complete-signature] Sending receipt to client: ${clientEmail}`);
    await resend.emails.send({
      from: 'InstaPact Agreements <agreements@instapact.in>',
      to: [clientEmail],
      subject: `Final Copy: ${docTitle} with ${creatorName}`,
      attachments: [
        {
          filename: `instapact-${contractId.slice(0, 8)}-signed.pdf`,
          content: pdfBuffer,
        },
      ],
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #4f46e5; margin-bottom: 16px;">Your Agreement is Finalized</h2>
          <p style="font-size: 16px; color: #334155; line-height: 1.5;">
            Hi ${clientName},
          </p>
          <p style="font-size: 16px; color: #334155; line-height: 1.5;">
            Your agreement <strong>"${docTitle}"</strong> with <strong>${creatorName}</strong> has been successfully signed by all parties.
          </p>
          <p style="font-size: 16px; color: #334155; line-height: 1.5;">
            You can find the official signed PDF with its secure audit trail attached to this email.
          </p>
          
          <div style="margin: 40px 0; padding: 24px; background-color: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1; text-align: center;">
            <h3 style="color: #1e293b; margin-top: 0;">Need professional agreements for your own business?</h3>
            <p style="font-size: 14px; color: #64748b; margin-bottom: 20px;">
              InstaPact helps you close deals faster with legally binding e-signatures, automated tracking, and professional PDF generation.
            </p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://instapact.in'}/auth?from=receipt" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">
              Get Started for Free
            </a>
          </div>

          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            This document was secured and e-signed using InstaPact.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[complete-signature] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
