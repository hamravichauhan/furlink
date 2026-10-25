'use server';

import { prisma } from '@/lib/prisma';
import { getOrCreateCurrentUser } from '@/lib/auth-sync';
import { hasRole } from '@/lib/auth-helpers';
import { revalidatePath } from 'next/cache';
import {
  validateString,
  validateInt,
  validateEnum,
  minutesSince,
  formatCooldown,
} from '@/lib/validation';
import {
  DAILY_LIMIT,
  COOLDOWN_MINUTES,
  MAX_PENDING,
  DUPLICATE_WINDOW_DAYS,
  COUNT_MIN,
  COUNT_MAX,
  LOCATION_MIN,
  LOCATION_MAX,
  NOTES_MAX,
  SCHEDULED_NOTES_MAX,
  COMPLETION_NOTES_MIN,
  COMPLETION_NOTES_MAX,
  CANCELLATION_NOTE_MAX,
  CLINIC_NAME_MAX,
  VET_NAME_MAX,
  VERIFICATION_NOTE_MAX,
  DISPUTE_REASON_MAX,
  ALLOWED_ANIMALS,
} from '@/lib/sterilization-constants';

// ─── Result shapes ─────────────────────────────────────────────────────────
export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export type CreateSterilizationResult =
  | { success: true; requestId: string }
  | { success: false; error: string };

// ─── Quota ─────────────────────────────────────────────────────────────────
export interface SterilizationQuota {
  requestsToday: number;
  dailyLimit: number;
  remainingToday: number;
  nextAllowedAt: Date | null;
  pendingCount: number;
  maxPending: number;
  canSubmit: boolean;
  reason: string | null;
}

export async function getSterilizationQuota(): Promise<SterilizationQuota | null> {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) return null;

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [requestsToday, pendingCount, lastRequest] = await Promise.all([
    prisma.sterilizationRequest.count({
      where: { userId: dbUser.id, createdAt: { gte: since24h } },
    }),
    prisma.sterilizationRequest.count({
      where: { userId: dbUser.id, status: 'PENDING' },
    }),
    prisma.sterilizationRequest.findFirst({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    }),
  ]);

  const nextAllowedAt = lastRequest
    ? new Date(lastRequest.createdAt.getTime() + COOLDOWN_MINUTES * 60 * 1000)
    : null;

  const cooldownActive = nextAllowedAt !== null && nextAllowedAt > new Date();

  let reason: string | null = null;
  if (requestsToday >= DAILY_LIMIT) {
    reason = `Daily limit reached (${DAILY_LIMIT}/${DAILY_LIMIT}). Try again tomorrow.`;
  } else if (pendingCount >= MAX_PENDING) {
    reason = `You already have ${MAX_PENDING} pending requests. Wait for those to be reviewed.`;
  } else if (cooldownActive && lastRequest) {
    const elapsed = minutesSince(lastRequest.createdAt);
    const remaining = Math.max(0, COOLDOWN_MINUTES - elapsed);
    reason = `Please wait ${formatCooldown(remaining)} before submitting another request.`;
  }

  return {
    requestsToday,
    dailyLimit: DAILY_LIMIT,
    remainingToday: Math.max(0, DAILY_LIMIT - requestsToday),
    nextAllowedAt,
    pendingCount,
    maxPending: MAX_PENDING,
    canSubmit: reason === null,
    reason,
  };
}

