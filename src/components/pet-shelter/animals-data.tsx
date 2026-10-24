import React from "react";

export interface ShelterAnimal {
  id: string;
  number: string;
  name: string;
  species: "Dog" | "Cat";
  breed: string;
  age: string;
  gender: "Male" | "Female";
  daysWaiting: number;
  oneLiner: string;
  colorway: "crimson" | "cream";
  imageUrl: string;
  caseRef: string;
  isUrgent?: boolean;
  medicalStatus: string;
  personality: string[];
  goodWith: string[];
}

export const SHELTER_ANIMALS: ShelterAnimal[] = [
  {
    id: "pet-rani",
    number: "01",
    name: "Rani",
    species: "Dog",
    breed: "Indie Pariah",
    age: "3 years",
    gender: "Female",
    daysWaiting: 312,
    oneLiner: "Gentle shadow who walks with a healed paw and loves quiet morning tea.",
    colorway: "crimson",
    imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
    caseRef: "CASE #B-0118",
    isUrgent: true,
    medicalStatus: "Sterilized (TNVR), fully vaccinated (7-in-1), right hind paw healed after splint.",
    personality: ["Extremely calm", "House-trained", "Observer rather than barker"],
    goodWith: ["Calm seniors", "Apartment living", "Gentle cats"],
  },
  {
    id: "pet-chotu",
    number: "02",
    name: "Chotu",
    species: "Dog",
    breed: "Terrier Indie Mix",
    age: "2 years",
    gender: "Male",
    daysWaiting: 246,
    oneLiner: "Rescued from a storm drain at 4 weeks. An observant, attentive listener.",
    colorway: "cream",
    imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
    caseRef: "CASE #B-0142",
    medicalStatus: "Sterilized, dewormed, anti-rabies certified, zero health conditions.",
    personality: ["Alert & curious", "Master of eye contact", "Food-motivated learner"],
    goodWith: ["Active families", "Other dogs", "Daily park walks"],
  },
  {
    id: "pet-tara",
    number: "03",
    name: "Tara",
    species: "Dog",
    breed: "Indie Pup",
    age: "1 year",
    gender: "Female",
    daysWaiting: 189,
    oneLiner: "Warm-hearted pup who greets every volunteer by resting her chin on your shoes.",
    colorway: "crimson",
    imageUrl: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80",
    caseRef: "CASE #B-0201",
    medicalStatus: "Sterilization scheduled this week, core puppy booster shots completed.",
    personality: ["Affectionate cuddle bug", "Playful spirit", "Eager to please"],
    goodWith: ["First-time adopters", "Children", "Yard or apartment"],
  },
  {
    id: "pet-bruno",
    number: "04",
    name: "Bruno",
    species: "Dog",
    breed: "Indie Shepherd Mix",
    age: "2.5 years",
    gender: "Male",
    daysWaiting: 142,
    oneLiner: "Quiet guardian who sits next to the clinic gate and watches over injured puppies.",
    colorway: "cream",
    imageUrl: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80",
    caseRef: "CASE #B-0239",
    medicalStatus: "Complete orthopedic clearance, sterilized, microchipped.",
    personality: ["Protective & patient", "Low-bark demeanor", "Leash champion"],
    goodWith: ["Quiet households", "Older children", "Solo pet home"],
  },
  {
    id: "pet-sheru",
    number: "05",
    name: "Sheru",
    species: "Dog",
    breed: "Belagavi Indie",
    age: "3 years",
    gender: "Male",
    daysWaiting: 98,
    oneLiner: "Hit-and-run survivor currently completing final physiotherapy with high spirits.",
    colorway: "cream",
    imageUrl: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80",
    caseRef: "CASE #B-0408",
    medicalStatus: "Pins removed from hind femur, weight-bearing rehabilitation in progress.",
    personality: ["Resilient fighter", "Enthusiastic tail-wagger", "Deeply loyal"],
    goodWith: ["Patient adopters", "Ground-floor homes", "Loving companions"],
  },
  {
    id: "pet-misty",
    number: "06",
    name: "Misty",
    species: "Cat",
    breed: "Domestic Longhair Mix",
    age: "1.5 years",
    gender: "Female",
    daysWaiting: 74,
    oneLiner: "Calm window-watcher with silk fur who purrs the moment anyone enters the room.",
    colorway: "crimson",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    caseRef: "CASE #B-0488",
    medicalStatus: "Spayed, feline leukemia negative, flea/tick cleared.",
    personality: ["Gentle purr machine", "Independent napper", "Lap-lover"],
    goodWith: ["Sunny apartments", "Quiet individuals", "Gentle indoor space"],
  },
  {
    id: "pet-leo",
    number: "07",
    name: "Leo",
    species: "Dog",
    breed: "Golden Indie Mix",
    age: "2 years",
    gender: "Male",
    daysWaiting: 54,
    oneLiner: "Joyful sunbeam rescued near Khanapur road. Loves fetch and gentle head pats.",
    colorway: "cream",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
    caseRef: "CASE #B-0512",
    medicalStatus: "Neutered, vaccinated, full dental clean, healthy energetic appetite.",
    personality: ["Upbeat optimist", "Social with dogs", "Always smiling"],
    goodWith: ["Active runners", "Multi-dog homes", "Fenced yards"],
  },
  {
    id: "pet-bella",
    number: "08",
    name: "Bella",
    species: "Cat",
    breed: "Indie Calico",
    age: "1 year",
    gender: "Female",
    daysWaiting: 38,
    oneLiner: "Playful acrobat rescued from a spice warehouse. Will investigate every shoelace.",
    colorway: "crimson",
    imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80",
    caseRef: "CASE #B-0544",
    medicalStatus: "Spayed, fully vaccinated, indoor litter box certified.",
    personality: ["Playful explorer", "Feather-toy master", "Sweet chirper"],
    goodWith: ["Apartments", "Cat lovers", "Interactive playtime"],
  },
];

