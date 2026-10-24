import React from "react";
import { AnimalLineIcon } from "./animals-data";

export default function AdoptionLegend() {
  const taraPhoto = "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80";

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 md:px-8 border-y-[1.5px] border-[#1A2540]/15 bg-[#f3c9d5]/60">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[#cc2b3f] font-heading text-xs tracking-widest uppercase block mb-1 font-bold">
            Rescue Case Logic
          </span>
          <h3 className="font-heading text-2xl sm:text-4xl text-[#1A2540] tracking-tight">
            How our waiting board works
          </h3>
          <p className="font-body text-xs sm:text-sm text-[#1A2540]/75 mt-2">
            Every badge is a living shelter resident. The material state tells you who is waiting, who needs immediate foster, and who made it safely home.
          </p>
        </div>

        {/* Three States of ONE Animal Badge Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Intact Badge with Tara's Photo */}
          <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-7 border-[1.5px] border-[#1A2540]/25 shadow-md flex flex-col items-center text-center">
            <div className="w-48 sm:w-52 p-2 rounded-[22px] border-[1.5px] border-dashed border-[#1A2540] bg-[#f2e9db] flex items-center justify-center mb-5">
              <div className="w-full rounded-2xl bg-[#cc2b3f] border-[1.5px] border-[#1A2540] text-[#f2e9db] p-3 flex flex-col justify-between shadow-xs">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="font-heading text-2xl font-black leading-none">
                    03
                  </span>
                  <span className="font-body text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-[#f2e9db]">
                    Waiting 189 days
                  </span>
                  <AnimalLineIcon species="Dog" className="w-4 h-4 text-[#f2e9db]" />
                </div>

                {/* Pet Photo Frame */}
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border-[1.5px] border-[#1A2540] my-2 bg-slate-900 shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={taraPhoto}
                    alt="Tara Indie Pup"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Footer label */}
                <div className="text-left">
                  <div className="font-heading text-sm font-bold leading-tight">
                    Tara (Indie)
                  </div>
                  <div className="font-body text-[10px] text-[#f2e9db]/75 mt-0.5">
                    1 year · Female
                  </div>
                </div>
              </div>
            </div>

            <p className="font-body text-sm text-[#1A2540] font-medium leading-relaxed">
              <strong>Intact badge</strong>: animal waiting in shelter care. Days counted daily until matched.
            </p>
          </div>

          {/* Card 2: Lifted Corner with Tara's Photo */}
          <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-7 border-[1.5px] border-[#1A2540]/25 shadow-md flex flex-col items-center text-center">
            <div className="relative w-48 sm:w-52 p-2 rounded-[22px] border-[1.5px] border-dashed border-[#1A2540] bg-[#f2e9db] flex items-center justify-center mb-5">
              <div
                className="w-full rounded-2xl bg-[#cc2b3f] border-[1.5px] border-[#1A2540] text-[#f2e9db] p-3 flex flex-col justify-between shadow-xs"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0 100%)",
                }}
              >
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="font-heading text-2xl font-black leading-none">
                    03
                  </span>
                  <span className="font-body text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-[#f2e9db]">
                    Waiting 189 days
                  </span>
                  <AnimalLineIcon species="Dog" className="w-4 h-4 text-[#f2e9db]" />
                </div>

                {/* Pet Photo Frame */}
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border-[1.5px] border-[#1A2540] my-2 bg-slate-900 shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={taraPhoto}
                    alt="Tara Indie Pup"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Footer label */}
                <div className="text-left">
                  <div className="font-heading text-sm font-bold leading-tight">
                    Tara (Indie)
                  </div>
                  <div className="font-body text-[10px] text-[#f2e9db]/75 mt-0.5">
                    1 year · Female
                  </div>
                </div>
              </div>

              {/* Hatched Peel Shadow under fold */}
              <div
                className="absolute bottom-2 right-2 w-8 h-8 rounded-br-2xl bg-hatch-pattern pointer-events-none"
                style={{
                  clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
                }}
              />

              {/* Folded Flap Triangle */}
              <div
                className="absolute bottom-2 right-2 w-8 h-8 pointer-events-none shadow-md"
                style={{
                  background: "linear-gradient(135deg, #f2e9db 50%, #cc2b3f 50%)",
                  clipPath: "polygon(0 0, 100% 0, 0 100%)",
                  transform: "rotate(180deg)",
                  filter: "drop-shadow(-2px -2px 3px rgba(26, 37, 64, 0.25))",
                }}
              />

              <div className="absolute -bottom-2.5 bg-[#1A2540] text-[#f2e9db] font-body text-[9.5px] font-bold px-2.5 py-0.5 rounded-full border border-[#f2e9db] shadow-md pointer-events-none">
                Urgent foster needed
              </div>
            </div>

            <p className="font-body text-sm text-[#1A2540] font-medium leading-relaxed">
              <strong>Lifted corner</strong>: urgent foster case. Ready to go home next.
            </p>
          </div>

          {/* Card 3: Empty Well with Tara's Stamped Photo */}
          <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-7 border-[1.5px] border-[#1A2540]/25 shadow-md flex flex-col items-center text-center">
            <div className="relative w-48 sm:w-52 p-2 rounded-[22px] border-[1.5px] border-dashed border-[#EF9CC0] bg-[#EF9CC0]/15 flex items-center justify-center mb-5 overflow-hidden">
              <div className="w-full rounded-2xl p-3 flex flex-col justify-between text-left">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="font-heading text-2xl font-black text-[#EF9CC0] leading-none">
                    03
                  </span>
                  <span className="font-body text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-[#cc2b3f] bg-white text-[#cc2b3f]">
                    Permanent Home
                  </span>
                </div>

                {/* Stamped Pet Photo Frame */}
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border-[1.5px] border-[#EF9CC0] my-2 bg-white shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={taraPhoto}
                    alt="Tara Adopted"
                    className="w-full h-full object-cover opacity-60 grayscale"
                  />
                  {/* Diagonal Adoption Seal */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="transform -rotate-12 bg-[#cc2b3f] text-[#f2e9db] font-heading font-black text-[11px] uppercase tracking-widest px-2.5 py-1 shadow-md border border-[#f2e9db]">
                      ADOPTED &amp; SEALED
                    </span>
                  </div>
                </div>

                {/* Footer info */}
                <div>
                  <div className="font-heading text-sm font-bold text-[#1A2540] leading-tight">
                    Tara (Adopted)
                  </div>
                  <div className="font-body text-[10px] text-[#cc2b3f] font-semibold mt-0.5">
                    Placed Nov 02 · Bangalore
                  </div>
                </div>
              </div>
            </div>

            <p className="font-body text-sm text-[#1A2540] font-medium leading-relaxed">
              <strong>Empty well</strong>: permanent home secured. Adoption date sealed on record.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
