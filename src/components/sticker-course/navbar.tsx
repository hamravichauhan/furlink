import Link from "next/link";

export default function StickerNavbar() {
  return (
    <header className="sticky top-0 z-40 bg-[#f3c9d5]/95 backdrop-blur-xs border-b-[1.5px] border-[#1A2540]/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-4 h-4 rounded-full bg-[#cc2b3f] border-[1.5px] border-[#1A2540] inline-block shrink-0" />
          <span className="font-heading text-xl sm:text-2xl text-[#1A2540] tracking-tight">
            Stickercraft
          </span>
          <span className="hidden sm:inline-block font-body text-xs text-[#1A2540]/60 ml-2 border-l-[1.5px] border-[#1A2540]/30 pl-2">
            The Kiss-Cut Curriculum
          </span>
        </Link>

        {/* Right CTA */}
        <a
          href="#enroll"
          className="btn-enroll-pill px-5 sm:px-6 py-2.5 text-xs sm:text-sm shadow-sm"
        >
          ENROLL &amp; GET YOUR SHEET
        </a>
      </div>
    </header>
  );
}
