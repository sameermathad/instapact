import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { contractId, clientEmail, creatorName, documentTitle } = await request.json();

    if (!contractId || !clientEmail || !creatorName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log(`[send-agreement] Starting for contract ${contractId} to ${clientEmail}`);

    // Generate Security Token
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 2); // 48 hours

    console.log('[send-agreement] Storing auth token in Firestore...');
    try {
      await addDoc(collection(db, 'auth_tokens'), {
        token,
        contractId,
        email: clientEmail,
        expiresAt: Timestamp.fromDate(expiresAt),
        used: false,
        createdAt: Timestamp.now(),
      });
      console.log('[send-agreement] Auth token stored successfully');
    } catch (dbError: any) {
      console.error('[send-agreement] Firestore Error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    const signingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://instapact.in'}/s/${contractId}?t=${token}`;
    console.log(`[send-agreement] Signing URL: ${signingUrl}`);

    if (!process.env.RESEND_API_KEY) {
      console.error('[send-agreement] RESEND_API_KEY missing');
    }

    const subject = `Action Required: New Agreement from ${creatorName}`;
    console.log(`[send-agreement] Sending email with subject: ${subject}`);

    const { data, error } = await resend.emails.send({
      from: 'InstaPact Agreements <agreements@instapact.in>',
      to: [clientEmail],
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #4f46e5; margin-bottom: 16px;">New Agreement Ready for Signature</h2>
          <p style="font-size: 16px; color: #334155; line-height: 1.5;">
            Hi there,
          </p>
          <p style="font-size: 16px; color: #334155; line-height: 1.5;">
            <strong>${creatorName}</strong> has prepared a new agreement <strong>"${documentTitle || 'Service Agreement'}"</strong> for you to review and sign on InstaPact.
          </p>
          <div style="margin: 32px 0;">
            <a href="${signingUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Review & Sign Agreement
            </a>
          </div>
          <p style="font-size: 14px; color: #64748b; line-height: 1.5;">
            If the button above doesn't work, copy and paste this link into your browser:<br/>
            <a href="${signingUrl}" style="color: #4f46e5;">${signingUrl}</a>
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            This email was sent via InstaPact - The fastest way to get your project agreements E-Signed.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[send-agreement] Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[send-agreement] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