// ─── Create ────────────────────────────────────────────────────────────────
export async function createSterilizationRequest(
  formData: FormData
): Promise<CreateSterilizationResult> {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) {
    return { success: false, error: 'Please sign in to submit a request.' };
  }

  const animalTypeResult = validateEnum(
    formData.get('animalType'),
    'Animal species',
    ALLOWED_ANIMALS
  );
  if (!animalTypeResult.ok) {
    return { success: false, error: animalTypeResult.error };
  }

  const countResult = validateInt(formData.get('count'), 'Animal count', {
    min: COUNT_MIN,
    max: COUNT_MAX,
  });
  if (!countResult.ok) {
    return { success: false, error: countResult.error };
  }

  const locationResult = validateString(
    formData.get('location'),
    'Location',
    { min: LOCATION_MIN, max: LOCATION_MAX, required: true }
  );
  if (!locationResult.ok) {
    return { success: false, error: locationResult.error };
  }

  const notesResult = validateString(formData.get('notes'), 'Notes', {
    max: NOTES_MAX,
  });
  if (!notesResult.ok) {
    return { success: false, error: notesResult.error };
  }

  const latRaw = formData.get('latitude');
  const lngRaw = formData.get('longitude');
  let latitude: number | null = null;
  let longitude: number | null = null;

  if (typeof latRaw === 'string' && latRaw.trim().length > 0) {
    const parsed = Number(latRaw);
    if (Number.isFinite(parsed) && parsed >= -90 && parsed <= 90) {
      latitude = parsed;
    }
  }
  if (typeof lngRaw === 'string' && lngRaw.trim().length > 0) {
    const parsed = Number(lngRaw);
    if (Number.isFinite(parsed) && parsed >= -180 && parsed <= 180) {
      longitude = parsed;
    }
  }

  const animalType = animalTypeResult.value;
  const count = countResult.value;
  const location = locationResult.value!;
  const notes = notesResult.value;

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const cooldownCutoff = new Date(Date.now() - COOLDOWN_MINUTES * 60 * 1000);
  const duplicateCutoff = new Date(
    Date.now() - DUPLICATE_WINDOW_DAYS * 24 * 60 * 60 * 1000
  );

  const [requestsToday, pendingCount, lastRequest] = await Promise.all([
    prisma.sterilizationRequest.count({
      where: { userId: dbUser.id, createdAt: { gte: since24h } },
    }),
    prisma.sterilizationRequest.count({
      where: { userId: dbUser.id, status: 'PENDING' },
    }),
    prisma.sterilizationRequest.findFirst({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    }),
  ]);

  if (requestsToday >= DAILY_LIMIT) {
    return {
      success: false,
      error: `You've already submitted ${DAILY_LIMIT} requests in the last 24 hours. Please try again tomorrow.`,
    };
  }

  if (pendingCount >= MAX_PENDING) {
    return {
      success: false,
      error: `You already have ${MAX_PENDING} pending requests awaiting review. Please wait for those to be processed.`,
    };
  }

  if (lastRequest && lastRequest.createdAt > cooldownCutoff) {
    const elapsed = minutesSince(lastRequest.createdAt);
    const remaining = Math.max(0, COOLDOWN_MINUTES - elapsed);
    return {
      success: false,
      error: `Please wait ${formatCooldown(remaining)} before submitting another request.`,
    };
  }

  const duplicate = await prisma.sterilizationRequest.findFirst({
    where: {
      userId: dbUser.id,
      location: { equals: location },
      createdAt: { gte: duplicateCutoff },
    },
    select: { id: true },
  });

  if (duplicate) {
    return {
      success: false,
      error:
        'You already submitted a request for this location in the last 7 days.',
    };
  }

  try {
    const request = await prisma.sterilizationRequest.create({
      data: {
        userId: dbUser.id,
        animalType,
        count,
        location,
        latitude,
        longitude,
        notes,
      },
    });

    revalidatePath('/sterilization');
    return { success: true, requestId: request.id };
  } catch (err) {
    console.error('[createSterilizationRequest]', err);
    return {
      success: false,
      error: 'Failed to submit request. Please try again.',
    };
  }
}

// ─── Accept ────────────────────────────────────────────────────────────────
export async function acceptSterilizationRequest(
  requestId: string,
  formData: FormData
): Promise<ActionResult> {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) return { success: false, error: 'Please sign in.' };

  const request = await prisma.sterilizationRequest.findUnique({
    where: { id: requestId },
    select: { id: true, userId: true, status: true },
  });

  if (!request) return { success: false, error: 'Request not found.' };
  if (request.userId === dbUser.id && dbUser.role !== 'ADMIN') {
    return { success: false, error: 'You cannot accept your own request.' };
  }
  if (request.status !== 'PENDING') {
    return {
      success: false,
      error: 'This request is no longer available to accept.',
    };
  }

  const scheduledRaw = formData.get('scheduledAt');
  let scheduledAt: Date | null = null;
  if (typeof scheduledRaw === 'string' && scheduledRaw.trim().length > 0) {
    const d = new Date(scheduledRaw);
    if (Number.isNaN(d.getTime())) {
      return { success: false, error: 'Invalid scheduled date.' };
    }
    if (d.getTime() < Date.now() - 60 * 1000) {
      return { success: false, error: 'Scheduled date must be in the future.' };
    }
    scheduledAt = d;
  }

  const scheduledNotesResult = validateString(
    formData.get('scheduledNotes'),
    'Plan notes',
    { max: SCHEDULED_NOTES_MAX }
  );
  if (!scheduledNotesResult.ok) {
    return { success: false, error: scheduledNotesResult.error };
  }

  try {
    const result = await prisma.sterilizationRequest.updateMany({
      where: { id: requestId, status: 'PENDING' },
      data: {
        status: 'SCHEDULED',
        rescuerId: dbUser.id,
        scheduledAt,
        scheduledNotes: scheduledNotesResult.value,
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: 'Someone else just accepted this request.',
      };
    }

    revalidatePath('/sterilization');
    revalidatePath(`/sterilization/${requestId}`);
    return { success: true };
  } catch (err) {
    console.error('[acceptSterilizationRequest]', err);
    return { success: false, error: 'Failed to accept request.' };
  }
}

