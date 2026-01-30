import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp, limit } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { token, contractId } = await request.json();

    if (!token || !contractId) {
      return NextResponse.json({ error: 'Token and Contract ID are required' }, { status: 400 });
    }

    const tokensRef = collection(db, 'auth_tokens');
    const q = query(
      tokensRef,
      where('token', '==', token),
      where('contractId', '==', contractId),
      where('used', '==', false),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ valid: false, error: 'Invalid or expired secure link' });
    }

    const tokenDoc = querySnapshot.docs[0];
    const tokenData = tokenDoc.data();

    // Check expiry
    const now = Timestamp.now();
    if (tokenData.expiresAt.seconds < now.seconds) {
      return NextResponse.json({ valid: false, error: 'Security token has expired' });
    }

    return NextResponse.json({ 
      valid: true, 
      email: tokenData.email 
    });

  } catch (error: any) {
    console.error('[validate-token] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
