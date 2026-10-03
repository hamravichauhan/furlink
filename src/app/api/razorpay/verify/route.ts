import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { razorpay } from '@/lib/razorpay';
import { getOrCreateCurrentUser } from '@/lib/auth-sync';

export const runtime = 'nodejs'; // crypto + Razorpay SDK need Node, not Edge

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json(
      { success: false, error: 'Gateway not configured' },
      { status: 500 }
    );
  }

  let body: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { success: false, error: 'Missing payment fields' },
      { status: 400 }
    );
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(razorpay_signature, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json(
      { success: false, error: 'Signature mismatch' },
      { status: 400 }
    );
  }

  // Idempotency check
  const existing = await prisma.donation.findUnique({
    where: { paymentId: razorpay_payment_id },
  });
  if (existing) {
    return NextResponse.json({ success: true, donationId: existing.id });
  }

  // Fetch the authoritative amount from Razorpay
  let orderAmountPaise: number;
  try {
    const order = await razorpay.orders.fetch(razorpay_order_id);
    orderAmountPaise = Number(order.amount);
  } catch (err) {
    console.error('[razorpay/verify] order fetch failed', err);
    return NextResponse.json(
      { success: false, error: 'Could not verify order with gateway' },
      { status: 502 }
    );
  }

  const dbUser = await getOrCreateCurrentUser();

  try {
    const donation = await prisma.donation.create({
      data: {
        userId: dbUser?.id ?? null,
        amount: orderAmountPaise / 100,
        currency: 'INR',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: 'SUCCESS',
      },
    });
    return NextResponse.json({ success: true, donationId: donation.id });
  } catch (err) {
    console.error('[razorpay/verify] db insert failed', err);
    return NextResponse.json(
      { success: false, error: 'Failed to record donation' },
      { status: 500 }
    );
  }
}