// ─── Submit proof ──────────────────────────────────────────────────────────
export async function submitSterilizationProof(
  requestId: string,
  formData: FormData
): Promise<ActionResult> {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) return { success: false, error: 'Please sign in.' };

  const request = await prisma.sterilizationRequest.findUnique({
    where: { id: requestId },
    select: { id: true, rescuerId: true, status: true },
  });

  if (!request) return { success: false, error: 'Request not found.' };

  if (request.status !== 'SCHEDULED') {
    return {
      success: false,
      error: 'Only scheduled requests can accept proof.',
    };
  }

  if (request.rescuerId !== dbUser.id) {
    return {
      success: false,
      error: 'Only the assigned rescuer can submit proof.',
    };
  }

  const certUrl = (formData.get('certificateUrl') as string | null)?.trim();
  if (!certUrl || certUrl.length === 0) {
    return {
      success: false,
      error: 'A certificate image is required.',
    };
  }

  if (!/^https?:\/\//i.test(certUrl)) {
    return { success: false, error: 'Invalid certificate URL.' };
  }

  const completionNotesResult = validateString(
    formData.get('completionNotes'),
    'Completion notes',
    { min: COMPLETION_NOTES_MIN, max: COMPLETION_NOTES_MAX, required: true }
  );
  if (!completionNotesResult.ok) {
    return { success: false, error: completionNotesResult.error };
  }

  const clinicNameResult = validateString(
    formData.get('clinicName'),
    'Clinic name',
    { min: 2, max: CLINIC_NAME_MAX, required: true }
  );
  if (!clinicNameResult.ok) {
    return { success: false, error: clinicNameResult.error };
  }

  const vetNameResult = validateString(
    formData.get('veterinarianName'),
    'Veterinarian name',
    { max: VET_NAME_MAX }
  );
  if (!vetNameResult.ok) {
    return { success: false, error: vetNameResult.error };
  }

  const latRaw = formData.get('completionLatitude');
  const lngRaw = formData.get('completionLongitude');
  let completionLatitude: number | null = null;
  let completionLongitude: number | null = null;

  if (typeof latRaw === 'string' && latRaw.trim().length > 0) {
    const parsed = Number(latRaw);
    if (Number.isFinite(parsed) && parsed >= -90 && parsed <= 90) {
      completionLatitude = parsed;
    }
  }
  if (typeof lngRaw === 'string' && lngRaw.trim().length > 0) {
    const parsed = Number(lngRaw);
    if (Number.isFinite(parsed) && parsed >= -180 && parsed <= 180) {
      completionLongitude = parsed;
    }
  }

  try {
    const result = await prisma.sterilizationRequest.updateMany({
      where: { id: requestId, status: 'SCHEDULED', rescuerId: dbUser.id },
      data: {
        status: 'PROOF_SUBMITTED',
        completionCertificateUrl: certUrl,
        completionNotes: completionNotesResult.value,
        clinicName: clinicNameResult.value,
        veterinarianName: vetNameResult.value,
        completionLatitude,
        completionLongitude,
        proofSubmittedAt: new Date(),
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: 'Request state changed. Please refresh.',
      };
    }

    revalidatePath('/sterilization');
    revalidatePath(`/sterilization/${requestId}`);
    return { success: true };
  } catch (err) {
    console.error('[submitSterilizationProof]', err);
    return { success: false, error: 'Failed to submit proof.' };
  }
}

