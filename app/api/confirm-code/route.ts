import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and Code are required' }, { status: 400 });
    }

    if (!adminDb) {
      console.error('[confirm-code] Admin SDK not initialized');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const querySnapshot = await adminDb.collection('verification_codes')
      .where('email', '==', email)
      .where('code', '==', code.trim())
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      console.log(`[confirm-code] No matching code found for ${email}`);
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    const docSnap = querySnapshot.docs[0];
    const docData = docSnap.data();
    const expiresAt = docData.expiresAt.toDate();

    if (expiresAt < new Date()) {
      console.log(`[confirm-code] Code expired for ${email}`);
      return NextResponse.json({ error: 'Verification code has expired' }, { status: 400 });
    }

    // Mark the record as verified using Admin SDK
    await docSnap.ref.update({
      verified: true,
      verifiedAt: admin.firestore.Timestamp.now()
    });

    console.log(`[confirm-code] Success for ${email}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Confirm code error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message
    }, { status: 500 });
  }
}
