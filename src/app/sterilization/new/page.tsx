import Link from "next/link";
import { getOrCreateCurrentUser } from "@/lib/auth-sync";
import { getSterilizationQuota } from "@/actions/sterilization";
import SterilizationForm from "../sterilization-form";

export const dynamic = "force-dynamic";

export default async function NewSterilizationPage() {
  const [dbUser, quota] = await Promise.all([
    getOrCreateCurrentUser(),
    getSterilizationQuota(),
  ]);

  return (
    <div className="bg-[#f3c9d5] text-[#1A2540] min-h-screen py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[#1A2540]/20 pb-4">
          <Link
            href="/sterilization"
            className="font-body text-xs font-semibold text-[#1A2540]/70 hover:text-[#cc2b3f] transition-colors"
          >
            &larr; Back to Surgical Pipeline Registry
          </Link>
          <span className="font-heading text-xs uppercase tracking-wider text-[#cc2b3f] font-bold">
            Municipal ABC / TNVR Intake
          </span>
        </div>

        {/* Masthead */}
        <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-8 border-[1.5px] border-[#1A2540]/25 shadow-xl space-y-3">
          <span className="font-heading text-xs uppercase tracking-widest text-[#cc2b3f] font-bold block">
            Field Dispatch Intake · Belagavi
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl text-[#1A2540] tracking-tight">
            Lodge Field TNVR Request
          </h1>
          <p className="font-body text-sm text-[#1A2540]/80 leading-relaxed">
            Report unsterilized street dog packs or community cats in your ward. Registered rescuers and municipal veterinary clinics coordinate humane capture, sterile surgery, anti-rabies vaccination, ear-notching, and safe territory release.
          </p>
        </div>

        {/* Intake Card */}
        <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-8 border-[1.5px] border-[#1A2540]/25 shadow-xl">
          {!dbUser ? (
            <div className="text-center py-12 space-y-4 max-w-md mx-auto">
              <span className="font-heading text-xs uppercase tracking-widest text-[#cc2b3f] font-bold block">
                Authentication Required
              </span>
              <h2 className="font-heading text-2xl text-[#1A2540]">
                Sign In to Lodge a Surgical Request
              </h2>
              <p className="font-body text-xs sm:text-sm text-[#1A2540]/70 leading-relaxed">
                To prevent fraudulent duplicate dispatches and coordinate directly with field rescue ambulances, you must sign in with your FurLink account.
              </p>
              <div className="pt-2">
                <Link
                  href="/sign-in?redirect_url=/sterilization/new"
                  className="btn-enroll-pill inline-block px-8 py-3 text-xs font-bold"
                >
                  Sign In to Continue &rarr;
                </Link>
              </div>
            </div>
          ) : quota ? (
            <SterilizationForm
              quota={{
                remainingToday: quota.remainingToday,
                dailyLimit: quota.dailyLimit,
                canSubmit: quota.canSubmit,
                reason: quota.reason,
              }}
            />
          ) : (
            <div className="font-body text-sm text-[#1A2540]/60 py-12 text-center">
              Checking municipal dispatch capacity...
            </div>
          )}
        </div>

        {/* Guidelines & Safety Banner */}
        <div className="bg-white/80 rounded-2xl p-6 border-[1.5px] border-[#1A2540]/20 space-y-3">
          <h3 className="font-heading text-sm text-[#1A2540] uppercase tracking-wider">
            Belagavi TNVR Surgical Standard
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-body text-xs text-[#1A2540]/75">
            <li className="bg-[#f2e9db]/60 p-3 rounded-xl border border-[#1A2540]/10">
              <strong className="block text-[#1A2540] mb-1">Left Ear-Tip Notch</strong>
              Every sterilized dog or cat receives a humane 1/4-inch left ear-tip notch as universal identification.
            </li>
            <li className="bg-[#f2e9db]/60 p-3 rounded-xl border border-[#1A2540]/10">
              <strong className="block text-[#1A2540] mb-1">Anti-Rabies Record</strong>
              Sterilized animals are vaccinated with an updated anti-rabies booster and registered in the municipal database.
            </li>
            <li className="bg-[#f2e9db]/60 p-3 rounded-xl border border-[#1A2540]/10">
              <strong className="block text-[#1A2540] mb-1">Territory Return</strong>
              Animals must be released back to the exact street coordinates where they were originally captured.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
