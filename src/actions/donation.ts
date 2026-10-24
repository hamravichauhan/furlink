'use server';

import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { razorpay } from '@/lib/razorpay';
import { getOrCreateCurrentUser } from '@/lib/auth-sync';
import { revalidatePath } from 'next/cache';

const MIN_AMOUNT_INR = 1;
const MAX_AMOUNT_INR = 100_000;

export type CreateOrderResult =
  | {
      success: true;
      orderId: string;
      amount: number; // paise
      currency: string;
      keyId: string;
    }
  | { success: false; error: string };

export async function createDonationOrder(
  formData: FormData
): Promise<CreateOrderResult> {
  const rawAmount = Number(formData.get('amount'));
  if (!Number.isFinite(rawAmount) || rawAmount < MIN_AMOUNT_INR) {
    return { success: false, error: `Minimum donation is ₹${MIN_AMOUNT_INR}.` };
  }
  if (rawAmount > MAX_AMOUNT_INR) {
    return {
      success: false,
      error: `Maximum online donation is ₹${MAX_AMOUNT_INR}.`,
    };
  }

  const amountPaise = Math.round(rawAmount * 100);
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId) {
    return { success: false, error: 'Payment gateway not configured.' };
  }

  // Attach the Clerk-synced user if signed in; guests get null.
  const dbUser = await getOrCreateCurrentUser();

  try {
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `furlink_${Date.now()}`,
      notes: {
        userId: dbUser?.id ?? 'guest',
        source: 'furlink_donate',
      },
    });

    return {
      success: true,
      orderId: order.id,
      amount: amountPaise,
      currency: 'INR',
      keyId,
    };
  } catch (err) {
    console.error('[createDonationOrder]', err);
    return {
      success: false,
      error: 'Could not initiate payment. You can also use Demo Test Donation.',
    };
  }
}

export type VerifyDonationResult =
  | { success: true; donationId: string }
  | { success: false; error: string };

export async function verifyDonationPayment(input: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  amount: number; // paise, echoed back from the client
}): Promise<VerifyDonationResult> {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } =
    input;

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return { success: false, error: 'Payment gateway not configured.' };
  }

  // Constant-time HMAC comparison.
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const expectedBuf = Buffer.from(expected, 'utf8');
  const receivedBuf = Buffer.from(razorpay_signature, 'utf8');

  if (
    expectedBuf.length !== receivedBuf.length ||
    !crypto.timingSafeEqual(expectedBuf, receivedBuf)
  ) {
    return { success: false, error: 'Payment signature verification failed.' };
  }

  // Idempotency: if the paymentId already exists, don't double-insert.
  const existing = await prisma.donation.findUnique({
    where: { paymentId: razorpay_payment_id },
  });
  if (existing) {
    return { success: true, donationId: existing.id };
  }

  const dbUser = await getOrCreateCurrentUser();

  try {
    const donation = await prisma.donation.create({
      data: {
        userId: dbUser?.id ?? null,
        amount: amount / 100, // store rupees, since schema is Float
        currency: 'INR',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: 'SUCCESS',
      },
    });

    revalidatePath('/donate');
    revalidatePath('/admin/donations');
    revalidatePath('/admin');
    return { success: true, donationId: donation.id };
  } catch (err) {
    console.error('[verifyDonationPayment]', err);
    return { success: false, error: 'Failed to record donation.' };
  }
}

// ─── Demo / Offline Test Donation ──────────────────────────────────────────
export async function createOfflineTestDonation(amountRupees: number) {
  if (!Number.isFinite(amountRupees) || amountRupees < 1) {
    return { success: false, error: 'Invalid donation amount.' };
  }

  const dbUser = await getOrCreateCurrentUser();
  const timestamp = Date.now();
  const paymentId = `pay_offline_${timestamp}`;
  const orderId = `order_offline_${timestamp}`;

  try {
    const donation = await prisma.donation.create({
      data: {
        userId: dbUser?.id ?? null,
        amount: Math.round(amountRupees),
        currency: 'INR',
        paymentId,
        orderId,
        status: 'SUCCESS',
      },
    });

    revalidatePath('/donate');
    revalidatePath('/admin/donations');
    revalidatePath('/admin');
    return { success: true, donationId: donation.id };
  } catch (err) {
    console.error('[createOfflineTestDonation]', err);
    return { success: false, error: 'Failed to record offline donation.' };
  }
}
