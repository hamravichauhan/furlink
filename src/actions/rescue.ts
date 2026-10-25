'use server';

import { prisma } from '@/lib/prisma';
import { getOrCreateCurrentUser } from '@/lib/auth-sync';
import { revalidatePath } from 'next/cache';
import { RescueStatus } from '@prisma/client';

export type CreateRescueResult =
  | { success: true; rescueId: string }
  | { success: false; error: string };

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

// ─── Create Rescue Report ──────────────────────────────────────────────────
export async function createRescueReport(
  formData: FormData
): Promise<CreateRescueResult> {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) {
    return { success: false, error: 'Please sign in to file a report.' };
  }

  const animalType = (formData.get('animalType') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const location = (formData.get('location') as string)?.trim();
  const imageUrl = (formData.get('imageUrl') as string)?.trim();
  const urgencyRaw = (formData.get('urgency') as string)?.trim();
  const urgency = urgencyRaw === 'CRITICAL' ? 'CRITICAL' : 'STANDARD';

  if (!animalType || !description || !location) {
    return {
      success: false,
      error: 'Animal type, description, and location are required.',
    };
  }

  if (!imageUrl) {
    return {
      success: false,
      error: 'A photo of the animal is required.',
    };
  }

  if (!/^(https?:\/\/|data:image\/).+/i.test(imageUrl)) {
    return {
      success: false,
      error: 'Invalid image URL. Please upload a photo through the form.',
    };
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

  try {
    const rescue = await prisma.rescueReport.create({
      data: {
        userId: dbUser.id,
        animalType,
        description,
        location,
        latitude,
        longitude,
        imageUrl,
        urgency,
        status: 'REPORTED',
      },
    });

    revalidatePath('/rescues');
    revalidatePath(`/rescues/${rescue.id}`);
    revalidatePath('/admin/rescues');
    revalidatePath('/admin');
    return { success: true, rescueId: rescue.id };
  } catch (err) {
    console.error('[createRescueReport]', err);
    return {
      success: false,
      error: 'Failed to submit report. Please try again.',
    };
  }
}

// ─── Fetch Rescue by ID ────────────────────────────────────────────────────
export async function getRescueById(rescueId: string) {
  try {
    return await prisma.rescueReport.findUnique({
      where: { id: rescueId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        rescuer: { select: { id: true, name: true, email: true } },
        verifiedBy: { select: { id: true, name: true, email: true } },
        disputedBy: { select: { id: true, name: true, email: true } },
      },
    });
  } catch (err) {
    console.error('[getRescueById]', err);
    return null;
  }
}

// ─── Claim Rescue (Volunteer Steps Up) ─────────────────────────────────────
export async function claimRescueReport(
  rescueId: string,
  notes?: string
): Promise<ActionResult> {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) return { success: false, error: 'Please sign in to claim this rescue.' };

  const rescue = await prisma.rescueReport.findUnique({
    where: { id: rescueId },
    select: { id: true, status: true, rescuerId: true },
  });

  if (!rescue) return { success: false, error: 'Rescue case not found.' };

  if (rescue.status !== 'REPORTED') {
    return {
      success: false,
      error: 'This case has already been claimed or processed.',
    };
  }

  try {
    await prisma.rescueReport.update({
      where: { id: rescueId },
      data: {
        status: 'IN_PROGRESS',
        rescuerId: dbUser.id,
        claimedAt: new Date(),
        rescuerNotes: notes?.trim() || null,
      },
    });

    revalidatePath('/rescues');
    revalidatePath(`/rescues/${rescueId}`);
    revalidatePath('/admin/rescues');
    revalidatePath('/admin/verifications');
    return { success: true };
  } catch (err) {
    console.error('[claimRescueReport]', err);
    return { success: false, error: 'Failed to claim rescue. Please try again.' };
  }
}

// ─── Release Rescue (Rescuer cannot attend) ────────────────────────────────
export async function releaseRescueReport(rescueId: string): Promise<ActionResult> {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) return { success: false, error: 'Please sign in.' };

  const rescue = await prisma.rescueReport.findUnique({
    where: { id: rescueId },
    select: { id: true, status: true, rescuerId: true },
  });

  if (!rescue) return { success: false, error: 'Rescue case not found.' };

  const isRescuer = rescue.rescuerId === dbUser.id;
  const isAdmin = dbUser.role === 'ADMIN' || dbUser.role === 'VERIFIER';

  if (!isRescuer && !isAdmin) {
    return { success: false, error: 'Only the assigned rescuer or an admin can release this case.' };
  }

  try {
    await prisma.rescueReport.update({
      where: { id: rescueId },
      data: {
        status: 'REPORTED',
        rescuerId: null,
        claimedAt: null,
        rescuerNotes: null,
      },
    });

    revalidatePath('/rescues');
    revalidatePath(`/rescues/${rescueId}`);
    revalidatePath('/admin/rescues');
    return { success: true };
  } catch (err) {
    console.error('[releaseRescueReport]', err);
    return { success: false, error: 'Failed to release rescue case.' };
  }
}

