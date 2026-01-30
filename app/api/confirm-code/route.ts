import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and Code are required' }, { status: 400 });
    }

    // Simplified query to avoid requiring composite indexes
    const q = query(
      collection(db, 'verification_codes'),
      where('email', '==', email),
      where('code', '==', code.trim()),
      limit(1)
    );

    console.log(`[confirm-code] Checking code for ${email}`);
    const querySnapshot = await getDocs(q);

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

    // Proof of Verification: Mark the record as verified
    const { updateDoc, doc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'verification_codes', docSnap.id), {
      verified: true,
      verifiedAt: Timestamp.now()
    });

    console.log(`[confirm-code] Success for ${email}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Confirm code error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
}
