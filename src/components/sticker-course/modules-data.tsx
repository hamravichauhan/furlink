import React from "react";

export interface CourseModule {
  number: string;
  name: string;
  duration: string;
  minutes: number;
  colorway: "crimson" | "cream"; // crimson = crimson fill with cream print; cream = cream tint with crimson print + 2px crimson ring
  peelDate: string;
  description: string;
  topics: string[];
}

export const MODULES: CourseModule[] = [
  {
    number: "01",
    name: "Foundations of Lettering",
    duration: "55 min",
    minutes: 55,
    colorway: "crimson",
    peelDate: "Oct 12",
    description: "Skeletal proportions, ductus stroke sequence, and optical weight distribution across Roman uppercase forms.",
    topics: ["Pen angle and axis", "Stem stroke weight", "Optical counter balancing"],
  },
  {
    number: "02",
    name: "Spatial Anatomy & Kerning",
    duration: "1 h 15 min",
    minutes: 75,
    colorway: "cream",
    peelDate: "Oct 19",
    description: "Mathematical spacing vs. retinal balance. Building custom kerning matrices for irregular ascender pairings.",
    topics: ["Negative space equilibrium", "Diagonal collision avoidance", "Tabular vs proportional grids"],
  },
  {
    number: "03",
    name: "Vector Beziers & Node Logic",
    duration: "1 h 10 min",
    minutes: 70,
    colorway: "crimson",
    peelDate: "Oct 26",
    description: "Extreme economy of anchor points. Placing extrema nodes and mastering smooth curvature continuity.",
    topics: ["Extrema anchor placement", "Handle angle discipline", "Curvature inflection tangents"],
  },
  {
    number: "04",
    name: "Color Chemistry & Riso Inks",
    duration: "1 h 05 min",
    minutes: 65,
    colorway: "cream",
    peelDate: "Nov 02",
    description: "Spot-color separation, ink absorption on porous stock, and chromatic overprint traps for mechanical reproduction.",
    topics: ["Screen angles and halftoning", "Soy-based pigment load", "Overprint trap registration"],
  },
  {
    number: "05",
    name: "Die-Cutting & Kiss-Cut Tooling",
    duration: "1 h 20 min",
    minutes: 80,
    colorway: "cream",
    peelDate: "Nov 09",
    description: "Translating digital vector paths into steel rule die blueprints, blade bevel angles, and liner release friction.",
    topics: ["Steel rule bending radius", "Liner silicone release ratings", "Corner tear relief geometry"],
  },
  {
    number: "06",
    name: "Multi-Layer Registration",
    duration: "1 h 05 min",
    minutes: 65,
    colorway: "crimson",
    peelDate: "Nov 16",
    description: "Pin-registered plate alignment, paper expansion under humidity, and structural compensation for press skew.",
    topics: ["3-point pin gauge registration", "Paper grain fiber stretch", "Micro-metric registration crosses"],
  },
  {
    number: "07",
    name: "Tactile Finishes & Adhesives",
    duration: "1 h 10 min",
    minutes: 70,
    colorway: "cream",
    peelDate: "Nov 21",
    description: "Permanent acrylic vs. removable adhesive coatings, UV varnishes, micro-embossing, and tactile edge bevels.",
    topics: ["Tack shear adhesive dynamics", "Blind deboss pressure metrics", "Archival face stock durability"],
  },
  {
    number: "08",
    name: "Portfolio & Archival Editioning",
    duration: "1 h 20 min",
    minutes: 80,
    colorway: "crimson",
    peelDate: "Nov 28",
    description: "Numbered limited edition sheets, chop marks, certificates of authenticity, and physical presentation boxes.",
    topics: ["Edition stamping and provenance", "Archival acid-free storage", "Physical portfolio curation"],
  },
];

// Total duration: 55 + 75 + 70 + 65 + 80 + 65 + 70 + 80 = 560 min = 9 h 20 m!

export function ModuleIcon({ id, className = "w-7 h-7" }: { id: string; className?: string }) {
  switch (id) {
    case "01":
      // Calligraphy Nib / Pen tip line mark
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="m12 2 3 5-3 14-3-14 3-5z" />
          <path d="M12 7v7" />
          <circle cx="12" cy="14" r="1" fill="currentColor" />
        </svg>
      );
    case "02":
      // Drafting Calipers / Compass
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="5" r="2" />
          <path d="m10.5 7-6 14" />
          <path d="m13.5 7 6 14" />
          <path d="M7 15h10" />
        </svg>
      );
    case "03":
      // Vector Bezier Curve & Nodes
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="3" y="16" width="4" height="4" rx="0.5" />
          <rect x="17" y="4" width="4" height="4" rx="0.5" />
          <circle cx="12" cy="10" r="1.5" fill="currentColor" />
          <path d="M7 18 C 10 18, 10 6, 17 6" />
          <path d="M7 6l10 12" strokeDasharray="2 2" strokeWidth="1" />
        </svg>
      );
    case "04":
      // Ink Roller / Brayer
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="4" y="4" width="16" height="6" rx="1.5" />
          <path d="M12 10v10" />
          <path d="M8 20h8" />
          <path d="M3 7h1" />
          <path d="M20 7h1" />
        </svg>
      );
    case "05":
      // Die-Cut Contour Blade / Cutter
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 12a8 8 0 0 1 16 0" strokeDasharray="3 2" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    case "06":
      // Printer's Registration Crosshairs
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v20" />
          <path d="M2 12h20" />
        </svg>
      );
    case "07":
      // Tactile Peel / Leaf Corner
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 4h16v10l-6 6H4V4z" />
          <path d="M14 14h6" />
          <path d="M14 14v6" />
          <path d="M14 14l6 6" strokeDasharray="2 2" />
        </svg>
      );
    case "08":
      // Archival Editioning Wax Seal
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="8" />
          <path d="m9 12 2 2 4-4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
        </svg>
      );
    default:
      return null;
  }
}