// ─── Submit Rescue Proof & Medical Bill (By Rescuer) ───────────────────────
export async function submitRescueProof(
  rescueId: string,
  formData: FormData
): Promise<ActionResult> {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) return { success: false, error: 'Please sign in to submit proof.' };

  const rescue = await prisma.rescueReport.findUnique({
    where: { id: rescueId },
    select: { id: true, status: true, rescuerId: true },
  });

  if (!rescue) return { success: false, error: 'Rescue case not found.' };

  const isRescuer = rescue.rescuerId === dbUser.id;
  const isAdmin = dbUser.role === 'ADMIN';

  if (!isRescuer && !isAdmin) {
    return { success: false, error: 'Only the assigned rescuer can submit medical proof.' };
  }

  if (rescue.status !== 'IN_PROGRESS') {
    return { success: false, error: 'This case is not in progress.' };
  }

  const proofImageUrl = (formData.get('proofImageUrl') as string)?.trim();
  const treatmentBillUrl = (formData.get('treatmentBillUrl') as string)?.trim();
  const clinicName = (formData.get('clinicName') as string)?.trim();
  const veterinarianName = (formData.get('veterinarianName') as string)?.trim();
  const costRaw = formData.get('treatmentCost');
  const completionNotes = (formData.get('completionNotes') as string)?.trim();

  if (!proofImageUrl) {
    return { success: false, error: 'Proof photo of treated animal is required.' };
  }
  if (!clinicName) {
    return { success: false, error: 'Clinic or veterinary hospital name is required.' };
  }
  if (!completionNotes || completionNotes.length < 5) {
    return { success: false, error: 'Please provide treatment summary notes (min 5 chars).' };
  }

  let treatmentCost: number | null = null;
  if (costRaw) {
    const parsedCost = Number(costRaw);
    if (Number.isFinite(parsedCost) && parsedCost >= 0) {
      treatmentCost = parsedCost;
    }
  }

  try {
    await prisma.rescueReport.update({
      where: { id: rescueId },
      data: {
        status: 'PROOF_SUBMITTED',
        proofImageUrl,
        treatmentBillUrl: treatmentBillUrl || null,
        clinicName,
        veterinarianName: veterinarianName || null,
        treatmentCost,
        completionNotes,
        proofSubmittedAt: new Date(),
      },
    });

    revalidatePath('/rescues');
    revalidatePath(`/rescues/${rescueId}`);
    revalidatePath('/admin/rescues');
    revalidatePath('/admin/verifications');
    revalidatePath('/verify');
    return { success: true };
  } catch (err) {
    console.error('[submitRescueProof]', err);
    return { success: false, error: 'Failed to submit medical proof.' };
  }
}

// ─── Verify Rescue Proof (By Admin / Verifier) ─────────────────────────────
export async function verifyRescueProof(
  rescueId: string,
  formData: FormData
): Promise<ActionResult> {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) return { success: false, error: 'Please sign in.' };

  if (dbUser.role !== 'ADMIN' && dbUser.role !== 'VERIFIER') {
    return { success: false, error: 'Only admins or verifiers can verify treatment proofs.' };
  }

  const rescue = await prisma.rescueReport.findUnique({
    where: { id: rescueId },
    select: { id: true, status: true, rescuerId: true },
  });

  if (!rescue) return { success: false, error: 'Rescue case not found.' };

  if (rescue.status !== 'PROOF_SUBMITTED' && rescue.status !== 'IN_PROGRESS') {
    return { success: false, error: 'Case is not awaiting proof verification.' };
  }

  const verificationNote = (formData.get('verificationNote') as string)?.trim() || null;
  const outcome = (formData.get('outcome') as string)?.trim() || 'TERRITORIAL_RELEASE';
  const targetStatus = (formData.get('targetStatus') as string)?.trim() === 'CLOSED' ? 'CLOSED' : 'RESCUED';

  try {
    await prisma.rescueReport.update({
      where: { id: rescueId },
      data: {
        status: targetStatus,
        verifiedById: dbUser.id,
        verifiedAt: new Date(),
        verificationNote,
        outcome,
      },
    });

    revalidatePath('/rescues');
    revalidatePath(`/rescues/${rescueId}`);
    revalidatePath('/admin/rescues');
    revalidatePath('/admin/verifications');
    revalidatePath('/verify');
    return { success: true };
  } catch (err) {
    console.error('[verifyRescueProof]', err);
    return { success: false, error: 'Failed to verify proof.' };
  }
}

