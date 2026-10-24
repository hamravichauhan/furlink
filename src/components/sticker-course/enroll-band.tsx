import React from "react";

export default function EnrollBand() {
  return (
    <section
      id="enroll"
      className="w-full bg-[#1A2540] text-[#f2e9db] border-t-[5px] border-[#cc2b3f] py-16 sm:py-24 px-4 sm:px-6 md:px-8"
    >
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <span className="font-heading text-xs tracking-widest uppercase text-[#EF9CC0] block font-bold">
          Tuition &amp; Physical Sheet Dispatch
        </span>

        <h2 className="font-heading text-3xl sm:text-5xl text-[#f2e9db] tracking-tight max-w-2xl mx-auto leading-tight">
          Claim your sheet and start your practice.
        </h2>

        {/* The two required specification lines */}
        <div className="space-y-2 max-w-xl mx-auto">
          <p className="font-body text-sm sm:text-base text-[#f2e9db]/90 font-medium leading-relaxed">
            Lifetime access to all 8 modules (9 h 20 m) with instant digital unlock and downloadable vector source assets.
          </p>
          <p className="font-body text-xs sm:text-sm text-[#f2e9db]/70 leading-relaxed">
            Your physical kiss-cut sticker sheet is custom printed on heavy 300gsm cream backing paper and mailed anywhere in the world within 48 hours.
          </p>
        </div>

        {/* Price & CTA */}
        <div className="pt-4 flex flex-col items-center gap-4">
          <div className="inline-flex items-baseline gap-2">
            <span className="font-heading text-4xl sm:text-5xl text-[#f2e9db]">
              $240
            </span>
            <span className="font-body text-xs text-[#f2e9db]/60">
              USD · One-time tuition, physical sheet included
            </span>
          </div>

          <a
            href="#checkout"
            className="btn-enroll-pill px-8 sm:px-10 py-4 text-sm sm:text-base tracking-wider shadow-lg"
          >
            ENROLL &amp; GET YOUR SHEET
          </a>

          <p className="font-body text-[11px] text-[#f2e9db]/50 mt-1">
            Zero recurring fees · Unconditional 30-day physical return guarantee
          </p>
        </div>
      </div>
    </section>
  );
}
