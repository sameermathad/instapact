import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const { planId } = await req.json();

    if (!process.env.RAZORPAY_KEY_SECRET || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 });
    }

    if (!planId) {
        return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
    }

    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Check if plan is annual to adjust total_count
    // For annual plans, 120 counts would be 120 years, which might be rejected.
    // Let's use 10 counts for annual (10 years) and 120 for monthly (10 years).
    const isAnnual = planId.includes('annual') || planId.toLowerCase().includes('year');
    
    const subscription = await instance.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: isAnnual ? 10 : 120, 
      quantity: 1,
    });

    return NextResponse.json(subscription);
  } catch (error: any) {
    console.error('Razorpay Subscription Error:', error);
    return NextResponse.json({ error: error.description || 'Error creating subscription' }, { status: 500 });
  }
}
