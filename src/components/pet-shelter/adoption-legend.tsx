import React from "react";
import { AnimalLineIcon } from "./animals-data";

export default function AdoptionLegend() {
  const taraPhoto = "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80";

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 md:px-8 border-y border-gray-200/80 bg-[#F8FAF8]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-emerald-700 font-heading text-xs tracking-widest uppercase block mb-1 font-bold">
            Rescue Case Logic
          </span>
          <h3 className="font-heading text-2xl sm:text-4xl text-[#163829] tracking-tight font-black">
            How our waiting board works
          </h3>
          <p className="font-body text-xs sm:text-sm text-gray-600 mt-2">
            Every badge is a living shelter resident. The status tells you who is waiting, who needs immediate foster, and who made it safely home.
          </p>
        </div>

        {/* Three States of ONE Animal Badge Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Waiting */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs flex flex-col items-center text-center">
            <div className="w-48 sm:w-52 p-3 rounded-2xl border border-gray-200 bg-[#F8FAF8] flex items-center justify-center mb-5">
              <div className="w-full rounded-2xl bg-white border border-gray-200 text-[#163829] p-3 flex flex-col justify-between shadow-xs">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="font-heading text-2xl font-black leading-none text-[#163829]">
                    03
                  </span>
                  <span className="font-body text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Waiting 189 days
                  </span>
                  <AnimalLineIcon species="Dog" className="w-4 h-4 text-gray-500" />
                </div>

                {/* Pet Photo Frame */}
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-gray-200 my-2 bg-gray-100 shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={taraPhoto}
                    alt="Tara Indie Pup"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Footer label */}
                <div className="text-left">
                  <div className="font-heading text-sm font-bold leading-tight text-[#163829]">
                    Tara (Indie)
                  </div>
                  <div className="font-body text-[10px] text-gray-500 mt-0.5">
                    1 year · Female
                  </div>
                </div>
              </div>
            </div>

            <p className="font-body text-sm text-[#163829] font-medium leading-relaxed">
              <strong>Active Intake</strong>: animal waiting in shelter care. Days counted daily until matched.
            </p>
          </div>

          {/* Card 2: Urgent Foster */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs flex flex-col items-center text-center">
            <div className="relative w-48 sm:w-52 p-3 rounded-2xl border border-amber-200 bg-amber-50/50 flex items-center justify-center mb-5">
              <div className="w-full rounded-2xl bg-white border border-amber-200 text-[#163829] p-3 flex flex-col justify-between shadow-xs">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="font-heading text-2xl font-black leading-none text-[#163829]">
                    03
                  </span>
                  <span className="font-body text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                    Foster Needed
                  </span>
                  <AnimalLineIcon species="Dog" className="w-4 h-4 text-gray-500" />
                </div>

                {/* Pet Photo Frame */}
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-gray-200 my-2 bg-gray-100 shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={taraPhoto}
                    alt="Tara Indie Pup"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Footer label */}
                <div className="text-left">
                  <div className="font-heading text-sm font-bold leading-tight text-[#163829]">
                    Tara (Indie)
                  </div>
                  <div className="font-body text-[10px] text-gray-500 mt-0.5">
                    1 year · Female
                  </div>
                </div>
              </div>
            </div>

            <p className="font-body text-sm text-[#163829] font-medium leading-relaxed">
              <strong>Urgent Foster</strong>: high-priority shelter case requiring immediate temporary home.
            </p>
          </div>

          {/* Card 3: Placed / Adopted */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs flex flex-col items-center text-center">
            <div className="relative w-48 sm:w-52 p-3 rounded-2xl border border-emerald-200 bg-emerald-50/30 flex items-center justify-center mb-5 overflow-hidden">
              <div className="w-full rounded-2xl p-1 flex flex-col justify-between text-left">
                {/* Header row */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading text-2xl font-black text-emerald-800 leading-none">
                    03
                  </span>
                  <span className="font-body text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-emerald-300 bg-emerald-100 text-emerald-900">
                    Permanent Home
                  </span>
                </div>

                {/* Stamped Pet Photo Frame */}
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-emerald-200 my-1 bg-white shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={taraPhoto}
                    alt="Tara Adopted"
                    className="w-full h-full object-cover opacity-85"
                  />
                  {/* Diagonal Adoption Seal */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="transform -rotate-12 bg-emerald-700 text-white font-heading font-black text-[11px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md border border-white">
                      ADOPTED &amp; SEALED
                    </span>
                  </div>
                </div>

                {/* Footer info */}
                <div className="mt-2">
                  <div className="font-heading text-sm font-bold text-[#163829] leading-tight">
                    Tara (Adopted)
                  </div>
                  <div className="font-body text-[10px] text-emerald-700 font-semibold mt-0.5">
                    Placed Nov 02 · Bangalore
                  </div>
                </div>
              </div>
            </div>

            <p className="font-body text-sm text-[#163829] font-medium leading-relaxed">
              <strong>Permanent Home</strong>: loving guardian secured. Adoption finalized on record.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
