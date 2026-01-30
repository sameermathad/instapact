import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp, doc, getDoc, query, where, getDocs, deleteDoc, limit } from 'firebase/firestore';
import { sendVerificationCode } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email, creatorName, contractId } = await request.json();

    if (!email || !creatorName || !contractId) {
      return NextResponse.json({ error: 'Email, Creator Name, and Contract ID are required' }, { status: 400 });
    }

    // Security Check: If the contract is locked to a specific email, enforce it here
    const contractSnap = await getDoc(doc(db, 'contracts', contractId));
    
    if (contractSnap.exists()) {
      const contractData = contractSnap.data();
      const lockedEmail = contractData.meta?.clientEmail;
      
      if (lockedEmail && lockedEmail.toLowerCase() !== email.toLowerCase()) {
        console.warn(`[verify-email] Security Alert: Unauthorized email ${email} tried to verify for contract ${contractId} (locked to ${lockedEmail})`);
        return NextResponse.json({ error: 'Unauthorized: This agreement is restricted to a different email address.' }, { status: 403 });
      }
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('[verify-email] RESEND_API_KEY is missing');
      return NextResponse.json({ error: 'Server configuration error: Email service key missing' }, { status: 500 });
    }

    // Cleanup: Delete old unverified codes for this email/contract to keep DB clean
    const oldCodesQuery = query(
      collection(db, 'verification_codes'),
      where('email', '==', email),
      where('contractId', '==', contractId),
      where('verified', '==', false),
      limit(5)
    );

    const oldDocs = await getDocs(oldCodesQuery);
    const deletePromises = oldDocs.docs.map(d => deleteDoc(doc(db, 'verification_codes', d.id)));
    await Promise.all(deletePromises);

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Firestore
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await addDoc(collection(db, 'verification_codes'), {
      email,
      code,
      expiresAt: Timestamp.fromDate(expiresAt),
      contractId,
      verified: false,
      createdAt: Timestamp.now(),
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
      details: error.message,
      code: error.code 
    }, { status: 500 });
  }
}
