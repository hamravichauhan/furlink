import React from "react";
import Link from "next/link";

export default function FinalCallBand() {
  return (
    <section className="w-full bg-[#1A2540] text-[#f2e9db] border-t-[5px] border-[#cc2b3f] py-16 sm:py-24 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <span className="font-heading text-xs tracking-widest uppercase text-[#EF9CC0] block font-bold">
          Emergency Action Call
        </span>

        <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl text-[#f2e9db] tracking-tight max-w-3xl mx-auto leading-tight">
          You can end someone&apos;s waiting today.
        </h2>

        <p className="font-body text-sm sm:text-base text-[#f2e9db]/85 max-w-xl mx-auto leading-relaxed">
          Whether you peel an animal&apos;s badge into your family home or fund antibiotics for an injured stray admitted tonight, your action is immediate, tangible, and irreversible.
        </p>

        {/* Exactly Two Big Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/adoptions"
            className="btn-enroll-pill px-8 sm:px-10 py-4 text-xs sm:text-sm font-bold tracking-wider shadow-lg w-full sm:w-auto"
          >
            ADOPT A WAITING ANIMAL
          </Link>
          <Link
            href="/donate"
            className="px-8 sm:px-10 py-4 rounded-full border-[1.5px] border-[#f2e9db] bg-[#f2e9db] hover:bg-white text-[#1A2540] font-body text-xs sm:text-sm font-bold tracking-wider transition-colors w-full sm:w-auto"
          >
            DONATE A MEDICAL MEAL (₹450)
          </Link>
        </div>

        <p className="font-body text-xs text-[#f2e9db]/50 pt-2">
          Sanctuary ambulance dispatch line: +91 94812 00000 · 24/7 Roadside Trauma
        </p>
      </div>
    </section>
  );
}
