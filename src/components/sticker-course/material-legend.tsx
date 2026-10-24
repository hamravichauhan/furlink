import React from "react";

export default function MaterialLegend() {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 md:px-8 border-y-[1.5px] border-[#1A2540]/15 bg-[#f3c9d5]/60">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[#cc2b3f] font-heading text-xs tracking-widest uppercase block mb-1 font-bold">
            Material Logic
          </span>
          <h3 className="font-heading text-2xl sm:text-3xl text-[#1A2540] tracking-tight">
            How your sheet works
          </h3>
        </div>

        {/* Three States of ONE Sticker Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: The Intact Sticker */}
          <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-7 border-[1.5px] border-[#1A2540]/25 shadow-md flex flex-col items-center text-center">
            <div className="w-40 h-40 p-1.5 rounded-[22px] border-[1.5px] border-dashed border-[#1A2540] bg-[#f2e9db] flex items-center justify-center mb-6">
              <div className="w-full h-full rounded-2xl bg-[#cc2b3f] border-[1.5px] border-[#1A2540] text-[#f2e9db] p-4 flex flex-col justify-between">
                <span className="font-heading text-3xl font-extrabold leading-none text-left">
                  03
                </span>
                <div className="text-left">
                  <div className="font-heading text-xs leading-snug">
                    Vector Beziers
                  </div>
                  <div className="font-body text-[10px] text-[#f2e9db]/70 mt-0.5">
                    1 h 10 min
                  </div>
                </div>
              </div>
            </div>

            <p className="font-body text-sm text-[#1A2540] font-medium leading-relaxed">
              Intact sticker: module ahead.
            </p>
          </div>

          {/* Card 2: The Lifted Corner */}
          <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-7 border-[1.5px] border-[#1A2540]/25 shadow-md flex flex-col items-center text-center">
            <div className="relative w-40 h-40 p-1.5 rounded-[22px] border-[1.5px] border-dashed border-[#1A2540] bg-[#f2e9db] flex items-center justify-center mb-6">
              <div
                className="w-full h-full rounded-2xl bg-[#cc2b3f] border-[1.5px] border-[#1A2540] text-[#f2e9db] p-4 flex flex-col justify-between"
                style={{
                  clipPath:
                    "polygon(0 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%)",
                }}
              >
                <span className="font-heading text-3xl font-extrabold leading-none text-left">
                  03
                </span>
                <div className="text-left">
                  <div className="font-heading text-xs leading-snug">
                    Vector Beziers
                  </div>
                  <div className="font-body text-[10px] text-[#f2e9db]/70 mt-0.5">
                    1 h 10 min
                  </div>
                </div>
              </div>

              {/* Hatched Peel Shadow under fold */}
              <div
                className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-br-2xl bg-hatch-pattern pointer-events-none"
                style={{
                  clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
                }}
              />

              {/* Folded Flap Triangle */}
              <div
                className="absolute bottom-1.5 right-1.5 w-7 h-7 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, #f2e9db 50%, #cc2b3f 50%)",
                  clipPath: "polygon(0 0, 100% 0, 0 100%)",
                  transform: "rotate(180deg)",
                  filter: "drop-shadow(-2px -2px 3px rgba(26, 37, 64, 0.25))",
                }}
              />
            </div>

            <p className="font-body text-sm text-[#1A2540] font-medium leading-relaxed">
              Lifted corner: the module you peel next.
            </p>
          </div>

          {/* Card 3: The Empty Well */}
          <div className="bg-[#f2e9db] rounded-3xl p-6 sm:p-7 border-[1.5px] border-[#1A2540]/25 shadow-md flex flex-col items-center text-center">
            <div className="w-40 h-40 p-1.5 rounded-[22px] border-[1.5px] border-dashed border-[#EF9CC0] bg-[#EF9CC0]/10 flex items-center justify-center mb-6">
              <div className="w-full h-full rounded-2xl p-4 flex flex-col justify-between text-left">
                <span className="font-heading text-3xl font-extrabold leading-none text-[#EF9CC0]">
                  03
                </span>
                <div>
                  <div className="font-heading text-xs text-[#1A2540] leading-snug">
                    Vector Beziers
                  </div>
                  <div className="font-body text-[10px] text-[#1A2540]/65 mt-0.5">
                    Peeled Oct 26
                  </div>
                </div>
              </div>
            </div>

            <p className="font-body text-sm text-[#1A2540] font-medium leading-relaxed">
              Empty well: module finished. Date recorded.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
