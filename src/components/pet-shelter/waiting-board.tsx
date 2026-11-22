"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SHELTER_ANIMALS, ShelterAnimal } from "./animals-data";

export default function WaitingBoard() {
  const [selectedAnimal, setSelectedAnimal] = useState<ShelterAnimal | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"All" | "Dog" | "Cat">("All");
  const [selectedAge, setSelectedAge] = useState<string>("All");

  const filteredAnimals = useMemo(() => {
    return SHELTER_ANIMALS.filter((animal) => {
      const matchesSearch =
        animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.breed.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === "All" || animal.species === selectedType;

      const matchesAge =
        selectedAge === "All" ||
        (selectedAge === "Puppy/Kitten" && animal.age.includes("1 year")) ||
        (selectedAge === "Adult" && (animal.age.includes("2 years") || animal.age.includes("3 years")));

      return matchesSearch && matchesType && matchesAge;
    });
  }, [searchQuery, selectedType, selectedAge]);

  return (
    <section id="adoptable-pets" className="py-12 sm:py-20 px-4 sm:px-6 md:px-8 bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header & Search / Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl text-[#163829] tracking-tight font-black">
              Adoptable Pets
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#163829]/65 mt-1">
              Find your next companion from our certified no-kill sanctuary.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[220px] sm:min-w-[260px]">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search for Pets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-full bg-white border border-gray-200 focus:outline-none focus:border-[#163829] text-[#163829] placeholder-gray-400 transition shadow-2xs"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as "All" | "Dog" | "Cat")}
              className="px-3.5 py-2 text-xs sm:text-sm rounded-full bg-white border border-gray-200 text-[#163829] focus:outline-none focus:border-[#163829] transition cursor-pointer shadow-2xs font-medium"
            >
              <option value="All">Type ▾</option>
              <option value="Dog">Dogs</option>
              <option value="Cat">Cats</option>
            </select>

            {/* Age Filter */}
            <select
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              className="px-3.5 py-2 text-xs sm:text-sm rounded-full bg-white border border-gray-200 text-[#163829] focus:outline-none focus:border-[#163829] transition cursor-pointer shadow-2xs font-medium"
            >
              <option value="All">Age ▾</option>
              <option value="Puppy/Kitten">1 Year & Under</option>
              <option value="Adult">2 - 3 Years</option>
            </select>

            {/* See All Link */}
            <Link
              href="/adoptions"
              className="text-xs sm:text-sm font-semibold text-[#163829] hover:underline flex items-center gap-1 ml-auto md:ml-2"
            >
              <span>See All</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* 4-Column Vibrant Pet Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredAnimals.map((animal) => {
            return (
              <div
                key={animal.id}
                onClick={() => setSelectedAnimal(animal)}
                className="group relative cursor-pointer"
              >
                {/* Colorful Rounded Card with Vibrant Solid / Pastel Background */}
                <div
                  className="relative aspect-[3/4] sm:aspect-[4/5] rounded-[24px] overflow-hidden p-3 flex flex-col justify-between transition-transform duration-300 group-hover:-translate-y-1.5 shadow-sm group-hover:shadow-lg"
                  style={{ backgroundColor: animal.cardBg }}
                >
                  {/* Urgent / Days Badge (Subtle top pill) */}
                  <div className="flex justify-between items-center z-10">
                    <span className="bg-white/80 backdrop-blur-xs text-[#163829] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                      {animal.species}
                    </span>
                    <span className="bg-black/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {animal.daysWaiting}d waiting
                    </span>
                  </div>

                  {/* Animal Image */}
                  <div className="absolute inset-x-2 top-8 bottom-16 sm:bottom-18 flex items-center justify-center overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={animal.imageUrl}
                      alt={animal.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl"
                    />
                  </div>

                  {/* Floating White Bottom Card Overlay (Exact Match to Screenshot) */}
                  <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 shadow-md border border-black/5 text-left">
                    <h3 className="font-heading text-sm sm:text-base font-black text-[#163829] leading-tight truncate">
                      {animal.name}
                    </h3>
                    <div className="text-[11px] sm:text-xs text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
                      <span>{animal.gender === "Male" ? "♂" : "♀"} {animal.gender}</span>
                      <span>·</span>
                      <span>{animal.age}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAnimals.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 mt-6">
            <p className="text-sm font-semibold text-gray-500">
              No adoptable pets matched your search filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedType("All");
                setSelectedAge("All");
              }}
              className="mt-3 text-xs font-bold text-[#163829] underline"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* Modal: Full Animal Inspection Dossier */}
        {selectedAnimal && (
          <div
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedAnimal(null)}
          >
            <div
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gray-200 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-gray-100 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-heading text-xl font-bold text-white shrink-0"
                    style={{ backgroundColor: selectedAnimal.cardBg }}
                  >
                    {selectedAnimal.gender === "Male" ? "♂" : "♀"}
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl text-[#163829] font-black leading-tight">
                      {selectedAnimal.name}
                    </h3>
                    <div className="font-body text-xs text-gray-500 font-medium mt-0.5">
                      {selectedAnimal.breed} · {selectedAnimal.age} · Waiting {selectedAnimal.daysWaiting} days
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAnimal(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold hover:bg-gray-200 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Photo */}
              <div
                className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-4 p-2"
                style={{ backgroundColor: selectedAnimal.cardBg }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedAnimal.imageUrl}
                  alt={selectedAnimal.name}
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[#163829] font-body text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {selectedAnimal.caseRef}
                </div>
              </div>

              {/* Quote */}
              <p className="font-body text-sm text-[#163829]/90 italic mb-4 bg-[#F8FAF8] p-3 rounded-xl border border-gray-100">
                &ldquo;{selectedAnimal.oneLiner}&rdquo;
              </p>

              {/* Medical Record */}
              <div className="bg-[#D8F3DC]/40 p-3.5 rounded-2xl border border-[#D8F3DC] mb-4">
                <span className="font-heading text-xs uppercase tracking-wider text-[#163829] font-bold block mb-1">
                  Health &amp; Clinical Certification
                </span>
                <p className="font-body text-xs text-[#163829]/80 leading-relaxed">
                  {selectedAnimal.medicalStatus}
                </p>
              </div>

              {/* Personality */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[#F8FAF8] p-3 rounded-xl border border-gray-100">
                  <span className="font-heading text-[11px] uppercase tracking-wider text-[#163829] font-bold block mb-1">
                    Temperament
                  </span>
                  <ul className="space-y-1 font-body text-[11px] text-gray-600">
                    {selectedAnimal.personality.map((p, i) => (
                      <li key={i}>• {p}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#F8FAF8] p-3 rounded-xl border border-gray-100">
                  <span className="font-heading text-[11px] uppercase tracking-wider text-[#163829] font-bold block mb-1">
                    Ideal Home
                  </span>
                  <ul className="space-y-1 font-body text-[11px] text-gray-600">
                    {selectedAnimal.goodWith.map((g, i) => (
                      <li key={i}>• {g}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/adoptions"
                  onClick={() => setSelectedAnimal(null)}
                  className="flex-1 btn-paw-primary py-3 text-center text-xs sm:text-sm font-semibold tracking-wide"
                >
                  Start Adoption for {selectedAnimal.name}
                </Link>
                <Link
                  href={`/donate?pet=${encodeURIComponent(selectedAnimal.name)}&amount=450`}
                  onClick={() => setSelectedAnimal(null)}
                  className="px-5 py-3 rounded-full border border-gray-300 font-body text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 text-center transition"
                >
                  Sponsor Meal (₹450)
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
