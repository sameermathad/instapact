import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export async function POST(request: Request) {
  try {
    const { contractId, signerName, signerEmail, signerIp, userAgent, token } = await request.json();

    if (!contractId || !signerName || !signerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!adminDb) {
      console.error('[sign-contract] Admin SDK not initialized');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    let verified = false;

    // 1. If a security token is provided, verify and use it
    if (token) {
      const tokenSnapshot = await adminDb.collection('auth_tokens')
        .where('token', '==', token)
        .where('contractId', '==', contractId)
        .where('used', '==', false)
        .limit(1)
        .get();

      if (!tokenSnapshot.empty) {
        const tokenDoc = tokenSnapshot.docs[0];
        const tokenData = tokenDoc.data();
        
        // Check expiry
        const now = Date.now() / 1000;
        if (tokenData.expiresAt.seconds > now) {
          verified = true;
          // Mark token as used
          await tokenDoc.ref.update({ used: true, usedAt: admin.firestore.Timestamp.now() });
        }
      }
    }

    // 2. Fallback to OTP Check
    if (!verified) {
      const verifySnapshot = await adminDb.collection('verification_codes')
        .where('email', '==', signerEmail)
        .where('contractId', '==', contractId)
        .where('verified', '==', true)
        .limit(1)
        .get();

      if (verifySnapshot.empty) {
        return NextResponse.json({ error: 'Email verification required before signing' }, { status: 403 });
      }
      verified = true;
    }

    // 3. Update Contract to 'signed'
    const docRef = adminDb.collection('contracts').doc(contractId);
    
    // Safety check: ensure contract is still pending
    const contractSnap = await docRef.get();
    if (!contractSnap.exists) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }
    
    if (contractSnap.data()?.status !== 'pending') {
      return NextResponse.json({ error: 'Contract is no longer in pending state' }, { status: 400 });
    }

    const signedAt = admin.firestore.Timestamp.now();
    
    await docRef.update({
      status: 'signed',
      auditTrail: {
        signedAt,
        signerIp: signerIp || 'unknown',
        signerEmail,
        signerName,
        userAgent: userAgent || 'unknown',
      },
      updatedAt: signedAt
    });

    console.log(`[sign-contract] Successfully signed contract ${contractId} by ${signerEmail}`);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[sign-contract] Error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
