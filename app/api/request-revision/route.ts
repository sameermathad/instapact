import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import * as admin from 'firebase-admin';

export async function POST(request: Request) {
  try {
    const { contractId, feedback } = await request.json();

    if (!contractId || !feedback) {
      return NextResponse.json({ error: 'Missing contractId or feedback' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const docRef = adminDb.collection('contracts').doc(contractId);
    const contractSnap = await docRef.get();

    if (!contractSnap.exists) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    await docRef.update({
      status: 'revision_requested',
      clientFeedback: feedback,
      updatedAt: admin.firestore.Timestamp.now()
    });

    console.log(`[request-revision] Revision requested for ${contractId}`);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[request-revision] Error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