// ─── Verify ────────────────────────────────────────────────────────────────
export async function verifySterilizationProof(
  requestId: string,
  formData: FormData
): Promise<ActionResult> {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) return { success: false, error: 'Please sign in.' };

  if (!hasRole(dbUser, 'VERIFIER')) {
    return {
      success: false,
      error: 'Only verified reviewers can verify proofs.',
    };
  }

  const request = await prisma.sterilizationRequest.findUnique({
    where: { id: requestId },
    select: { id: true, rescuerId: true, status: true },
  });

  if (!request) return { success: false, error: 'Request not found.' };

  if (request.status !== 'PROOF_SUBMITTED') {
    return {
      success: false,
      error: 'This request is not awaiting verification.',
    };
  }

  if (request.rescuerId === dbUser.id) {
    return {
      success: false,
      error: 'You cannot verify your own proof.',
    };
  }

  const noteResult = validateString(
    formData.get('verificationNote'),
    'Verification note',
    { max: VERIFICATION_NOTE_MAX }
  );
  if (!noteResult.ok) {
    return { success: false, error: noteResult.error };
  }

  try {
    const result = await prisma.sterilizationRequest.updateMany({
      where: { id: requestId, status: 'PROOF_SUBMITTED' },
      data: {
        status: 'VERIFIED',
        verifiedById: dbUser.id,
        verifiedAt: new Date(),
        verificationNote: noteResult.value,
        completedAt: new Date(), // legacy field — keep in sync
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: 'Request state changed. Please refresh.',
      };
    }

    revalidatePath('/sterilization');
    revalidatePath(`/sterilization/${requestId}`);
    revalidatePath('/verify');
    return { success: true };
  } catch (err) {
    console.error('[verifySterilizationProof]', err);
    return { success: false, error: 'Failed to verify.' };
  }
}

// ─── Dispute ───────────────────────────────────────────────────────────────
export async function disputeSterilizationProof(
  requestId: string,
  formData: FormData
): Promise<ActionResult> {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) return { success: false, error: 'Please sign in.' };

  const request = await prisma.sterilizationRequest.findUnique({
    where: { id: requestId },
    select: { id: true, rescuerId: true, status: true },
  });

  if (!request) return { success: false, error: 'Request not found.' };

  if (
    request.status !== 'PROOF_SUBMITTED' &&
    request.status !== 'VERIFIED'
  ) {
    return {
      success: false,
      error: 'Only submitted or verified proofs can be disputed.',
    };
  }

  if (request.rescuerId === dbUser.id) {
    return {
      success: false,
      error: 'You cannot dispute your own proof.',
    };
  }

  const reasonResult = validateString(
    formData.get('disputeReason'),
    'Dispute reason',
    { min: 10, max: DISPUTE_REASON_MAX, required: true }
  );
  if (!reasonResult.ok) {
    return { success: false, error: reasonResult.error };
  }

  try {
    const result = await prisma.sterilizationRequest.updateMany({
      where: {
        id: requestId,
        status: { in: ['PROOF_SUBMITTED', 'VERIFIED'] },
      },
      data: {
        status: 'DISPUTED',
        disputedAt: new Date(),
        disputedById: dbUser.id,
        disputeReason: reasonResult.value,
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: 'Request state changed. Please refresh.',
      };
    }

    revalidatePath('/sterilization');
    revalidatePath(`/sterilization/${requestId}`);
    revalidatePath('/verify');
    return { success: true };
  } catch (err) {
    console.error('[disputeSterilizationProof]', err);
    return { success: false, error: 'Failed to file dispute.' };
  }
}

// ─── Resolve dispute ───────────────────────────────────────────────────────
export async function resolveSterilizationDispute(
  requestId: string,
  formData: FormData
): Promise<ActionResult> {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) return { success: false, error: 'Please sign in.' };

  if (!hasRole(dbUser, 'VERIFIER')) {
    return {
      success: false,
      error: 'Only verified reviewers can resolve disputes.',
    };
  }

  const request = await prisma.sterilizationRequest.findUnique({
    where: { id: requestId },
    select: { id: true, status: true, rescuerId: true },
  });

  if (!request) return { success: false, error: 'Request not found.' };

  if (request.status !== 'DISPUTED') {
    return {
      success: false,
      error: 'This request is not currently disputed.',
    };
  }

  const action = formData.get('action');
  if (action !== 'approve' && action !== 'reject') {
    return { success: false, error: 'Choose approve or reject.' };
  }

  const noteResult = validateString(
    formData.get('resolutionNote'),
    'Resolution note',
    { max: VERIFICATION_NOTE_MAX }
  );
  if (!noteResult.ok) {
    return { success: false, error: noteResult.error };
  }

  try {
    if (action === 'approve') {
      const result = await prisma.sterilizationRequest.updateMany({
        where: { id: requestId, status: 'DISPUTED' },
        data: {
          status: 'VERIFIED',
          verifiedById: dbUser.id,
          verifiedAt: new Date(),
          verificationNote: noteResult.value,
          completedAt: new Date(),
          // Clear dispute fields — proof is now accepted
          disputedAt: null,
          disputedById: null,
          disputeReason: null,
        },
      });

      if (result.count === 0) {
        return {
          success: false,
          error: 'Request state changed. Please refresh.',
        };
      }
    } else {
      // Reject: send back to rescuer for re-submission
      const result = await prisma.sterilizationRequest.updateMany({
        where: { id: requestId, status: 'DISPUTED' },
        data: {
          status: 'SCHEDULED',
          // Keep dispute info as a breadcrumb
          verificationNote: noteResult.value,
          // Clear proof — rescuer must re-upload
          completionCertificateUrl: null,
          completionNotes: null,
          clinicName: null,
          veterinarianName: null,
          completionLatitude: null,
          completionLongitude: null,
          proofSubmittedAt: null,
        },
      });

      if (result.count === 0) {
        return {
          success: false,
          error: 'Request state changed. Please refresh.',
        };
      }
    }

    revalidatePath('/sterilization');
    revalidatePath(`/sterilization/${requestId}`);
    revalidatePath('/verify');
    return { success: true };
  } catch (err) {
    console.error('[resolveSterilizationDispute]', err);
    return { success: false, error: 'Failed to resolve dispute.' };
  }
}

