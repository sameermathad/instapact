import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { token, contractId } = await request.json();

    if (!token || !contractId) {
      return NextResponse.json({ error: 'Token and Contract ID are required' }, { status: 400 });
    }

    if (!adminDb) {
      console.error('[validate-token] Admin SDK not initialized');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const querySnapshot = await adminDb.collection('auth_tokens')
      .where('token', '==', token)
      .where('contractId', '==', contractId)
      .where('used', '==', false)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return NextResponse.json({ valid: false, error: 'Invalid or expired secure link' });
    }

    const tokenDoc = querySnapshot.docs[0];
    const tokenData = tokenDoc.data();

    // Check expiry
    const now = Date.now() / 1000;
    if (tokenData.expiresAt.seconds < now) {
      return NextResponse.json({ valid: false, error: 'Security token has expired' });
    }

    return NextResponse.json({ 
      valid: true, 
      email: tokenData.email 
    });

  } catch (error: any) {
    console.error('[validate-token] Error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