export interface AdoptedAlumni {
  number: string;
  name: string;
  species: string;
  breed: string;
  colorway: "crimson" | "cream";
  adoptionDate: string;
  city: string;
  familyQuote: string;
  imageUrl: string;
}

export const ADOPTED_ALUMNI: AdoptedAlumni[] = [
  {
    number: "01",
    name: "Rocky",
    species: "Dog",
    breed: "Senior Pariah",
    colorway: "crimson",
    adoptionDate: "Oct 12",
    city: "Mumbai",
    familyQuote: "He sleeps at the foot of our bed every single night like an old guardian angel.",
    imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80",
  },
  {
    number: "02",
    name: "Kaju",
    species: "Dog",
    breed: "Indie Terrier Mix",
    colorway: "cream",
    adoptionDate: "Oct 19",
    city: "Pune",
    familyQuote: "The happiest, most loyal family member we could have ever wished for.",
    imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80",
  },
  {
    number: "03",
    name: "Simba",
    species: "Cat",
    breed: "Ginger Indie",
    colorway: "crimson",
    adoptionDate: "Oct 26",
    city: "Bangalore",
    familyQuote: "Found him through the emergency board. He rules our sunny balcony now.",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
  },
  {
    number: "04",
    name: "Moti",
    species: "Dog",
    breed: "White Indie Hound",
    colorway: "cream",
    adoptionDate: "Nov 02",
    city: "Belagavi",
    familyQuote: "From roadside fractures to running on the farm every morning.",
    imageUrl: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=400&q=80",
  },
  {
    number: "05",
    name: "Maya",
    species: "Cat",
    breed: "Calico Feline",
    colorway: "cream",
    adoptionDate: "Nov 09",
    city: "Goa",
    familyQuote: "She healed our entire home after a painful year. We love her endlessly.",
    imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80",
  },
  {
    number: "06",
    name: "Tiger",
    species: "Dog",
    breed: "Indie Mastiff Mix",
    colorway: "crimson",
    adoptionDate: "Nov 16",
    city: "Kolhapur",
    familyQuote: "A gentle giant who gently nudges our hands whenever we sit on the sofa.",
    imageUrl: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=400&q=80",
  },
  {
    number: "07",
    name: "Gauri",
    species: "Dog",
    breed: "Desi Indie Pup",
    colorway: "cream",
    adoptionDate: "Nov 21",
    city: "Hubli",
    familyQuote: "She went from 4 weeks in an ambulance crate to the center of our lives.",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80",
  },
  {
    number: "08",
    name: "Shadow",
    species: "Cat",
    breed: "Bombay Indie",
    colorway: "crimson",
    adoptionDate: "Nov 28",
    city: "Dharwad",
    familyQuote: "Sleek, affectionate, and never leaves my side while I work at my desk.",
    imageUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=400&q=80",
  },
];

export function AnimalLineIcon({
  species,
  className = "w-6 h-6",
}: {
  species: "Dog" | "Cat" | string;
  className?: string;
}) {
  if (species === "Cat") {
    // Elegant Cat Line Mark
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M12 5c-4 0-7 2.5-7 6.5 0 5 4 8.5 7 8.5s7-3.5 7-8.5C19 7.5 16 5 12 5z" />
        <path d="m6 8-2-5 5 2" />
        <path d="m18 8 2-5-5 2" />
        <circle cx="9.5" cy="11.5" r="1" fill="currentColor" />
        <circle cx="14.5" cy="11.5" r="1" fill="currentColor" />
        <path d="m12 14.5-.8 1h1.6z" fill="currentColor" />
        <path d="M8 15h-3" />
        <path d="M16 15h3" />
      </svg>
    );
  }

  // Loyal Indie Dog Line Mark
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 5.5 C10 4, 14 4, 14 5.5 C14 8, 10 8, 10 5.5 z" />
      <path d="M8 7 L4 11 C3 12, 3 14, 5 14 L7 13" />
      <path d="M16 7 L20 11 C21 12, 21 14, 19 14 L17 13" />
      <path d="M7 10 C7 16, 17 16, 17 10" />
      <path d="M9 16 C9 19, 15 19, 15 16" />
      <circle cx="9.5" cy="11.5" r="1" fill="currentColor" />
      <circle cx="14.5" cy="11.5" r="1" fill="currentColor" />
      <path d="m12 14-.8.8h1.6z" fill="currentColor" />
      <path d="M12 14.8v1.5" />
    </svg>
  );
}
