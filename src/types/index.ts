export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Frontend' | 'Mobile' | 'UI/UX' | 'Graphics';
  technologies: string[];
  live_url?: string;
  github_url?: string;
  thumbnail_url?: string;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  order_index: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  image_url?: string;
  rating: number;
  featured: boolean;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  percentage: number;
  order_index: number;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
}