// ─── Dispute / Report as Fake (By Citizen Jayesh or Community) ─────────────
export async function disputeRescueReport(
  rescueId: string,
  formData: FormData
): Promise<ActionResult> {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) return { success: false, error: 'Please sign in to report a concern.' };

  const rescue = await prisma.rescueReport.findUnique({
    where: { id: rescueId },
    select: { id: true, rescuerId: true, status: true },
  });

  if (!rescue) return { success: false, error: 'Rescue case not found.' };

  // Rescuer cannot dispute their own submission
  if (rescue.rescuerId === dbUser.id) {
    return { success: false, error: 'You cannot dispute your own rescue submission.' };
  }

  if (
    rescue.status !== 'PROOF_SUBMITTED' &&
    rescue.status !== 'RESCUED' &&
    rescue.status !== 'CLOSED'
  ) {
    return {
      success: false,
      error: 'Only completed or proof-submitted rescues can be disputed.',
    };
  }

  const disputeReason = (formData.get('disputeReason') as string)?.trim();
  if (!disputeReason || disputeReason.length < 10) {
    return {
      success: false,
      error: 'Please provide a detailed reason for disputing this case (minimum 10 characters).',
    };
  }

  try {
    await prisma.rescueReport.update({
      where: { id: rescueId },
      data: {
        status: 'DISPUTED',
        disputedById: dbUser.id,
        disputedAt: new Date(),
        disputeReason,
      },
    });

    revalidatePath('/rescues');
    revalidatePath(`/rescues/${rescueId}`);
    revalidatePath('/admin/rescues');
    revalidatePath('/admin/verifications');
    revalidatePath('/verify');
    return { success: true };
  } catch (err) {
    console.error('[disputeRescueReport]', err);
    return { success: false, error: 'Failed to file dispute.' };
  }
}

// ─── Resolve Dispute (By Admin Ravi) ───────────────────────────────────────
export async function resolveRescueDispute(
  rescueId: string,
  formData: FormData
): Promise<ActionResult> {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) return { success: false, error: 'Please sign in.' };
  if (dbUser.role !== 'ADMIN') {
    return { success: false, error: 'Only admins can resolve disputes.' };
  }

  const action = (formData.get('action') as string)?.trim();
  const resolutionNote = (formData.get('resolutionNote') as string)?.trim();

  try {
    if (action === 'reopen') {
      // Re-open case for genuine rescuer
      await prisma.rescueReport.update({
        where: { id: rescueId },
        data: {
          status: 'REPORTED',
          rescuerId: null,
          claimedAt: null,
          proofSubmittedAt: null,
          verificationNote: resolutionNote ? `Dispute reopened: ${resolutionNote}` : null,
        },
      });
    } else if (action === 'confirm_rescued') {
      // Reaffirm genuine rescue
      await prisma.rescueReport.update({
        where: { id: rescueId },
        data: {
          status: 'RESCUED',
          verificationNote: resolutionNote ? `Dispute cleared: ${resolutionNote}` : 'Dispute reviewed and cleared by admin.',
        },
      });
    } else if (action === 'close_fraud') {
      // Confirm fraud and close case with note
      await prisma.rescueReport.update({
        where: { id: rescueId },
        data: {
          status: 'CLOSED',
          verificationNote: resolutionNote ? `Confirmed Fraudulent: ${resolutionNote}` : 'Confirmed Fraudulent Proof.',
        },
      });
    }

    revalidatePath('/rescues');
    revalidatePath(`/rescues/${rescueId}`);
    revalidatePath('/admin/rescues');
    revalidatePath('/admin/verifications');
    return { success: true };
  } catch (err) {
    console.error('[resolveRescueDispute]', err);
    return { success: false, error: 'Failed to resolve dispute.' };
  }
}

// ─── Manual Status Update (Admin) ──────────────────────────────────────────
export async function updateRescueStatus(
  rescueId: string,
  status: RescueStatus
) {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) return { success: false, error: 'Please sign in.' };
  if (dbUser.role !== 'ADMIN' && dbUser.role !== 'VERIFIER') {
    return { success: false, error: 'Only admins or verifiers can update rescue status.' };
  }

  try {
    await prisma.rescueReport.update({
      where: { id: rescueId },
      data: { status },
    });

    revalidatePath('/rescues');
    revalidatePath(`/rescues/${rescueId}`);
    revalidatePath('/admin/rescues');
    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    console.error('[updateRescueStatus]', err);
    return { success: false, error: 'Failed to update rescue status.' };
  }
}

// ─── Delete Rescue (Admin) ─────────────────────────────────────────────────
export async function deleteRescueReport(rescueId: string) {
  const dbUser = await getOrCreateCurrentUser();
  if (!dbUser) return { success: false, error: 'Please sign in.' };
  if (dbUser.role !== 'ADMIN') {
    return { success: false, error: 'Only admins can delete rescue reports.' };
  }

  try {
    await prisma.rescueReport.delete({
      where: { id: rescueId },
    });

    revalidatePath('/rescues');
    revalidatePath('/admin/rescues');
    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    console.error('[deleteRescueReport]', err);
    return { success: false, error: 'Failed to delete rescue report.' };
  }
}
