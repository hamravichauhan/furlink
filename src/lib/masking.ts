/**
 * FurLink PII Redaction & Privacy Masking Utilities
 * Safe for both Server and Client Component rendering.
 */

export function maskPhone(phone?: string | null): string {
  if (!phone) return "";
  const cleaned = phone.trim();
  const digits = cleaned.replace(/[^0-9]/g, "");
  if (digits.length < 4) return "••••";

  const last4 = digits.slice(-4);
  const prefix = cleaned.startsWith("+") ? cleaned.slice(0, 3) + " " : "";
  return `${prefix}••••• ${last4}`;
}

export function maskEmail(email?: string | null): string {
  if (!email) return "";
  const cleaned = email.trim().toLowerCase();
  const parts = cleaned.split("@");
  if (parts.length !== 2) return "••••@••••";

  const [local, domain] = parts;
  if (local.length <= 2) {
    return `${local[0] || "•"}•••@${domain}`;
  }
  const maskedLocal = `${local[0]}${"•".repeat(Math.min(5, local.length - 2))}${local[local.length - 1]}`;
  return `${maskedLocal}@${domain}`;
}

export function maskAddress(address?: string | null): string {
  if (!address) return "";
  const cleaned = address.trim();
  const parts = cleaned.split(",");
  if (parts.length > 1) {
    const publicArea = parts.slice(1).join(",").trim();
    return `[Protected Unit], ${publicArea}`;
  }
  return "[Protected Street Address]";
}

export function maskPan(pan?: string | null): string {
  if (!pan) return "";
  const cleaned = pan.trim().toUpperCase();
  if (cleaned.length !== 10) return "••••••••••";
  return `••••••${cleaned.slice(-4)}`;
}
