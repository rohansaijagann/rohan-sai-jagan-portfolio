export type SectionId =
  | 'home'
  | 'about'
  | 'after-hours'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'resume'
  | 'contact';

export type FileId =
  | 'home.tsx'
  | 'about.html'
  | 'after-hours.md'
  | 'projects.js'
  | 'skills.json'
  | 'experience.ts'
  | 'resume.pdf'
  | 'contact';

export interface FileItem {
  id: string;
  name: string;
  path: string;
  icon: string;
  language: string;
  accent: string;
}

export interface Project {
  id: string;
  index: string;
  title: string;
  year: string;
  description: string;
  before: string;
  after: string;
  result: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  category: 'AI / ML' | 'Full-Stack';
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
  technologies: string[];
}

export type ThemeId = 'dark-plus' | 'tokyo-night' | 'dracula' | 'monokai';

export interface PeekItem {
  name: string;
  signature: string;
  description: string;
  category?: string;
  projects: { id: string; name: string }[];
}
