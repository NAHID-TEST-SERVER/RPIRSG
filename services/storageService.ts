
import { UserMessage, SiteStats, AboutContent, Member, RoverSection, AdminUser, AdminActivity } from '../types';
import { ROVER_INFO, ADMIN_CREDENTIALS } from '../constants';

const MESSAGES_KEY = 'rover_org_messages';
const STATS_KEY = 'rover_org_stats';
const LOGO_KEY = 'rover_org_logo';
const BANNERS_KEY = 'rover_org_banners';
const ABOUT_IMAGE_KEY = 'rover_org_about_image';
const ABOUT_CONTENT_KEY = 'rover_org_about_content';
const MEMBERS_KEY = 'rover_org_members';
const ROVER_INFO_KEY = 'rover_org_info_sections';
const ADMINS_KEY = 'rover_org_accounts';
const LOGS_KEY = 'rover_org_activity_logs';

const DEFAULT_ABOUT_CONTENT: AboutContent = {
  sectionTitle: 'Our Story',
  heading: 'Core Commitment',
  description: 'Building character and leadership for decades through service.',
  history: '50+ years of youth leadership.',
  mission: 'Educating through value-based Scouts.',
  vision: 'A global network of empowered scouts.'
};

const DEFAULT_MEMBERS: Member[] = [
  { id: '1', name: 'John Doe', phone: '+1 234 567 890', role: 'Rover Scout Leader', image: 'https://picsum.photos/seed/member1/200' },
  { id: '2', name: 'Jane Smith', phone: '+1 234 567 891', role: 'Assistant Leader', image: 'https://picsum.photos/seed/member2/200' },
  { id: '3', name: 'Michael Brown', phone: '+1 234 567 892', role: 'Quartermaster', image: 'https://picsum.photos/seed/member3/200' },
  { id: '4', name: 'Sarah Wilson', phone: '+1 234 567 893', role: 'Scribe', image: 'https://picsum.photos/seed/member4/200' },
  { id: '5', name: 'Robert Johnson', phone: '+1 234 567 894', role: 'Treasurer', image: 'https://picsum.photos/seed/member5/200' },
  { id: '6', name: 'Emily Davis', phone: '+1 234 567 895', role: 'Activity Coordinator', image: 'https://picsum.photos/seed/member6/200' }
];

export const storageService = {
  getMessages: (): UserMessage[] => {
    const data = localStorage.getItem(MESSAGES_KEY);
    return data ? JSON.parse(data) : [];
  },

  addMessage: (message: Omit<UserMessage, 'id' | 'timestamp'>): void => {
    const messages = storageService.getMessages();
    const newMessage: UserMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleString()
    };
    localStorage.setItem(MESSAGES_KEY, JSON.stringify([newMessage, ...messages]));
    storageService.incrementMessageCount();
  },

  updateMessageReply: (id: string, reply: string): void => {
    const messages = storageService.getMessages();
    const updatedMessages = messages.map(m => 
      m.id === id ? { ...m, reply } : m
    );
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
  },

  deleteMessage: (id: string): void => {
    const messages = storageService.getMessages();
    const filtered = messages.filter(m => m.id !== id);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(filtered));
  },

  getStats: (): SiteStats => {
    const data = localStorage.getItem(STATS_KEY);
    return data ? JSON.parse(data) : { viewCount: 0, messageCount: 0 };
  },

  incrementViewCount: (): void => {
    const stats = storageService.getStats();
    stats.viewCount += 1;
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  },

  incrementMessageCount: (): void => {
    const stats = storageService.getStats();
    stats.messageCount += 1;
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  },

  resetStats: (): void => {
    localStorage.setItem(STATS_KEY, JSON.stringify({ viewCount: 0, messageCount: 0 }));
  },

  getLogo: (): string | null => {
    return localStorage.getItem(LOGO_KEY);
  },

  setLogo: (base64: string): void => {
    localStorage.setItem(LOGO_KEY, base64);
  },

  removeLogo: (): void => {
    localStorage.removeItem(LOGO_KEY);
  },

  getBanners: (): string[] | null => {
    const data = localStorage.getItem(BANNERS_KEY);
    return data ? JSON.parse(data) : null;
  },

  setBanners: (banners: string[]): void => {
    localStorage.setItem(BANNERS_KEY, JSON.stringify(banners));
  },

  getAboutImage: (): string | null => {
    return localStorage.getItem(ABOUT_IMAGE_KEY);
  },

  setAboutImage: (base64: string): void => {
    localStorage.setItem(ABOUT_IMAGE_KEY, base64);
  },

  removeAboutImage: (): void => {
    localStorage.removeItem(ABOUT_IMAGE_KEY);
  },

  getAboutContent: (): AboutContent => {
    const data = localStorage.getItem(ABOUT_CONTENT_KEY);
    return data ? JSON.parse(data) : DEFAULT_ABOUT_CONTENT;
  },

  setAboutContent: (content: AboutContent): void => {
    localStorage.setItem(ABOUT_CONTENT_KEY, JSON.stringify(content));
  },

  getMembers: (): Member[] => {
    const data = localStorage.getItem(MEMBERS_KEY);
    return data ? JSON.parse(data) : DEFAULT_MEMBERS;
  },

  setMembers: (members: Member[]): void => {
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
  },

  getRoverInfo: (): RoverSection[] => {
    const data = localStorage.getItem(ROVER_INFO_KEY);
    return data ? JSON.parse(data) : ROVER_INFO;
  },

  setRoverInfo: (sections: RoverSection[]): void => {
    localStorage.setItem(ROVER_INFO_KEY, JSON.stringify(sections));
  },

  // --- Admin Multi-User logic ---
  getAdmins: (): AdminUser[] => {
    const data = localStorage.getItem(ADMINS_KEY);
    const users = data ? JSON.parse(data) : [];
    const rootUser: AdminUser = {
      id: 'root-0',
      username: ADMIN_CREDENTIALS.userId,
      password: ADMIN_CREDENTIALS.password,
      role: 'SUPER_ADMIN',
      name: 'System Root Admin',
      createdAt: 'Original System Creation'
    };
    if (!users.find((u: AdminUser) => u.username === rootUser.username)) {
      return [rootUser, ...users];
    }
    return users;
  },

  saveAdmins: (admins: AdminUser[]): void => {
    const filteredAdmins = admins.filter(u => u.id !== 'root-0');
    localStorage.setItem(ADMINS_KEY, JSON.stringify(filteredAdmins));
  },

  addAdmin: (admin: Omit<AdminUser, 'id' | 'createdAt'>): void => {
    const admins = storageService.getAdmins();
    const newAdmin: AdminUser = {
      ...admin,
      id: crypto.randomUUID(),
      createdAt: new Date().toLocaleString()
    };
    storageService.saveAdmins([...admins, newAdmin]);
  },

  deleteAdminUser: (id: string): void => {
    const admins = storageService.getAdmins();
    const filtered = admins.filter(u => u.id !== id);
    storageService.saveAdmins(filtered);
  },

  // --- Activity Log logic ---
  getLogs: (): AdminActivity[] => {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  },

  addLog: (admin: AdminUser, action: string, details: string): void => {
    // SECURITY: Do not track root admin activity
    if (admin.id === 'root-0') return;

    const logs = storageService.getLogs();
    const newLog: AdminActivity = {
      id: crypto.randomUUID(),
      adminId: admin.id,
      adminName: admin.name,
      action,
      details,
      timestamp: new Date().toLocaleString()
    };
    localStorage.setItem(LOGS_KEY, JSON.stringify([newLog, ...logs].slice(0, 1000))); 
  }
};
