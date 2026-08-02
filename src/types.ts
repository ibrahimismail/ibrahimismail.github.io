export interface ExperienceSubsection {
  title: string;
  items: string[];
}

export interface ExperienceDates {
  startMonth: number;
  startYear: number;
  endMonth?: number | null;
  endYear?: number | null;
}

export interface Experience {
  company: string;
  role: string;
  dates: ExperienceDates;
  location: string;
  summary?: string;
  description?: string[];
  subsections?: ExperienceSubsection[];
}

export interface Education {
  school: string;
  degree: string;
  location: string;
  period?: string;
  gpa?: string;
}

export interface Skill {
  name: string;
  icon: string;
}

export interface FounderVenture {
  name: string;
  role: string;
  tagline: string;
  url: string;
  logo: string;
  description: string[];
  ctaLabel: string;
}

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}
