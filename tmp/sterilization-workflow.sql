ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "rescuerId" TEXT;
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "scheduledAt" TIMESTAMP(3);
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "scheduledNotes" TEXT;
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP(3);
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "completionNotes" TEXT;
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMP(3);
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "cancellationNote" TEXT;

ALTER TABLE "SterilizationRequest"
  ADD CONSTRAINT "SterilizationRequest_rescuerId_fkey"
  FOREIGN KEY ("rescuerId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "SterilizationRequest_rescuerId_idx" ON "SterilizationRequest"("rescuerId");
CREATE INDEX IF NOT EXISTS "SterilizationRequest_status_idx" ON "SterilizationRequest"("status");
CREATE INDEX IF NOT EXISTS "SterilizationRequest_createdAt_idx" ON "SterilizationRequest"("createdAt");
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION;
ALTER TABLE "SterilizationRequest" ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION;