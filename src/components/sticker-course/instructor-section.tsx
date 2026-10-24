import React from "react";

export default function InstructorSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto bg-[#f2e9db] rounded-3xl p-8 sm:p-12 border-[1.5px] border-[#1A2540]/25 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-8 sm:gap-12">
          {/* ONE Arced-Text SVG Roundel Seal */}
          <div className="shrink-0">
            <svg
              viewBox="0 0 200 200"
              className="w-44 h-44 sm:w-52 sm:h-52 drop-shadow-md select-none"
            >
              <defs>
                {/* Top Arc (Clockwise over the top) */}
                <path
                  id="topArcPath"
                  d="M 28 100 A 72 72 0 0 1 172 100"
                  fill="none"
                />
                {/* Bottom Arc (Left-to-right through bottom so text reads upright) */}
                <path
                  id="bottomArcPath"
                  d="M 28 106 A 72 72 0 0 0 172 106"
                  fill="none"
                />
              </defs>

              {/* Crimson Circle Background */}
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

              {/* Outer Thin Decorative Border */}
              <circle
                cx="100"
                cy="100"
                r="88"
                fill="none"
                stroke="#f2e9db"
                strokeWidth="0.75"
                opacity="0.4"
              />

              {/* Top Arced Text: Instructor Name */}
              <text
                fill="#f2e9db"
                fontSize="8.5"
                fontWeight="800"
                fontFamily="'League Spartan', sans-serif"
                letterSpacing="0.14em"
              >
                <textPath
                  href="#topArcPath"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  ELENA VANCE · MASTER PRINTER
                </textPath>
              </text>

              {/* Bottom Arced Text: Course Specialty (Reads upright) */}
              <text
                fill="#f2e9db"
                fontSize="7.5"
                fontWeight="700"
                fontFamily="'League Spartan', sans-serif"
                letterSpacing="0.12em"
              >
                <textPath
                  href="#bottomArcPath"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  KISS-CUT &amp; APPLIED TYPOGRAPHY
                </textPath>
              </text>

              {/* Centered Cream Line Icon (Drafting Nib & Compass mark) */}
              <g
                stroke="#f2e9db"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                transform="translate(86, 86)"
              >
                <path d="M14 2 17 7 14 26 11 7 14 2z" />
                <path d="M14 7v10" />
                <circle cx="14" cy="18" r="1.5" fill="#f2e9db" />
              </g>
            </svg>
          </div>

          {/* Instructor Biography (2-3 honest sentences) */}
          <div className="space-y-3 text-center sm:text-left">
            <span className="font-heading text-xs tracking-widest uppercase text-[#cc2b3f] font-bold block">
              Lead Instructor
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl text-[#1A2540]">
              Elena Vance
            </h3>
            <p className="font-body text-sm text-[#1A2540]/85 leading-relaxed">
              Elena Vance spent twelve years running limited-edition letterpress and risograph editions for independent publishing houses and archival arts institutes across Zurich and London.
            </p>
            <p className="font-body text-sm text-[#1A2540]/85 leading-relaxed">
              She engineered the physical sticker-sheet curriculum after discovering that students retain intricate typographic rules far more effectively when digital milestones are reinforced by a tangible, irreversible peel action.
            </p>
            <div className="pt-2 font-body text-xs text-[#1A2540]/60 flex items-center justify-center sm:justify-start gap-4">
              <span>Author of <em>The Printed Wedge</em></span>
              <span>·</span>
              <span>1,420+ alumni worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
