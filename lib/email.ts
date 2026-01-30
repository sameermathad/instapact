import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationCode(email: string, code: string, creatorName: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'InstaPact <agreements@instapact.in>',
      to: [email],
      subject: `Verification Code for ${creatorName}'s Agreement`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
          <h2 style="color: #4f46e5; margin-bottom: 24px;">Verify your identity</h2>
          <p style="color: #475569; line-height: 1.6;">
            You have been requested to sign an agreement created by <strong>${creatorName}</strong> on InstaPact. 
            To proceed with the signature, please enter the following verification code:
          </p>
          <div style="background-color: #f8fafc; padding: 24px; text-align: center; margin: 32px 0; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e293b;">${code}</span>
          </div>
          <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
            This code will expire in 10 minutes. If you did not request this, please ignore this email.
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;">
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            &copy; ${new Date().getFullYear()} InstaPact. Professional infrastructure for creators.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[email.ts] Resend error:', error.name, error.message);
      return false;
    }

    console.log('[email.ts] Email sent successfully:', data?.id);
    return true;
  } catch (err: any) {
    console.error('[email.ts] Failed to send email:', err.message);
    return false;
  }
}
