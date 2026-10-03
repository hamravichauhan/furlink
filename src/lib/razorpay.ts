import 'server-only';
import Razorpay from 'razorpay';

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  throw new Error(
    'Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in environment.'
  );
}

export const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

export const RAZORPAY_KEY_ID_PUBLIC = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;