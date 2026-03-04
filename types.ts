
export interface Member {
  id: string;
  name: string;
  phone: string;
  role: string;
  image: string;
}

export interface UserMessage {
  id: string;
  fullName: string;
  mobileNumber: string;
  message: string;
  timestamp: string;
  reply?: string;
}

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR';

export interface AdminUser {
  id: string;
  username: string;
  password?: string;
  role: AdminRole;
  name: string;
  notes?: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AdminActivity {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface SiteStats {
  viewCount: number;
  messageCount: number;
}

export interface RoverSection {
  title: string;
  description: string;
  image: string;
}

export interface AboutContent {
  sectionTitle: string;
  heading: string;
  description: string;
  history: string;
  mission: string;
  vision: string;
}

export interface SiteIdentity {
  brandName: string;
  footerBrandName: string;
  footerDescription: string;
}
