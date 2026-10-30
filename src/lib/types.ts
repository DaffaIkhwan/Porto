export interface Profile {
  name: string;
  headline: string;
  availability: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  monogram: string;
  photo_url: string;
  resume_url: string;
}

export interface AboutHighlight {
  id: string;
  title: string;
  description: string;
}

export interface About {
  pull_quote: string;
  pillars: string[];
  highlights: AboutHighlight[];
}

export interface ExperienceItem {
  id: string;
  org: string;
  role: string;
  period: string;
  location: string;
  photos: string[];
  bullets: string[];
  tags: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
  gpa: string;
  honors: string;
  photo_url: string;
  details: string[];
}

export interface Publication {
  id: string;
  title: string;
  venue: string;
  year: string;
  index_label: string;
  url: string;
  photo_url: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  url: string;
  photo_url: string;
}

export interface ActivityItem {
  id: string;
  role: string;
  org: string;
  period: string;
  photos: string[];
  bullets: string[];
}

export interface Message {
  id?: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export interface PhotoOut {
  id: string;
  url: string;
  filename?: string;
  size?: number;
}

export interface TranslationStatus {
  status?: string;
  running?: boolean;
  translated?: number;
  total?: number;
  last_error?: string | null;
  updated_at?: string;
}

export interface Portfolio {
  id: string;
  profile: Profile;
  about: About;
  experiences: ExperienceItem[];
  education: EducationItem[];
  publications: Publication[];
  skill_groups: SkillGroup[];
  certifications: Certification[];
  activities: ActivityItem[];
}
