export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'ADMIN' | 'EDITOR';
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  category: 'WEB' | 'APP' | '3D' | 'UI/UX' | 'SYSTEM';
  technologies: string[];
  thumbnail: string;
  gallery: string[];
  challenge: string;
  solution: string;
  features: string[];
  results: string;
  demoUrl?: string;
  sourceUrl?: string;
  year: string;
  featured: boolean;
  published: boolean;
  views: number;
  order: number;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'UI/UX' | 'DevOps' | 'Security' | '3D / Creative';
  level: number; // 0 - 100
  iconName: string;
  order: number;
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  iconName: string;
  order: number;
}

export interface Experience {
  id: string;
  year: string;
  role: string;
  company: string;
  location?: string;
  description: string;
  order: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';
  createdAt: string;
  ipHash?: string;
}

export interface SocialLink {
  id: string;
  platform: 'GitHub' | 'LinkedIn' | 'X' | 'Instagram' | 'Discord' | 'YouTube';
  url: string;
  username: string;
  order: number;
}

export interface SiteSetting {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  availableForWork: boolean;
  statusText: string;
  yearsExperience: string;
  completedProjects: string;
  techCount: string;
  passionRate: string;
  contactEmail: string;
  avatarUrl: string;
}

export interface VisitorMetric {
  id: string;
  timestamp: string;
  path: string;
  referrer?: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
}

export interface DatabaseSchema {
  users: User[];
  projects: Project[];
  skills: Skill[];
  services: Service[];
  experiences: Experience[];
  messages: Message[];
  socialLinks: SocialLink[];
  settings: SiteSetting;
  visitors: VisitorMetric[];
}
