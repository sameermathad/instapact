import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { sendVerificationCode } from '@/lib/email';
import * as admin from 'firebase-admin';

export async function POST(request: Request) {
  try {
    const { email, creatorName, contractId } = await request.json();

    if (!email || !creatorName || !contractId) {
      return NextResponse.json({ error: 'Email, Creator Name, and Contract ID are required' }, { status: 400 });
    }

    if (!adminDb) {
      console.error('[verify-email] Admin SDK not initialized');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Security Check: If the contract is locked to a specific email, enforce it here
    const contractRef = adminDb.collection('contracts').doc(contractId);
    const contractSnap = await contractRef.get();
    
    if (contractSnap.exists) {
      const contractData = contractSnap.data();
      const lockedEmail = contractData?.meta?.clientEmail;
      
      if (lockedEmail && lockedEmail.toLowerCase() !== email.toLowerCase()) {
        console.warn(`[verify-email] Security Alert: Unauthorized email ${email} tried to verify for contract ${contractId} (locked to ${lockedEmail})`);
        return NextResponse.json({ error: 'Unauthorized: This agreement is restricted to a different email address.' }, { status: 403 });
      }
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('[verify-email] RESEND_API_KEY is missing');
      return NextResponse.json({ error: 'Server configuration error: Email service key missing' }, { status: 500 });
    }

    // Cleanup: Delete old unverified codes for this email/contract
    const oldCodes = await adminDb.collection('verification_codes')
      .where('email', '==', email)
      .where('contractId', '==', contractId)
      .where('verified', '==', false)
      .limit(5)
      .get();

    const batch = adminDb.batch();
    oldCodes.docs.forEach((d: any) => batch.delete(d.ref));
    await batch.commit();

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Firestore
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await adminDb.collection('verification_codes').add({
      email,
      code,
      expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
      contractId,
      verified: false,
      createdAt: admin.firestore.Timestamp.now(),
    });

    // Send Email
    console.log(`[verify-email] Sending code ${code} to ${email}`);
    const emailSent = await sendVerificationCode(email, code, creatorName);

    if (!emailSent) {
      console.error('[verify-email] Email sending failed');
      return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
    }

    console.log('[verify-email] Success');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Verify email error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message
    }, { status: 500 });
  }
}
