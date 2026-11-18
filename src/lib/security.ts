import crypto from 'crypto';
export * from './masking';

/**
 * 256-bit Master Cryptographic Key Derivation
 * Derives a deterministic 32-byte key from environment secrets.
 */
function getMasterKey(): Buffer {
  const secret =
    process.env.DATA_ENCRYPTION_KEY ||
    process.env.CLERK_SECRET_KEY ||
    process.env.RAZORPAY_KEY_SECRET ||
    'furlink-core-sanctuary-production-key-2026';

  return crypto.createHash('sha256').update(secret, 'utf8').digest();
}

/**
 * AES-256-GCM Authenticated Encryption
 * Encrypts sensitive plaintext (such as applicant phone numbers, residential addresses).
 * Outputs format: enc:v1:<iv_hex>:<authTag_hex>:<ciphertext_hex>
 */
export function encrypt(plaintext?: string | null): string {
  if (!plaintext || typeof plaintext !== 'string') return '';
  const trimmed = plaintext.trim();
  if (trimmed.length === 0) return '';

  const masterKey = getMasterKey();
  const iv = crypto.randomBytes(12); // Standard 96-bit IV for AES-GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', masterKey, iv);

  let ciphertext = cipher.update(trimmed, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return `enc:v1:${iv.toString('hex')}:${authTag}:${ciphertext}`;
}

/**
 * AES-256-GCM Authenticated Decryption
 * Transparently decrypts encrypted data.
 * If data is not encrypted (e.g. legacy plain text), returns as-is for backward compatibility.
 */
export function decrypt(ciphertext?: string | null): string {
  if (!ciphertext || typeof ciphertext !== 'string') return '';
  if (!ciphertext.startsWith('enc:v1:')) {
    // Unencrypted legacy string, return gracefully
    return ciphertext;
  }

  const parts = ciphertext.split(':');
  if (parts.length !== 5) {
    return ciphertext;
  }

  try {
    const iv = Buffer.from(parts[2], 'hex');
    const authTag = Buffer.from(parts[3], 'hex');
    const encryptedHex = parts[4];

    const masterKey = getMasterKey();
    const decipher = crypto.createDecipheriv('aes-256-gcm', masterKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err: any) {
    console.error('[SECURITY AUDIT] Decryption authentication failed:', err?.message);
    return '[DATA_INTEGRITY_COMPROMISED]';
  }
}

/**
 * Safe field encryption helper for optional Prisma fields
 */
export function encryptField(val?: string | null): string | null {
  if (!val) return null;
  const enc = encrypt(val);
  return enc.length > 0 ? enc : null;
}

/**
 * Safe field decryption helper
 */
export function decryptField(val?: string | null): string {
  if (!val) return '';
  return decrypt(val);
}

/**
 * SHA-256 Cryptographic Hash
 */
export function hashSha256(data: string, salt: string = ''): string {
  return crypto
    .createHash('sha256')
    .update(`${data}:${salt}`, 'utf8')
    .digest('hex');
}

/**
 * Keyed HMAC-SHA256 Authentication Hash
 */
export function hashHmacSha256(data: string, secret?: string): string {
  const key = secret ? Buffer.from(secret, 'utf8') : getMasterKey();
  return crypto.createHmac('sha256', key).update(data, 'utf8').digest('hex');
}

/**
 * Blind Index for Searchable Encrypted Fields
 * Computes a deterministic salted hash so search and duplicates can be checked
 * without storing or exposing plaintext.
 */
export function createBlindIndex(value: string, pepper: string = 'furlink-blind-idx'): string {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return crypto
    .createHmac('sha256', getMasterKey())
    .update(`${pepper}:${normalized}`)
    .digest('hex');
}

/**
 * Generates an immutable cryptographic receipt verification fingerprint
 * for 80G tax deductions and audited clinical donations.
 */
export function createDigitalReceiptFingerprint(data: {
  id: string;
  amount: number;
  paymentId: string;
  orderId?: string | null;
  createdAt: string | Date;
}): string {
  const isoDate = new Date(data.createdAt).toISOString();
  const canonical = `FURLINK_RECEIPT|${data.id}|${data.amount}|${data.paymentId}|${data.orderId || ''}|${isoDate}`;
  return hashHmacSha256(canonical);
}

/**
 * Generates an immutable clinical proof verification fingerprint
 * for sterilization and trauma veterinary procedures.
 */
export function createClinicalProofFingerprint(data: {
  id: string;
  clinicName?: string | null;
  veterinarianName?: string | null;
  verifiedById?: string | null;
  verifiedAt?: string | Date | null;
}): string {
  const isoDate = data.verifiedAt ? new Date(data.verifiedAt).toISOString() : 'UNVERIFIED';
  const canonical = `FURLINK_CLINICAL|${data.id}|${data.clinicName || 'NONE'}|${data.veterinarianName || 'NONE'}|${data.verifiedById || 'NONE'}|${isoDate}`;
  return hashHmacSha256(canonical);
}

/**
 * Constant-time comparison to prevent timing attacks
 */
export function verifyTimingSafe(expected: string, actual: string): boolean {
  if (!expected || !actual) return false;
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(actual, 'utf8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
