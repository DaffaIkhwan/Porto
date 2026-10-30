// Minimal offline fallback so the portfolio page renders a real (if reduced) page on the
// static preview CDN, where every /api call rejects. Mirrors the Portfolio shape.
import type { Portfolio } from "./types";

export const FALLBACK_PORTFOLIO: Portfolio = {
  id: "fallback",
  profile: {
    name: "Nur Delifah",
    headline: "Informatics Engineering Graduate — Data Analysis & Machine Learning",
    availability: "Open to administrative, operational, and project-based roles",
    summary:
      "Informatics Engineering graduate (Cum Laude, GPA 3.64/4.00) experienced in machine learning research, data processing and analysis, and administrative management.",
    email: "ndelifaaa@gmail.com",
    phone: "+62 82285393727",
    location: "Pekanbaru, Riau — Open to Relocate",
    monogram: "ND",
    photo_url: "",
    resume_url: "/cv-nur-delifah.pdf",
  },
  about: { pull_quote: "", pillars: [], highlights: [] },
  experiences: [],
  education: [],
  publications: [],
  skill_groups: [],
  certifications: [],
  activities: [],
};
