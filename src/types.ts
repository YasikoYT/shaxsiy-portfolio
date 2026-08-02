/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
}

export interface RoadmapStep {
  number: string;
  title: string;
  description: string;
  codeSnippet?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: Date;
}

export interface SkillItem {
  name: string;
  level: number;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  status: string;
}

export interface SiteConfig {
  name: string;
  firstName: string;
  lastName: string;
  age: string;
  location: string;
  email: string;
  telegram?: string;
  github?: string;
  instagram?: string;
  badgeText: string;
  bio: string;
  
  // Announcement Banner
  showBanner?: boolean;
  bannerText?: string;
  
  // Admin security
  adminUsername?: string;
  adminPassword?: string;

  // Stats
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  
  // Goals
  goal1Title: string;
  goal1Desc: string;
  goal2Title: string;
  goal2Desc: string;
  goal3Title: string;
  goal3Desc: string;
  goal4Title: string;
  goal4Desc: string;

  // AI Knowledge
  aiCustomKnowledge: string;

  // Social & Contact details
  phone?: string;
  customQuote?: string;
  footerText?: string;
  skillsFrontend?: string;
  skillsBackend?: string;
  skillsTools?: string;
  autoReplyText?: string;

  // Game Config
  gameMultiplier?: number;
  gameInitialLives?: number;
  gameTitle?: string;

  // Custom Projects List
  customProjects?: Project[];
}
