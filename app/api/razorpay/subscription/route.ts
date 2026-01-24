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

    const subscription = await instance.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 120, // 10 years for monthly, 120 years for annual (effectively indefinite)
      quantity: 1,
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Razorpay Subscription Error:', error);
    return NextResponse.json({ error: 'Error creating subscription' }, { status: 500 });
  }
}
