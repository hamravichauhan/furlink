"use client";

import React from "react";
import Link from "next/link";

interface GuideCard {
  id: string;
  tag: string;
  title: string;
  description: string;
  readTime: string;
  bgColor: string;
  tagBg: string;
  tagColor: string;
  href: string;
}

const GUIDES: GuideCard[] = [
  {
    id: "guide-1",
    tag: "Article",
    title: "Top 10 Tips for First-Time Dog Owners",
    description:
      "A comprehensive guide to help you navigate the early days of pet ownership, from puppy-proofing to positive reinforcement routines.",
    readTime: "5 min read",
    bgColor: "#ECEEFD", // Soft lavender
    tagBg: "#DCE1FB",
    tagColor: "#4F5BD5",
    href: "/stories",
  },
  {
    id: "guide-2",
    tag: "Care Guide",
    title: "Cat Wellness & Home Enrichment Essentials",
    description:
      "Learn how to create stress-free vertical territory, select safe scratching posts, and encourage natural feline play habits indoors.",
    readTime: "4 min read",
    bgColor: "#E8F5E9", // Soft mint
    tagBg: "#C8E6C9",
    tagColor: "#1B5E20",
    href: "/stories",
  },
  {
    id: "guide-3",
    tag: "Medical FAQ",
    title: "Understanding Sterilization & Post-Op Recovery",
    description:
      "Everything you need to know about humane TNVR spay/neuter recovery, wound aftercare, and keeping your pet comfortable.",
    readTime: "6 min read",
    bgColor: "#FFF3E0", // Soft peach
    tagBg: "#FFE0B2",
    tagColor: "#E65100",
    href: "/sterilization",
  },
];

export default function CareGuides() {
  return (
    <section id="care-guides" className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 bg-[#F8FAF8] border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Heading, description & CTA */}
          <div className="lg:col-span-5 space-y-5">
            <h2 className="font-heading text-3xl sm:text-4xl text-[#163829] tracking-tight font-black leading-tight">
              Caring for Your New Best Friend
            </h2>
            <p className="font-body text-sm sm:text-base text-[#163829]/75 leading-relaxed">
              Welcoming a pet into your life is a joyful experience, but it also comes with responsibilities.
              Whether you are a first-time pet owner or a seasoned pet parent, ensuring your furry friend&apos;s
              health and happiness requires the right knowledge and compassionate care.
            </p>
            <div className="pt-2">
              <Link
                href="/stories"
                className="btn-paw-primary px-6 py-3 text-xs sm:text-sm font-semibold inline-flex items-center gap-2"
              >
                <span>View More Resources</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Pastel Resource Guide Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {GUIDES.map((guide) => (
              <Link
                key={guide.id}
                href={guide.href}
                className="group p-5 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md border border-black/5"
                style={{ backgroundColor: guide.bgColor }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: guide.tagBg, color: guide.tagColor }}
                    >
                      {guide.tag}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {guide.readTime}
                    </span>
                  </div>

                  <h3 className="font-heading text-base font-bold text-[#163829] leading-snug group-hover:text-black transition">
                    {guide.title}
                  </h3>

                  <p className="font-body text-xs text-[#163829]/70 mt-2.5 leading-relaxed line-clamp-3">
                    {guide.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-semibold text-[#163829]">
                  <span>Read article</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
