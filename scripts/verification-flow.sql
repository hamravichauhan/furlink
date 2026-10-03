-- Add VERIFIER to Role enum
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'VERIFIER';

-- Add new SterilizationStatus values
ALTER TYPE "SterilizationStatus" ADD VALUE IF NOT EXISTS 'PROOF_SUBMITTED';
ALTER TYPE "SterilizationStatus" ADD VALUE IF NOT EXISTS 'VERIFIED';
ALTER TYPE "SterilizationStatus" ADD VALUE IF NOT EXISTS 'DISPUTED';

-- User: promotion audit trail
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "roleUpdatedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "promotedById" TEXT;
ALTER TABLE "User" ADD CONSTRAINT "User_promotedById_fkey"
  FOREIGN KEY ("promotedById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- SterilizationRequest: proof of work
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "completionCertificateUrl" TEXT;
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "completionNotes" TEXT;
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "clinicName" TEXT;
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "veterinarianName" TEXT;
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "completionLatitude" DOUBLE PRECISION;
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "completionLongitude" DOUBLE PRECISION;
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "proofSubmittedAt" TIMESTAMP(3);

-- SterilizationRequest: verification
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "verifiedById" TEXT;
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "verifiedAt" TIMESTAMP(3);
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "verificationNote" TEXT;
ALTER TABLE "SterilizationRequest" ADD CONSTRAINT "SterilizationRequest_verifiedById_fkey"
  FOREIGN KEY ("verifiedById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- SterilizationRequest: dispute
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "disputedAt" TIMESTAMP(3);
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "disputedById" TEXT;
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "disputeReason" TEXT;
ALTER TABLE "SterilizationRequest" ADD CONSTRAINT "SterilizationRequest_disputedById_fkey"
  FOREIGN KEY ("disputedById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Indexes for the verifier queue
CREATE INDEX IF NOT EXISTS "SterilizationRequest_verifiedById_idx" ON "SterilizationRequest"("verifiedById");
CREATE INDEX IF NOT EXISTS "SterilizationRequest_status_idx" ON "SterilizationRequest"("status");
CREATE INDEX IF NOT EXISTS "SterilizationRequest_createdAt_idx" ON "SterilizationRequest"("createdAt");