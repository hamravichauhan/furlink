import React from "react";

const TEAM = [
  {
    name: "Dr. Arvind Rao",
    role: "Chief Veterinary Surgeon",
    quote: "Every street animal deserves the exact same sterile surgical technique as a cherished private companion.",
  },
  {
    name: "Pooja Patil",
    role: "Shelter Operations Lead",
    quote: "I know the bark and sleeping quirk of all 42 animals in our recovery wards by heart.",
  },
  {
    name: "Karan Desai",
    role: "Emergency Ambulance Driver",
    quote: "When the dispatch phone rings at 02:00, someone's life is on the highway line. We never delay.",
  },
];

export default function SanctuarySeal() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* The Arced-Text Roundel Seal & Mission Statement */}
        <div className="bg-[#f2e9db] rounded-3xl p-8 sm:p-12 border-[1.5px] border-[#1A2540]/25 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
            {/* Roundel Seal */}
            <div className="shrink-0">
              <svg
                viewBox="0 0 200 200"
                className="w-44 h-44 sm:w-52 sm:h-52 drop-shadow-md select-none"
              >
                <defs>
                  {/* Top Arc */}
                  <path
                    id="sealTopArc"
                    d="M 28 100 A 72 72 0 0 1 172 100"
                    fill="none"
                  />
                  {/* Bottom Arc (Reads upright) */}
                  <path
                    id="sealBottomArc"
                    d="M 28 106 A 72 72 0 0 0 172 106"
                    fill="none"
                  />
                </defs>

                {/* Crimson Circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="95"
                  fill="#cc2b3f"
                  stroke="#1A2540"
                  strokeWidth="2"
                />

                {/* Dashed Cream Inner Ring */}
                <circle
                  cx="100"
                  cy="100"
                  r="56"
                  fill="none"
                  stroke="#f2e9db"
                  strokeWidth="1.5"
                  strokeDasharray="3.5 3.5"
                />

                {/* Top Arced Text */}
                <text
                  fill="#f2e9db"
                  fontSize="8.5"
                  fontWeight="800"
                  fontFamily="'League Spartan', sans-serif"
                  letterSpacing="0.14em"
                >
                  <textPath
                    href="#sealTopArc"
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    FURLINK ANIMAL WELFARE SANCTUARY
                  </textPath>
                </text>

                {/* Bottom Arced Text */}
                <text
                  fill="#f2e9db"
                  fontSize="8"
                  fontWeight="700"
                  fontFamily="'League Spartan', sans-serif"
                  letterSpacing="0.12em"
                >
                  <textPath
                    href="#sealBottomArc"
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    ZERO EUTHANASIA CHARTER &amp; RESCUE
                  </textPath>
                </text>

                {/* Centered Cream Rescue Paw & Heart Mark */}
                <g
                  stroke="#f2e9db"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  transform="translate(86, 86)"
                >
                  <path d="M14 22 C14 22, 6 16, 6 9 C6 5.5, 9 3, 12 5 L14 7 L16 5 C19 3, 22 5.5, 22 9 C22 16, 14 22, 14 22 Z" />
                  <circle cx="10" cy="10" r="1" fill="#f2e9db" />
                  <circle cx="18" cy="10" r="1" fill="#f2e9db" />
                </g>
              </svg>
            </div>

            {/* Charter Narrative */}
            <div className="space-y-3 text-center sm:text-left">
              <span className="font-heading text-xs tracking-widest uppercase text-[#cc2b3f] font-bold block">
                Ethical Operating Charter
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl text-[#1A2540]">
                We never euthanize for shelter space or time.
              </h3>
              <p className="font-body text-sm text-[#1A2540]/85 leading-relaxed">
                If an animal takes 10 days or 600 days to find their family, they remain safe, fed, vaccinated, and cared for in our shelter. Every case is treated as an individual life with dignity, not a statistic on an overflow roster.
              </p>
              <div className="pt-2 font-body text-xs text-[#1A2540]/70 flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <span>100% Volunteer Board</span>
                <span>·</span>
                <span>Zero Administrative Overhead</span>
                <span>·</span>
                <span>80G Tax Deductible</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-Feeling People Behind It & Transparency Strip */}
        <div>
          <div className="text-center max-w-md mx-auto mb-8">
            <span className="font-heading text-xs uppercase tracking-widest text-[#cc2b3f] font-bold block mb-1">
              Field Caregivers
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl text-[#1A2540]">
              The people behind the cases
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM.map((member, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border-[1.5px] border-[#1A2540]/20 p-6 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="font-heading text-lg text-[#1A2540]">
                    {member.name}
                  </div>
                  <div className="font-body text-xs text-[#cc2b3f] font-semibold mt-0.5">
                    {member.role}
                  </div>
                  <p className="font-body text-xs text-[#1A2540]/80 mt-3 leading-relaxed italic">
                    &ldquo;{member.quote}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Transparency Strip */}
          <div className="mt-8 bg-[#1A2540] text-[#f2e9db] rounded-2xl p-5 border border-[#1A2540] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#cc2b3f]" />
              <span className="font-heading text-sm text-[#f2e9db]">
                100% Public Funds Direct-to-Care Guarantee
              </span>
            </div>
            <div className="font-body text-xs text-[#f2e9db]/70 text-center sm:text-right">
              Audited by licensed chartered accountants · Public receipts on /donate
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
