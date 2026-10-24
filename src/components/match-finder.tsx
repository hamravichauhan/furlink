"use client";

import { useState } from "react";
import Link from "next/link";

interface PetMatch {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  waitingDays: number;
  matchReason: string;
  imageUrl: string;
}

const SAMPLE_MATCHES: Record<string, PetMatch[]> = {
  calm: [
    {
      id: "demo-pet-misty",
      name: "Misty",
      species: "Cat",
      breed: "Domestic Longhair Mix",
      age: "1 year",
      waitingDays: 142,
      matchReason: "Thrives in quiet apartments. Prefers sitting quietly beside you while you work.",
      imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "demo-pet-rocky",
      name: "Rocky",
      species: "Dog",
      breed: "Senior Pariah",
      age: "4 years",
      waitingDays: 218,
      matchReason: "House-trained, zero bark tendency, content with two gentle strolls a day.",
      imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "demo-pet-rani",
      name: "Rani",
      species: "Dog",
      breed: "Indie Hound Mix",
      age: "3 years",
      waitingDays: 312,
      matchReason: "Gentle soul who needs a calm, patient presence. Unconditionally loyal once settled.",
      imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
    },
  ],
  active: [
    {
      id: "demo-pet-bruno",
      name: "Bruno",
      species: "Dog",
      breed: "Desi Indie Pup",
      age: "5 months",
      waitingDays: 98,
      matchReason: "Loves morning runs, exploring trails, and learning puzzle games.",
      imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "demo-pet-leo",
      name: "Leo",
      species: "Dog",
      breed: "Golden Indie Mix",
      age: "2 years",
      waitingDays: 164,
      matchReason: "Leash-trained, athletic companion who loves outdoor adventures and fetching.",
      imageUrl: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "demo-pet-chotu",
      name: "Chotu",
      species: "Dog",
      breed: "Terrier Indie Mix",
      age: "1.5 years",
      waitingDays: 246,
      matchReason: "High curiosity and sharp intellect. Thrives with structured daily activity.",
      imageUrl: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80",
    },
  ],
};

const QUESTIONS = [
  {
    id: "space",
    label: "Question 1 of 4",
    title: "Tell us about the home where you live.",
    subtitle: "Different animals need different physical space and routines to feel secure.",
    options: [
      { key: "apt", label: "Apartment or flat with a balcony", hint: "Suitability: quiet cats and gentle, calm adult dogs" },
      { key: "house", label: "House with private enclosed yard", hint: "Suitability: open space for playful indie rescue dogs" },
      { key: "farm", label: "Farm, garden property or compound", hint: "Suitability: energetic outdoor companions and guardians" },
      { key: "shared", label: "Shared home or co-living space", hint: "Suitability: social, low-barking and adaptable pets" },
    ],
  },
  {
    id: "routine",
    label: "Question 2 of 4",
    title: "How does your typical weekday look?",
    subtitle: "Understanding your routine helps prevent separation anxiety for the pet.",
    options: [
      { key: "wfh", label: "Work from home or flexible hours", hint: "Someone is present 6+ hours during the day" },
      { key: "office", label: "Regular office hours (away 8 hours)", hint: "Independent adult animals thrive best here" },
      { key: "family", label: "Lively family home with children", hint: "Constant activity, play, and presence" },
      { key: "outdoors", label: "Active outdoor lifestyle", hint: "Looking for an energetic walking or jogging buddy" },
    ],
  },
  {
    id: "tempo",
    label: "Question 3 of 4",
    title: "What pet temperament fits your rhythm best?",
    subtitle: "We prioritize temperament compatibility over appearance every time.",
    options: [
      { key: "calm", label: "Gentle & calm — low demand companion", hint: "Napping nearby while you work, easy peaceful walks" },
      { key: "active", label: "Athletic & playful — loves games and runs", hint: "Daily playtime, exploration, and enthusiastic companionship" },
      { key: "cuddle", label: "Deeply affectionate cuddle bug", hint: "Always curled next to you on the sofa or rug" },
      { key: "independent", label: "Independent and self-reliant", hint: "Quiet cat or mature self-sufficient rescue dog" },
    ],
  },
  {
    id: "experience",
    label: "Question 4 of 4",
    title: "What is your previous experience with pets?",
    subtitle: "First-time pet parents receive full guidance from our adoption counselors.",
    options: [
      { key: "first", label: "First-time pet adopter", hint: "We will pair you with a steady, forgiving companion" },
      { key: "indie", label: "Experienced with indie & rescue breeds", hint: "You understand their intelligence and enduring loyalty" },
      { key: "special", label: "Ready for senior or special medical care", hint: "Willing to give an overlooked animal their forever comfort" },
      { key: "multi", label: "Already have other dogs or cats at home", hint: "We will select verified pack-friendly animals" },
    ],
  },
];

export default function MatchFinder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);

  const handleSelect = (key: string) => {
    const q = QUESTIONS[currentStep];
    const nextAnswers = { ...answers, [q.id]: key };
    setAnswers(nextAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setCompleted(false);
  };

  const matchedPets =
    answers.tempo === "active" ? SAMPLE_MATCHES.active : SAMPLE_MATCHES.calm;

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-soft">
      {!completed ? (
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              {QUESTIONS[currentStep].label}
            </span>
            <div className="flex items-center gap-1.5">
              {QUESTIONS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentStep
                      ? "w-8 bg-emerald-600"
                      : idx < currentStep
                      ? "w-4 bg-slate-800"
                      : "w-4 bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="max-w-2xl">
            <h3 className="font-heading text-2xl sm:text-3xl text-slate-900 font-bold leading-tight">
              {QUESTIONS[currentStep].title}
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              {QUESTIONS[currentStep].subtitle}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {QUESTIONS[currentStep].options.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleSelect(opt.key)}
                className="text-left p-5 rounded-2xl border border-slate-200 bg-slate-50/80 hover:bg-emerald-50/70 hover:border-emerald-400 hover:shadow-xs transition-all duration-200 group cursor-pointer"
              >
                <div className="font-heading text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                  {opt.label}
                </div>
                <div className="text-xs text-slate-500 group-hover:text-emerald-700 mt-1.5 transition-colors">
                  {opt.hint}
                </div>
              </button>
            ))}
          </div>

          {currentStep > 0 && (
            <div className="mt-8 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline underline-offset-4"
              >
                Back to previous question
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results View */
        <div>
          <div className="border-b border-slate-100 pb-5 mb-8 flex items-baseline justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Assessment Complete · 3 Matched Companions
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                Rescue animals that naturally suit your daily life
              </h3>
            </div>
            <button
              type="button"
              onClick={handleRestart}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline underline-offset-4"
            >
              Start over
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {matchedPets.map((pet) => (
              <div
                key={pet.id}
                className="border border-slate-200 rounded-2xl bg-slate-50/60 p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pet.imageUrl}
                      alt={pet.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                      Waiting {pet.waitingDays} days
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-baseline justify-between">
                      <h4 className="font-heading text-xl font-bold text-slate-900">
                        {pet.name}
                      </h4>
                      <span className="text-xs font-medium text-slate-500">
                        {pet.age}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                      {pet.breed}
                    </div>
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed border-t border-slate-200/80 pt-2.5">
                      {pet.matchReason}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/80">
                  <Link
                    href={`/adoptions/${pet.id}`}
                    className="block w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-full text-center shadow-xs transition"
                  >
                    Start adoption for {pet.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
