import React from "react";

const FAQS = [
  {
    q: "How does the physical sticker sheet arrive?",
    a: "Within 48 hours of enrollment, your sheet is packed flat inside a reinforced, stay-flat cardboard sleeve and shipped via tracked international airmail. You receive a digital tracking code immediately upon dispatch.",
  },
  {
    q: "Can the stickers be removed or repositioned on my laptop?",
    a: "Yes. The stickers are manufactured on premium archival matte vinyl coated with high-tack, low-residue acrylic adhesive. They hold firmly during daily transport yet peel cleanly without sticky residue if you change laptops.",
  },
  {
    q: "What software do I need to complete the exercises?",
    a: "The course teaches universal vector geometry and print mechanics. Lessons are demonstrated using industry-standard tools (Illustrator, Glyphs, and vector prepress utilities), but every principle applies equally to Affinity Designer or open-source vector tools.",
  },
  {
    q: "Is there a deadline or expiration on the digital lessons?",
    a: "Never. You receive lifetime access to all 8 modules (9 h 20 m), high-definition streaming, downloadable print blueprints, and community forum discussions. You peel your sheet at whatever pace your craft demands.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="py-16 sm:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="font-heading text-xs tracking-widest uppercase text-[#cc2b3f] block mb-1 font-bold">
            Questions &amp; Material Details
          </span>
          <h3 className="font-heading text-2xl sm:text-3xl text-[#1A2540]">
            Frequently asked questions
          </h3>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, index) => (
            <details
              key={index}
              className="group bg-[#f2e9db] rounded-2xl border-[1.5px] border-[#1A2540]/25 p-5 shadow-sm transition-colors open:bg-[#f2e9db]"
            >
              <summary className="font-heading text-base sm:text-lg text-[#1A2540] cursor-pointer list-none flex items-center justify-between gap-4">
                <span>{item.q}</span>
                <span className="font-heading text-lg text-[#cc2b3f] group-open:rotate-45 transition-transform duration-200 shrink-0">
                  +
                </span>
              </summary>
              <p className="font-body text-xs sm:text-sm text-[#1A2540]/80 mt-3 pt-3 border-t border-[#1A2540]/15 leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
