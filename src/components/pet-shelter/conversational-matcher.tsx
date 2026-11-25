"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SHELTER_ANIMALS, ShelterAnimal } from "./animals-data";

interface Question {
  id: string;
  question: string;
  subtext: string;
  options: { label: string; desc: string; value: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: "space",
    question: "Where will your companion wake up every morning?",
    subtext: "Help us understand your living space and movement area.",
    options: [
      { label: "Apartment or Studio", desc: "Cozy indoor layout, elevator or stairs", value: "apartment" },
      { label: "House with Balcony", desc: "Medium floor plan with sunlit terraces", value: "house" },
      { label: "Home with Fenced Yard", desc: "Open grass, running perimeter, garden", value: "yard" },
      { label: "Farm or Rural Property", desc: "Wide open acreage, farm animals present", value: "farm" },
    ],
  },
  {
    id: "routine",
    question: "What does your typical weekday look like?",
    subtext: "Different animals thrive on different daily company tempos.",
    options: [
      { label: "Home Most of the Day", desc: "Remote work or family members always home", value: "home_full" },
      { label: "Out 4 to 6 Hours", desc: "Hybrid schedule with midday check-in", value: "hybrid" },
      { label: "Regular 8-Hour Workday", desc: "Quiet during the day, active mornings and evenings", value: "office" },
    ],
  },
  {
    id: "energy",
    question: "What energy level matches your natural rhythm?",
    subtext: "From sofa shadows to mountain hikers.",
    options: [
      { label: "Quiet & Observant", desc: "Prefers gentle lap naps and slow sidewalk strolls", value: "calm" },
      { label: "Balanced & Friendly", desc: "30-minute daily walks, eager for weekend park time", value: "moderate" },
      { label: "Active & Adventurous", desc: "Always ready to run, play fetch, and explore trails", value: "high" },
    ],
  },
  {
    id: "experience",
    question: "What is your previous experience with rescue animals?",
    subtext: "We provide full training and lifetime post-adoption behavioral support.",
    options: [
      { label: "First-Time Adopter", desc: "Ready to learn with a patient, easy-going companion", value: "first_time" },
      { label: "Lifelong Animal Lover", desc: "Comfortable with training and basic healthcare", value: "experienced" },
      { label: "Rescue Champion", desc: "Experienced with shy or medical recovery cases", value: "expert" },
    ],
  },
];

export default function ConversationalMatcher() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [matches, setMatches] = useState<ShelterAnimal[] | null>(null);

  const handleSelect = (qId: string, val: string) => {
    const updated = { ...answers, [qId]: val };
    setAnswers(updated);

    if (step < QUESTIONS.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      let selected: ShelterAnimal[] = [];
      if (updated.space === "apartment" || updated.energy === "calm") {
        selected = [SHELTER_ANIMALS[0], SHELTER_ANIMALS[6], SHELTER_ANIMALS[2]]; // Rani, Queen Sofia, Ringo
      } else if (updated.energy === "high" || updated.space === "yard") {
        selected = [SHELTER_ANIMALS[1], SHELTER_ANIMALS[5], SHELTER_ANIMALS[3]]; // Ms. Milly, Axel, William II
      } else {
        selected = [SHELTER_ANIMALS[2], SHELTER_ANIMALS[4], SHELTER_ANIMALS[7]]; // Ringo, Asher, Bella
      }
      setMatches(selected);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setMatches(null);
  };

  const currentQ = QUESTIONS[step];
  const progressPercent = Math.round(((step + 1) / QUESTIONS.length) * 100);

  return (
    <section id="matcher" className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 bg-[#F8FAF8]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-heading text-xs tracking-widest uppercase text-[#163829] block mb-2 font-bold">
            Interactive Matchmaker
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl text-[#163829] tracking-tight font-black">
            Find your purrrfect match
          </h2>
          <p className="font-body text-sm sm:text-base text-[#163829]/75 mt-3 leading-relaxed">
            Answer a few questions about your lifestyle, preferences, and living situation,
            and let us find the ideal companion for you. Whether you are looking for a playful puppy,
            a cuddly kitten, or a calm adult companion, our matching tool is here to help.
          </p>
        </div>

        {/* The Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-xl">
          {!matches ? (
            <div>
              {/* Progress Line */}
              <div className="flex items-center justify-between text-xs font-heading uppercase tracking-wider text-[#163829]/60 mb-2 font-semibold">
                <span>Step {step + 1} of {QUESTIONS.length}</span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden mb-8">
                <div
                  className="h-full bg-[#163829] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Question Header */}
              <div className="mb-6">
                <h3 className="font-heading text-2xl sm:text-3xl text-[#163829] font-black">
                  {currentQ.question}
                </h3>
                <p className="font-body text-xs sm:text-sm text-[#163829]/70 mt-1">
                  {currentQ.subtext}
                </p>
              </div>

              {/* Tappable Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQ.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(currentQ.id, opt.value)}
                    className="p-5 rounded-2xl border border-gray-200 bg-[#F8FAF8] hover:border-[#163829] hover:bg-white text-left transition-all group flex flex-col justify-between shadow-2xs hover:shadow-md cursor-pointer"
                  >
                    <div>
                      <span className="font-heading text-base sm:text-lg text-[#163829] font-bold block">
                        {opt.label}
                      </span>
                      <span className="font-body text-xs text-[#163829]/65 mt-1 block leading-relaxed">
                        {opt.desc}
                      </span>
                    </div>
                    <span className="font-heading text-xs text-[#163829] mt-3 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Select &rarr;
                    </span>
                  </button>
                ))}
              </div>

              {step > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setStep((prev) => Math.max(0, prev - 1))}
                    className="font-body text-xs text-[#163829]/70 hover:text-[#163829] font-semibold"
                  >
                    &larr; Back to previous question
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Results Screen: 3 Matched Animals */
            <div className="space-y-8">
              <div className="text-center max-w-md mx-auto">
                <span className="font-body text-xs uppercase font-semibold text-[#163829] tracking-wider block mb-1">
                  Pawfect Matches Found
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl text-[#163829] font-black">
                  We found three matching companions
                </h3>
                <p className="font-body text-xs text-[#163829]/70 mt-1">
                  Based on your space and weekday schedule, these animals would integrate smoothly into your home.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {matches.map((animal) => (
                  <div
                    key={animal.id}
                    className="rounded-2xl border border-gray-200 bg-white p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition"
                  >
                    <div>
                      <div
                        className="relative aspect-[4/3] w-full rounded-xl overflow-hidden mb-3 p-1"
                        style={{ backgroundColor: animal.cardBg }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={animal.imageUrl}
                          alt={animal.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute top-2 left-2 bg-black/60 text-white font-body text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                          {animal.species} · {animal.gender}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-heading text-xl text-[#163829] font-black">
                          {animal.name}
                        </span>
                        <span className="text-xs font-semibold text-gray-500">
                          {animal.age}
                        </span>
                      </div>
                      <div className="font-body text-xs text-gray-500 font-medium mt-0.5">
                        {animal.breed}
                      </div>

                      <p className="font-body text-xs text-[#163829]/75 mt-2 line-clamp-3 leading-relaxed">
                        {animal.oneLiner}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <Link
                        href="/adoptions"
                        className="btn-paw-primary w-full block py-2.5 text-center text-xs font-semibold tracking-wider"
                      >
                        Start Adoption
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="font-body text-xs text-[#163829] hover:underline font-semibold cursor-pointer"
                >
                  Restart Matcher Questions
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
