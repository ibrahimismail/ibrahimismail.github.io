export interface ExperienceSubsection {
  title: string;
  items: string[];
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
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

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}