// ─── Cancel ────────────────────────────────────────────────────────────────
export async function cancelSterilizationRequest(
  requestId: string,
  formData: FormData
): Promise<ActionResult> {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) return { success: false, error: 'Please sign in.' };

  const request = await prisma.sterilizationRequest.findUnique({
    where: { id: requestId },
    select: { id: true, userId: true, rescuerId: true, status: true },
  });

  if (!request) return { success: false, error: 'Request not found.' };

  if (
    request.status === 'VERIFIED' ||
    request.status === 'COMPLETED' ||
    request.status === 'CANCELLED'
  ) {
    return {
      success: false,
      error: 'This request is already closed or verified.',
    };
  }

  const isRequester = request.userId === dbUser.id;
  const isRescuer = request.rescuerId === dbUser.id;
  const isAdmin = dbUser.role === 'ADMIN';

  if (!isRequester && !isRescuer && !isAdmin) {
    return {
      success: false,
      error: 'You are not allowed to cancel this request.',
    };
  }

  const reasonResult = validateString(
    formData.get('cancellationNote'),
    'Cancellation reason',
    { max: CANCELLATION_NOTE_MAX }
  );
  if (!reasonResult.ok) {
    return { success: false, error: reasonResult.error };
  }

  const reopening = isRescuer && !isRequester && !isAdmin;

  try {
    const result = await prisma.sterilizationRequest.updateMany({
      where: {
        id: requestId,
        status: { in: ['PENDING', 'SCHEDULED'] },
      },
      data: reopening
        ? {
            status: 'PENDING',
            rescuerId: null,
            scheduledAt: null,
            scheduledNotes: null,
            cancellationNote: reasonResult.value,
          }
        : {
            status: 'CANCELLED',
            cancelledAt: new Date(),
            cancellationNote: reasonResult.value,
          },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: 'Request state changed. Please refresh.',
      };
    }

    revalidatePath('/sterilization');
    revalidatePath(`/sterilization/${requestId}`);
    return { success: true };
  } catch (err) {
    console.error('[cancelSterilizationRequest]', err);
    return { success: false, error: 'Failed to cancel request.' };
  }
}

// ─── Queue for verifiers ───────────────────────────────────────────────────
export interface VerificationQueueItem {
  id: string;
  animalType: string;
  count: number;
  location: string;
  status: string;
  certificateUrl: string | null;
  completionNotes: string | null;
  clinicName: string | null;
  veterinarianName: string | null;
  proofSubmittedAt: Date | null;
  disputeReason: string | null;
  requesterName: string | null;
  rescuerName: string | null;
  createdAt: Date;
}

export async function getVerificationQueue(): Promise<VerificationQueueItem[]> {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) return [];
  if (!hasRole(dbUser, 'VERIFIER')) return [];

  const rows = await prisma.sterilizationRequest.findMany({
    where: { status: { in: ['PROOF_SUBMITTED', 'DISPUTED'] } },
    orderBy: [{ proofSubmittedAt: 'asc' }, { createdAt: 'asc' }],
    include: {
      user: { select: { name: true } },
      rescuer: { select: { name: true } },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    animalType: r.animalType,
    count: r.count,
    location: r.location,
    status: r.status,
    certificateUrl: r.completionCertificateUrl,
    completionNotes: r.completionNotes,
    clinicName: r.clinicName,
    veterinarianName: r.veterinarianName,
    proofSubmittedAt: r.proofSubmittedAt,
    disputeReason: r.disputeReason,
    requesterName: r.user.name,
    rescuerName: r.rescuer?.name ?? null,
    createdAt: r.createdAt,
  }));
}