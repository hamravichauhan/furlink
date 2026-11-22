import React from "react";
import Link from "next/link";

export default function FinalCallBand() {
  return (
    <section className="w-full bg-[#163829] text-white py-16 sm:py-24 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <span className="font-heading text-xs tracking-widest uppercase text-[#74C69D] block font-bold">
          Emergency Action Call
        </span>

        <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl text-white tracking-tight max-w-3xl mx-auto leading-tight font-black">
          You can end someone&apos;s waiting today.
        </h2>

        <p className="font-body text-sm sm:text-base text-white/85 max-w-xl mx-auto leading-relaxed">
          Whether you welcome a rescue pet into your family home or fund antibiotics and nutritious meals for an injured stray admitted tonight, your support makes a direct, lasting difference.
        </p>

        {/* Dual Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/adoptions"
            className="bg-[#8A95EB] hover:bg-[#7985DE] text-white px-8 sm:px-10 py-4 text-xs sm:text-sm font-semibold rounded-full shadow-lg transition w-full sm:w-auto"
          >
            Start Your Adoption
          </Link>
          <Link
            href="/donate"
            className="px-8 sm:px-10 py-4 rounded-full border border-white/40 bg-white/10 hover:bg-white text-white hover:text-[#163829] font-body text-xs sm:text-sm font-semibold transition-colors w-full sm:w-auto"
          >
            Sponsor a Medical Meal (₹450)
          </Link>
        </div>

        <p className="font-body text-xs text-white/50 pt-2">
          Sanctuary trauma ambulance line: +91 94812 00000 · 24/7 Roadside Rescue
        </p>
      </div>
    </section>
  );
}
