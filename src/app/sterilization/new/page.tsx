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
    <div className="bg-[#F8FAF8] text-[#163829] min-h-screen py-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
          <Link
            href="/sterilization"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold hover:underline underline-offset-4"
          >
            &larr; Back to TNVR Registry
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#163829] border border-emerald-100 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Municipal ABC / TNVR Intake
          </span>
        </div>

        {/* Masthead */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-3">
          <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold block">
            Field Dispatch Intake · Belagavi
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#163829] tracking-tight">
            Lodge Field TNVR Request
          </h1>
          <p className="font-body text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl">
            Report unsterilized street dog packs or community cats in your ward. Registered rescuers and municipal veterinary clinics coordinate humane capture, sterile surgery, anti-rabies vaccination, ear-notching, and safe territory release.
          </p>
        </div>

        {/* Intake Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
          <SterilizationForm
            initialUser={
              dbUser
                ? { id: dbUser.id, name: dbUser.name, email: dbUser.email }
                : null
            }
            quota={
              quota
                ? {
                    remainingToday: quota.remainingToday,
                    dailyLimit: quota.dailyLimit,
                    canSubmit: quota.canSubmit,
                    reason: quota.reason,
                  }
                : null
            }
          />
        </div>

        {/* Guidelines & Safety Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
          <h3 className="font-heading text-sm font-bold text-[#163829] uppercase tracking-wider">
            Belagavi TNVR Surgical Standard
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-body text-xs text-gray-600">
            <li className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200/80">
              <strong className="block text-[#163829] font-bold mb-1">Left Ear-Tip Notch</strong>
              Every sterilized dog or cat receives a humane 1/4-inch left ear-tip notch as universal identification.
            </li>
            <li className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200/80">
              <strong className="block text-[#163829] font-bold mb-1">Anti-Rabies Record</strong>
              Sterilized animals are vaccinated with an updated anti-rabies booster and registered in the municipal database.
            </li>
            <li className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200/80">
              <strong className="block text-[#163829] font-bold mb-1">Territory Return</strong>
              Animals must be released back to the exact street coordinates where they were originally captured.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
