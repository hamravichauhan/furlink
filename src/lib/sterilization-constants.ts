// ─── Limits ────────────────────────────────────────────────────────────────
export const DAILY_LIMIT = 3;
export const COOLDOWN_MINUTES = 30;
export const MAX_PENDING = 5;
export const DUPLICATE_WINDOW_DAYS = 7;
export const COUNT_MIN = 1;
export const COUNT_MAX = 50;
export const LOCATION_MIN = 3;
export const LOCATION_MAX = 200;
export const NOTES_MAX = 500;
export const SCHEDULED_NOTES_MAX = 300;
export const COMPLETION_NOTES_MIN = 20;
export const COMPLETION_NOTES_MAX = 1000;
export const CANCELLATION_NOTE_MAX = 300;
export const CLINIC_NAME_MAX = 120;
export const VET_NAME_MAX = 80;
export const VERIFICATION_NOTE_MAX = 400;
export const DISPUTE_REASON_MAX = 400;

export const ALLOWED_ANIMALS = ['Street Dog', 'Feral Cat', 'Other'] as const;

// ─── Status presentation ───────────────────────────────────────────────────
export const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  SCHEDULED: 'bg-blue-100 text-blue-800 border-blue-200',
  PROOF_SUBMITTED: 'bg-purple-100 text-purple-800 border-purple-200',
  VERIFIED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  DISPUTED: 'bg-rose-100 text-rose-800 border-rose-200',
  CANCELLED: 'bg-gray-100 text-gray-600 border-gray-200',
  // legacy — keep for old rows
  COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

export const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Awaiting Rescuer',
  SCHEDULED: 'Rescuer Assigned',
  PROOF_SUBMITTED: 'Awaiting Verification',
  VERIFIED: 'Verified',
  DISPUTED: 'Disputed',
  CANCELLED: 'Cancelled',
  // legacy
  COMPLETED: 'Verified',
};

export const STATUS_ICONS: Record<string, string> = {
  PENDING: '•',
  SCHEDULED: '•',
  PROOF_SUBMITTED: '•',
  VERIFIED: 'OK',
  DISPUTED: '!',
  CANCELLED: '×',
  COMPLETED: 'OK',
};

// ─── Filter tabs for the feed ──────────────────────────────────────────────
export const FEED_TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'SCHEDULED', label: 'Scheduled' },
  { key: 'PROOF_SUBMITTED', label: 'Awaiting review' },
  { key: 'VERIFIED', label: 'Verified' },
] as const;

// ─── Progress stepper ──────────────────────────────────────────────────────
export const PROGRESS_STEPS = [
  { key: 'PENDING', label: 'Requested' },
  { key: 'SCHEDULED', label: 'Scheduled' },
  { key: 'PROOF_SUBMITTED', label: 'Proof' },
  { key: 'VERIFIED', label: 'Verified' },
] as const;

export function getStepIndex(status: string): number {
  switch (status) {
    case 'PENDING':
      return 0;
    case 'SCHEDULED':
      return 1;
    case 'PROOF_SUBMITTED':
      return 2;
    case 'VERIFIED':
    case 'COMPLETED':
      return 3;
    default:
      return -1;
  }
}