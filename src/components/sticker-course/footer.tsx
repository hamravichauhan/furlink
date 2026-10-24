import React from "react";
import Link from "next/link";

export default function StickerFooter() {
  return (
    <footer className="w-full bg-[#f2e9db] text-[#1A2540] border-t-[1.5px] border-[#1A2540]/25 py-10 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-[1.5px] border-[#1A2540] flex items-center justify-center text-[10px] font-heading font-bold bg-[#cc2b3f] text-[#f2e9db]">
            S
          </div>
          <span className="font-heading text-sm text-[#1A2540] font-bold">
            Stickercraft Press &amp; Publishing
          </span>
          <span className="font-body text-xs text-[#1A2540]/50">
            · Printed in edition
          </span>
        </div>

        <div className="flex items-center gap-6 font-body text-xs text-[#1A2540]/70">
          <Link href="#curriculum" className="hover:text-[#cc2b3f] transition-colors">
            Curriculum
          </Link>
          <Link href="#enroll" className="hover:text-[#cc2b3f] transition-colors">
            Shipping &amp; Delivery
          </Link>
          <Link href="#faq" className="hover:text-[#cc2b3f] transition-colors">
            Course FAQs
          </Link>
          <span>·</span>
          <span>© 2026 Stickercraft</span>
        </div>
      </div>
    </footer>
  );
}
