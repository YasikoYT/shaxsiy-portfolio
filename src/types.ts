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
