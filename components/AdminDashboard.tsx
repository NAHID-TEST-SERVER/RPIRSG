
import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  LogOut, 
  Clock, 
  Phone, 
  User as UserIcon,
  Search,
  RefreshCw,
  Trash2,
  Image as ImageIcon,
  Reply,
  X,
  Send,
  Plus,
  Palette,
  Edit3,
  Contact2,
  BookOpen,
  UserPlus,
  ShieldCheck,
  Activity,
  ChevronRight,
  Eye,
  EyeOff,
  Briefcase,
  Key,
  ShieldAlert,
  Shield,
  History as HistoryIcon,
  Camera,
  Layers
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { UserMessage, SiteStats, Member, RoverSection, AdminUser, AdminActivity, AboutContent, SiteIdentity } from '../types';

interface AdminDashboardProps {
  currentAdmin: AdminUser;
  onLogout: () => void;
  logo: string | null;
  onLogoUpdate: (newLogo: string | null) => void;
  banners: string[];
  onBannersUpdate: (newBanners: string[]) => void;
  aboutImage: string | null;
  onAboutImageUpdate: (newImage: string | null) => void;
  aboutContent: AboutContent;
  onAboutContentUpdate: (newContent: AboutContent) => void;
  siteIdentity: SiteIdentity;
  onIdentityUpdate: (newIdentity: SiteIdentity) => void;
  members: Member[];
  onMembersUpdate: (newMembers: Member[]) => void;
  roverInfo: RoverSection[];
  onRoverInfoUpdate: (newInfo: RoverSection[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  currentAdmin,
  onLogout, 
  logo, 
  onLogoUpdate, 
  banners, 
  onBannersUpdate,
  aboutImage,
  onAboutImageUpdate,
  aboutContent,
  onAboutContentUpdate,
  siteIdentity,
  onIdentityUpdate,
  members,
  onMembersUpdate,
  roverInfo,
  onRoverInfoUpdate
}) => {
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [stats, setStats] = useState<SiteStats>({ viewCount: 0, messageCount: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingTo, setReplyingTo] = useState<UserMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  // Admin Management State
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [allLogs, setAllLogs] = useState<AdminActivity[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [adminForm, setAdminForm] = useState({ username: '', password: '', role: 'MODERATOR' as any, name: '', notes: '', avatar: '' });
  const [selectedStaff, setSelectedStaff] = useState<AdminUser | null>(null);
  const [showPassword, setShowPassword] = useState<string | null>(null);

  const [localMembers, setLocalMembers] = useState<Member[]>(members);
  const [localRoverInfo, setLocalRoverInfo] = useState<RoverSection[]>(roverInfo);
  const [localAboutContent, setLocalAboutContent] = useState<AboutContent>(aboutContent);
  const [localIdentity, setLocalIdentity] = useState<SiteIdentity>(siteIdentity);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);
  const infoImageInputRef = useRef<HTMLInputElement>(null);
  const adminAvatarInputRef = useRef<HTMLInputElement>(null);
  const activeInfoIndex = useRef<number>(-1);

  const loadData = () => {
    setMessages(storageService.getMessages());
    setStats(storageService.getStats());
    setAdmins(storageService.getAdmins());
    setAllLogs(storageService.getLogs());
  };

  useEffect(() => {
    loadData();
    setLocalMembers(members);
    setLocalRoverInfo(roverInfo);
    setLocalAboutContent(aboutContent);
    setLocalIdentity(siteIdentity);
  }, [members, roverInfo, aboutContent, siteIdentity]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        storageService.setLogo(base64String);
        onLogoUpdate(base64String);
        storageService.addLog(currentAdmin, 'EDIT', 'Updated site logo.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const readers = Array.from(files).map((file: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(newBanners => {
        onBannersUpdate([...banners, ...newBanners]);
        storageService.addLog(currentAdmin, 'UPLOAD', `Added ${newBanners.length} banners.`);
      });
    }
  };

  const handleAboutImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        storageService.setAboutImage(base64String);
        onAboutImageUpdate(base64String);
        storageService.addLog(currentAdmin, 'EDIT', 'Updated About imagery.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdminAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminForm(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInfoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeInfoIndex.current !== -1) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updated = [...localRoverInfo];
        updated[activeInfoIndex.current] = { ...updated[activeInfoIndex.current], image: base64String };
        setLocalRoverInfo(updated);
        storageService.addLog(currentAdmin, 'EDIT', `Changed learning material media.`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBanner = (index: number) => {
    onBannersUpdate(banners.filter((_, i) => i !== index));
    storageService.addLog(currentAdmin, 'DELETE', 'Removed banner asset.');
  };

  const handleResetLogo = () => {
    storageService.removeLogo();
    onLogoUpdate(null);
    storageService.addLog(currentAdmin, 'DELETE', 'Reset logo.');
  };

  const handleResetAboutImage = () => {
    storageService.removeAboutImage();
    onAboutImageUpdate(null);
    storageService.addLog(currentAdmin, 'DELETE', 'Reset About imagery.');
  };

  const handleUpdateMember = (id: string, field: keyof Member, value: string) => {
    setLocalMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleUpdateRoverInfo = (index: number, field: keyof RoverSection, value: string) => {
    const updated = [...localRoverInfo];
    updated[index] = { ...updated[index], [field]: value };
    setLocalRoverInfo(updated);
  };

  const handleAddRoverInfo = () => {
    setLocalRoverInfo([...localRoverInfo, { title: 'New Topic', description: 'Enter content...', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400' }]);
  };

  const handleRemoveRoverInfo = (index: number) => {
    setLocalRoverInfo(localRoverInfo.filter((_, i) => i !== index));
  };

  const handleSaveChanges = () => {
    onMembersUpdate(localMembers);
    onRoverInfoUpdate(localRoverInfo);
    onAboutContentUpdate(localAboutContent);
    onIdentityUpdate(localIdentity);
    storageService.addLog(currentAdmin, 'EDIT', 'Synchronized organization records.');
    setShowSettings(false);
  };

  const handleDeleteMessage = (id: string) => {
    if (confirm('Delete inquiry?')) {
      storageService.deleteMessage(id);
      storageService.addLog(currentAdmin, 'DELETE', 'Deleted user message.');
      loadData();
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo || !replyText.trim()) return;
    storageService.updateMessageReply(replyingTo.id, replyText);
    storageService.addLog(currentAdmin, 'REPLY', `Replied to ${replyingTo.fullName}.`);
    setReplyingTo(null);
    setReplyText('');
    loadData();
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminForm.username || !adminForm.password || !adminForm.name) return;
    storageService.addAdmin(adminForm);
    storageService.addLog(currentAdmin, 'CREATE_ADMIN', `Authorized moderator: ${adminForm.username}`);
    setAdminForm({ username: '', password: '', role: 'MODERATOR', name: '', notes: '', avatar: '' });
    setShowCreateForm(false);
    loadData();
  };

  const handleDeleteAdmin = (id: string, name: string) => {
    if (id === 'root-0') return;
    if (confirm(`Remove access for ${name}?`)) {
      storageService.deleteAdminUser(id);
      storageService.addLog(currentAdmin, 'DELETE', `Revoked access for ${name}`);
      loadData();
    }
  };

  const getActionColor = (action: string) => {
    switch(action) {
      case 'LOGIN': return 'text-blue-600 bg-blue-50';
      case 'LOGOUT': return 'text-slate-600 bg-slate-50';
      case 'DELETE': return 'text-red-600 bg-red-50';
      case 'EDIT': return 'text-amber-600 bg-amber-50';
      case 'UPLOAD': return 'text-purple-600 bg-purple-50';
      case 'REPLY': return 'text-green-600 bg-green-50';
      case 'CREATE_ADMIN': return 'text-cyan-600 bg-cyan-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredMessages = messages.filter(m => 
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const personalLogs = allLogs.filter(l => l.adminId === currentAdmin.id);
  const isSuperAdmin = currentAdmin.role === 'SUPER_ADMIN';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-500">
      {/* Header - Control Center title replaced by Admin Name */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center space-x-4">
          <div 
            onClick={() => setSelectedStaff(currentAdmin)}
            className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl cursor-pointer overflow-hidden border-2 border-transparent hover:border-blue-400 transition-all active:scale-90"
          >
            {currentAdmin.avatar ? (
              <img src={currentAdmin.avatar} className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={28} />
            )}
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white leading-none tracking-tight italic uppercase">{currentAdmin.name}</h1>
            <p className="text-gray-500 dark:text-slate-400 font-bold text-[9px] uppercase tracking-widest mt-1">
              Rank: <span className="text-blue-600 font-black">{currentAdmin.role}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isSuperAdmin && (
            <button 
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              className={`flex items-center space-x-2 px-4 md:px-6 py-3 font-black text-[9px] md:text-[10px] uppercase tracking-widest rounded-2xl shadow-xl transition-all ${showAdminPanel ? 'bg-slate-900 text-white shadow-slate-900/20' : 'bg-green-600 text-white shadow-green-600/20 hover:bg-green-700'}`}
            >
              <ShieldCheck size={16} />
              <span className="hidden md:inline">{showAdminPanel ? 'Home' : 'Staff Manager'}</span>
              <span className="md:hidden">{showAdminPanel ? 'Home' : 'Staff'}</span>
            </button>
          )}
          <button 
            onClick={() => setShowSettings(true)}
            className="flex items-center space-x-2 px-4 md:px-6 py-3 bg-blue-600 text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all"
          >
            <Palette size={16} />
            <span className="hidden md:inline">Design Settings</span>
            <span className="md:hidden">Design</span>
          </button>
          <button 
            onClick={onLogout}
            className="px-4 md:px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold rounded-2xl flex items-center space-x-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all active:scale-95"
          >
            <LogOut size={18} />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {showAdminPanel && isSuperAdmin ? (
        <div className="space-y-10 animate-in slide-in-from-top-4 duration-500">
          <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
               <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
                   <UserPlus size={20} />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none italic uppercase">Staff Records</h3>
               </div>
               <button 
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="flex items-center justify-center space-x-2 px-6 py-4 bg-green-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg hover:bg-green-700 transition-all active:scale-95 w-full md:w-auto"
               >
                  {showCreateForm ? <X size={14} /> : <Plus size={14} />}
                  <span>{showCreateForm ? 'Abort' : 'Grant New Access'}</span>
               </button>
            </div>

            {showCreateForm && (
              <form onSubmit={handleAddAdmin} className="mb-12 p-6 md:p-10 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 animate-in zoom-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center justify-center space-y-4 md:border-r border-slate-200 dark:border-slate-700 pr-0 md:pr-10">
                    <div 
                      onClick={() => adminAvatarInputRef.current?.click()}
                      className="w-28 h-28 bg-white dark:bg-slate-900 rounded-[2.2rem] shadow-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-all overflow-hidden group"
                    >
                      {adminForm.avatar ? (
                        <img src={adminForm.avatar} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Camera size={32} className="text-slate-200 group-hover:text-green-500" />
                          <span className="text-[8px] font-black uppercase text-slate-400 mt-2">Add Identity</span>
                        </>
                      )}
                    </div>
                    <input type="file" ref={adminAvatarInputRef} onChange={handleAdminAvatarUpload} className="hidden" accept="image/*" />
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Staff Identity</label>
                      <input required value={adminForm.name} onChange={e => setAdminForm({...adminForm, name: e.target.value})} className="w-full px-5 py-4 bg-white dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-green-500 font-bold" placeholder="Full Name" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Account UID</label>
                      <input required value={adminForm.username} onChange={e => setAdminForm({...adminForm, username: e.target.value})} className="w-full px-5 py-4 bg-white dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-green-500 font-bold" placeholder="Username" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Secret Key</label>
                      <input required type="password" value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} className="w-full px-5 py-4 bg-white dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-green-500 font-bold" placeholder="••••" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Rank</label>
                      <select value={adminForm.role} onChange={e => setAdminForm({...adminForm, role: e.target.value as any})} className="w-full px-5 py-4 bg-white dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-green-500 font-black uppercase text-[10px]">
                        <option value="MODERATOR">MODERATOR</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button type="submit" className="mt-10 w-full py-5 bg-slate-950 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:bg-black transition-all shadow-2xl active:scale-95">Verify & Provision Access</button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admins.filter(a => a.id !== 'root-0').map(admin => (
                <div 
                  key={admin.id} 
                  onClick={() => setSelectedStaff(admin)}
                  className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-transparent hover:border-blue-500/30 hover:shadow-2xl transition-all group cursor-pointer active:scale-95 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-300 shadow-xl overflow-hidden border dark:border-slate-800">
                        {admin.avatar ? <img src={admin.avatar} className="w-full h-full object-cover" /> : <UserIcon size={24} />}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 dark:text-white text-sm uppercase leading-none tracking-tight">{admin.name}</p>
                        <p className="text-[7px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mt-1.5 italic bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full inline-block">{admin.role}</p>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteAdmin(admin.id, admin.name); }} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between relative z-10">
                     <p className="text-[8px] font-black text-slate-400 uppercase italic">Pulse: {admin.lastLogin?.split(',')[1] || 'Offline'}</p>
                     <ChevronRight size={14} className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Main Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-xl transition-all flex flex-col justify-center group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shadow-inner">
                    <BarChart3 size={24} />
                  </div>
                </div>
                <p className="text-gray-500 dark:text-slate-500 font-black text-[9px] uppercase tracking-[0.2em] mb-1 italic relative z-10">Total Reach</p>
                <h4 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter relative z-10">{stats.viewCount.toLocaleString()}</h4>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-xl transition-all flex flex-col justify-center group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 dark:bg-green-900/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center shadow-inner">
                    <MessageSquare size={24} />
                  </div>
                </div>
                <p className="text-gray-500 dark:text-slate-500 font-black text-[9px] uppercase tracking-[0.2em] mb-1 italic relative z-10">Inquiries</p>
                <h4 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter relative z-10">{stats.messageCount.toLocaleString()}</h4>
              </div>

              <div 
                onClick={() => setSelectedStaff(currentAdmin)}
                className="bg-blue-600 p-6 rounded-3xl shadow-2xl text-white flex flex-col justify-center cursor-pointer group hover:-translate-y-2 transition-all overflow-hidden relative border-2 border-transparent hover:border-white/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center backdrop-blur-md shadow-2xl group-hover:scale-110 transition-transform border border-white/20 overflow-hidden">
                    {currentAdmin.avatar ? <img src={currentAdmin.avatar} className="w-full h-full object-cover" /> : <UserIcon size={24} />}
                  </div>
                  <div className="px-3 py-1 bg-white text-blue-600 text-[8px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">MY BOX</div>
                </div>
                <p className="text-white/60 font-black text-[10px] uppercase tracking-[0.1em] mb-1 italic relative z-10">Identity File</p>
                <h4 className="text-2xl font-black italic tracking-tight relative z-10 uppercase">{currentAdmin.name}</h4>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between relative z-10 opacity-30">
                   <Activity size={18} />
                   <Shield size={18} />
                </div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tight uppercase">User Mail</h3>
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Scan inbox..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-14 pr-8 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-slate-800 dark:text-white border border-gray-100 dark:border-slate-700 focus:border-blue-500 outline-none w-full md:w-80 transition-all text-xs font-bold italic" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {filteredMessages.length > 0 ? (
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-slate-800/50">
                          <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Identity</th>
                          <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                        {filteredMessages.map((msg) => (
                          <tr key={msg.id} className="hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-all group">
                            <td className="px-10 py-10">
                              <div className="flex items-center space-x-6">
                                <div className="w-14 h-14 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-400 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all">
                                  <UserIcon size={24} />
                                </div>
                                <div>
                                  <p className="font-black text-gray-900 dark:text-white text-sm uppercase italic tracking-tighter">{msg.fullName}</p>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold italic mt-1 line-clamp-2">"{msg.message}"</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-10 py-10 text-right">
                              <div className="flex items-center justify-end space-x-4">
                                <button onClick={() => { setReplyingTo(msg); setReplyText(msg.reply || ''); }} className="p-4 text-gray-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all shadow-sm active:scale-90"><Reply size={24} /></button>
                                <button onClick={() => handleDeleteMessage(msg.id)} className="p-4 text-gray-400 hover:text-red-600 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all shadow-sm active:scale-90"><Trash2 size={24} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="py-32 text-center text-slate-300 italic opacity-40 uppercase tracking-[0.5em] text-[12px]">Archives Empty</div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
               <div className="bg-slate-950 p-6 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:scale-150 transition-transform duration-1000" />
                  <div className="flex items-center space-x-4 mb-6 relative z-10">
                     <HistoryIcon size={24} className="text-blue-500" />
                     <h3 className="text-xl font-black italic uppercase tracking-tight">System Audit</h3>
                  </div>
                  <div className="space-y-4 relative z-10 max-h-[400px] overflow-y-auto custom-scrollbar pr-3">
                     {allLogs.slice(0, 15).map(log => (
                        <div key={log.id} className="border-l-2 border-slate-800 pl-4 py-1.5 transition-all hover:border-blue-600 group/item">
                           <p className="text-[10px] font-black uppercase text-blue-400 tracking-tighter">{log.action}</p>
                           <p className="text-[11px] font-bold text-slate-200 mt-0.5 italic leading-tight">"{log.details}"</p>
                           <p className="text-[8px] text-slate-500 uppercase mt-1.5 font-black">Auth: <span className="text-slate-300">{log.adminName}</span></p>
                        </div>
                     ))}
                     {allLogs.length === 0 && <div className="text-center py-20 text-slate-700 italic font-black uppercase text-[10px] tracking-widest">No Operational Records</div>}
                  </div>
               </div>
            </div>
          </div>
        </>
      )}

      {/* Staff Detail Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-950 w-full max-w-lg rounded-t-[3rem] md:rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full md:zoom-in duration-500 border-t border-slate-100 dark:border-slate-800 max-h-[90vh] flex flex-col">
              <div className="relative h-24 md:h-32 bg-blue-600 shrink-0">
                 <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700" />
                 <button onClick={() => { setSelectedStaff(null); setShowPassword(null); }} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white text-white hover:text-blue-600 rounded-full transition-all z-20"><X size={18} /></button>
                 <div className="absolute -bottom-8 md:-bottom-10 left-6 md:left-10 p-1.5 bg-white dark:bg-slate-900 rounded-[1.8rem] md:rounded-[2.2rem] shadow-2xl">
                    <div className="w-20 md:w-28 h-20 md:h-28 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] md:rounded-[1.8rem] flex items-center justify-center text-slate-300 shadow-inner overflow-hidden">
                       {selectedStaff.avatar ? <img src={selectedStaff.avatar} className="w-full h-full object-cover" /> : <UserIcon size={48} />}
                    </div>
                 </div>
                 <div className="absolute bottom-3 md:bottom-4 left-32 md:left-44">
                    <h2 className="text-xl md:text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{selectedStaff.name}</h2>
                    <p className="text-white/60 text-[8px] md:text-[10px] font-black uppercase tracking-widest mt-1 italic">{selectedStaff.role}</p>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto pt-14 md:pt-16 pb-10 px-6 md:px-10 space-y-8 custom-scrollbar">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Key size={12} /> Credentials</label>
                       <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-inner">
                          <div className="flex flex-col gap-3">
                             <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                               <span className="text-[9px] font-black text-slate-400 uppercase">UID</span>
                               <span className="text-[12px] font-black text-slate-900 dark:text-white uppercase truncate ml-4">{selectedStaff.username}</span>
                             </div>
                             <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                   <span className="text-[9px] font-black text-slate-400 uppercase">Key</span>
                                   <span className="text-[12px] font-black text-slate-900 dark:text-white mt-0.5">{showPassword === selectedStaff.id ? selectedStaff.password : '••••••••'}</span>
                                </div>
                                <button onMouseDown={() => setShowPassword(selectedStaff.id)} onMouseUp={() => setShowPassword(null)} onMouseLeave={() => setShowPassword(null)} className="p-2.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:text-blue-600 transition-all active:scale-90 border dark:border-slate-700">
                                   {showPassword === selectedStaff.id ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Briefcase size={12} /> Work Scope</label>
                       <div className="p-5 md:p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-inner min-h-[80px]">
                          <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 italic leading-relaxed">{selectedStaff.notes || 'No registry notes.'}</p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Activity size={12} /> Pulse Check</label>
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-inner p-4 md:p-6 max-h-[200px] overflow-y-auto custom-scrollbar space-y-4">
                       {allLogs.filter(l => l.adminId === selectedStaff.id).length > 0 ? (
                          allLogs.filter(l => l.adminId === selectedStaff.id).slice(0, 10).map(log => (
                             <div key={log.id} className="pb-3 border-b border-slate-200 dark:border-slate-800 last:border-0 hover:translate-x-1 transition-transform">
                                <div className="flex items-center justify-between mb-1">
                                   <span className={`text-[9px] font-black uppercase ${getActionColor(log.action).split(' ')[0]}`}>{log.action}</span>
                                   <span className="text-[8px] font-black text-slate-400 italic">{log.timestamp.split(',')[1]}</span>
                                </div>
                                <p className="text-[12px] font-bold text-slate-700 dark:text-slate-300 leading-none italic truncate">"{log.details}"</p>
                             </div>
                          ))
                       ) : (
                          <div className="py-12 text-center text-[10px] font-black text-slate-400 uppercase italic opacity-40">No Activity Logged</div>
                       )}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 md:p-5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner text-center">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest italic">Entry</p>
                       <p className="text-[12px] font-black text-slate-900 dark:text-white uppercase truncate">{selectedStaff.createdAt.split(',')[0]}</p>
                    </div>
                    <div className="p-4 md:p-5 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner text-center">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest italic">Last Pulse</p>
                       <p className="text-[12px] font-black text-slate-900 dark:text-white uppercase truncate">{selectedStaff.lastLogin?.split(',')[1] || 'Pending'}</p>
                    </div>
                 </div>

                 <button onClick={() => { setSelectedStaff(null); setShowPassword(null); }} className="w-full py-5 bg-slate-950 text-white font-black text-[12px] uppercase tracking-[0.5em] rounded-3xl shadow-2xl active:scale-95 transition-all">
                    RELEASE FILE
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Reply Dispatch Modal */}
      {replyingTo && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-12 duration-500 border dark:border-slate-800">
            <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl"><Reply size={22} /></div>
                 <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic">Dispatch</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">To: {replyingTo.fullName}</p>
                 </div>
              </div>
              <button onClick={() => setReplyingTo(null)} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all text-slate-400"><X size={24} /></button>
            </div>
            <div className="p-10">
              <div className="mb-8 bg-slate-50 dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 relative overflow-hidden"><p className="text-[13px] text-slate-700 dark:text-slate-300 font-bold italic leading-relaxed">"{replyingTo.message}"</p></div>
              <form onSubmit={handleSendReply} className="space-y-6">
                <textarea required autoFocus rows={5} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Draft response..." className="w-full px-6 py-5 rounded-3xl bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-100 dark:border-slate-700 focus:border-blue-500 outline-none transition-all text-[13px] font-bold italic resize-none" />
                <div className="flex items-center space-x-4 pt-4">
                  <button type="button" onClick={() => setReplyingTo(null)} className="flex-1 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 font-black text-[11px] uppercase tracking-widest transition-all active:scale-95">ABORT</button>
                  <button type="submit" className="flex-[2] py-5 rounded-2xl bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all">ISSUE DISPATCH</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Global Sync / Design Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-950 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] shadow-2xl border dark:border-slate-800 animate-in zoom-in slide-in-from-bottom-12 duration-500 custom-scrollbar">
            <div className="p-8 md:p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-950 z-10">
               <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl"><Palette size={24} /></div>
                 <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic leading-none">Identity Hub</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 italic">Central System Authority</p>
                 </div>
              </div>
              <button onClick={() => { handleSaveChanges(); }} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all text-slate-400"><X size={24} /></button>
            </div>

            <div className="p-8 md:p-10 space-y-20">
              {/* Logo branding */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.5em] italic flex items-center gap-2"><div className="w-1 h-3 bg-blue-600 rounded-full" /> Navigation Emblem</h4>
                  <div className="flex gap-4">
                    <button onClick={() => logoInputRef.current?.click()} className="px-6 py-2.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase rounded-xl active:scale-95 transition-all">Update</button>
                    {logo && <button onClick={handleResetLogo} className="px-6 py-2.5 bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-[10px] font-black uppercase rounded-xl active:scale-95 transition-all">Reset</button>}
                  </div>
                </div>
                <div className="flex items-center space-x-10 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700">
                  <div className="w-20 h-20 bg-white dark:bg-slate-950 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden shrink-0 border dark:border-slate-800">{logo ? <img src={logo} className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-200" size={32} />}</div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand Name (Navbar)</label>
                      <input value={localIdentity.brandName} onChange={e => setLocalIdentity({...localIdentity, brandName: e.target.value})} className="w-full px-4 py-2 bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-bold text-xs italic" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Footer Brand Name</label>
                      <input value={localIdentity.footerBrandName} onChange={e => setLocalIdentity({...localIdentity, footerBrandName: e.target.value})} className="w-full px-4 py-2 bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-bold text-xs italic" />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Footer Description</label>
                      <textarea value={localIdentity.footerDescription} onChange={e => setLocalIdentity({...localIdentity, footerDescription: e.target.value})} rows={2} className="w-full px-4 py-2 bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-bold text-xs italic resize-none" />
                    </div>
                  </div>
                </div>
                <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
              </section>

              {/* Our Story imagery */}
              <section className="pt-10 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.5em] italic flex items-center gap-2"><div className="w-1 h-3 bg-blue-600 rounded-full" /> About Visual</h4>
                  <div className="flex gap-4">
                    <button onClick={() => aboutImageInputRef.current?.click()} className="px-6 py-2.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase rounded-xl active:scale-95 transition-all">Change Media</button>
                    {aboutImage && <button onClick={handleResetAboutImage} className="px-6 py-2.5 bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-[10px] font-black uppercase rounded-xl active:scale-95 transition-all">Reset</button>}
                  </div>
                </div>
                <div className="flex items-center space-x-10 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700">
                  <div className="w-44 h-28 bg-white dark:bg-slate-950 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden shrink-0 border dark:border-slate-800">{aboutImage ? <img src={aboutImage} className="w-full h-full object-cover" /> : <img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400" className="w-full h-full object-cover opacity-50" />}</div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Section Title</label>
                        <input value={localAboutContent.sectionTitle} onChange={e => setLocalAboutContent({...localAboutContent, sectionTitle: e.target.value})} className="w-full px-4 py-2 bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-bold text-xs italic" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Heading</label>
                        <input value={localAboutContent.heading} onChange={e => setLocalAboutContent({...localAboutContent, heading: e.target.value})} className="w-full px-4 py-2 bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-bold text-xs italic" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Description</label>
                      <textarea value={localAboutContent.description} onChange={e => setLocalAboutContent({...localAboutContent, description: e.target.value})} rows={2} className="w-full px-4 py-2 bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-bold text-xs italic resize-none" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">History</label>
                        <textarea value={localAboutContent.history} onChange={e => setLocalAboutContent({...localAboutContent, history: e.target.value})} rows={2} className="w-full px-4 py-2 bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-bold text-[10px] italic resize-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Mission</label>
                        <textarea value={localAboutContent.mission} onChange={e => setLocalAboutContent({...localAboutContent, mission: e.target.value})} rows={2} className="w-full px-4 py-2 bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-bold text-[10px] italic resize-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Vision</label>
                        <textarea value={localAboutContent.vision} onChange={e => setLocalAboutContent({...localAboutContent, vision: e.target.value})} rows={2} className="w-full px-4 py-2 bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 font-bold text-[10px] italic resize-none" />
                      </div>
                    </div>
                  </div>
                </div>
                <input type="file" ref={aboutImageInputRef} onChange={handleAboutImageUpload} className="hidden" accept="image/*" />
              </section>

              {/* Leadership Council - RESTORED */}
              <section className="pt-10 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3 mb-8">
                   <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shadow-inner"><Contact2 size={20} /></div>
                   <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.4em] italic">Active Leadership Council</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {localMembers.map((member) => (
                      <div key={member.id} className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 hover:border-blue-500/30 transition-all group">
                         <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest italic">ID: {member.id}</span>
                            <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-[8px] font-black shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">{member.name.charAt(0)}</div>
                         </div>
                         <div className="space-y-3">
                            <div className="space-y-1">
                               <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity</label>
                               <input value={member.name} onChange={(e) => handleUpdateMember(member.id, 'name', e.target.value)} className="w-full px-3 py-2 text-[10px] font-bold rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500 italic shadow-inner" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                               <div className="space-y-1">
                                  <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
                                  <input value={member.role} onChange={(e) => handleUpdateMember(member.id, 'role', e.target.value)} className="w-full px-3 py-2 text-[9px] font-bold rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500 italic shadow-inner" />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                                  <input value={member.phone} onChange={(e) => handleUpdateMember(member.id, 'phone', e.target.value)} className="w-full px-3 py-2 text-[9px] font-bold rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500 italic shadow-inner" />
                               </div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
              </section>

              {/* Knowledge Archives - RESTORED */}
              <section className="pt-10 border-t border-slate-100 dark:border-slate-800">
                 <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center shadow-inner"><BookOpen size={20} /></div>
                       <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.4em] italic">Knowledge Archives</h4>
                    </div>
                    <button onClick={handleAddRoverInfo} className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase rounded-2xl shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95"><Plus size={14} /><span>Add Protocol</span></button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {localRoverInfo.map((info, idx) => (
                       <div key={idx} className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col gap-4 relative group hover:border-blue-500/30 transition-all">
                          <div className="relative aspect-video bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border dark:border-slate-700 group/img shadow-2xl">
                             <img src={info.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110" />
                             <button onClick={() => { activeInfoIndex.current = idx; infoImageInputRef.current?.click(); }} className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover/img:opacity-100 transition-all flex flex-col items-center justify-center backdrop-blur-sm"><ImageIcon size={20} /><span className="text-[8px] font-black uppercase mt-1 tracking-widest">Update Media</span></button>
                          </div>
                          <div className="space-y-3">
                             <div className="flex items-center justify-between">
                                <label className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] italic">Resource {idx + 1}</label>
                                <button onClick={() => handleRemoveRoverInfo(idx)} className="p-1.5 text-slate-300 hover:text-red-600 transition-colors bg-white dark:bg-slate-800 rounded-lg shadow-sm"><Trash2 size={14} /></button>
                             </div>
                             <div className="space-y-1">
                                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                                <input value={info.title} onChange={(e) => handleUpdateRoverInfo(idx, 'title', e.target.value)} placeholder="Title" className="w-full px-4 py-3 text-[11px] font-black rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500 italic shadow-inner" />
                             </div>
                             <div className="space-y-1">
                                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea value={info.description} onChange={(e) => handleUpdateRoverInfo(idx, 'description', e.target.value)} placeholder="Description..." rows={2} className="w-full px-4 py-3 text-[10px] font-bold rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500 resize-none italic shadow-inner" />
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
                 <input type="file" ref={infoImageInputRef} onChange={handleInfoImageUpload} className="hidden" accept="image/*" />
              </section>

              {/* Hero assets */}
              <section className="pt-10 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.5em] italic flex items-center gap-2"><div className="w-1 h-3 bg-blue-600 rounded-full" /> Hero Gallery</h4>
                  <button onClick={() => bannerInputRef.current?.click()} className="px-6 py-3 bg-blue-600 text-white text-[11px] font-black uppercase rounded-2xl shadow-xl active:scale-95 transition-all"><Plus size={16} /></button>
                </div>
                <input type="file" ref={bannerInputRef} onChange={handleBannerUpload} className="hidden" accept="image/*" multiple />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {banners.map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-3xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-xl group">
                      <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"><button onClick={() => handleRemoveBanner(idx)} className="p-3 bg-red-600 text-white rounded-2xl shadow-2xl active:scale-90"><Trash2 size={20} /></button></div>
                    </div>
                  ))}
                  <button onClick={() => bannerInputRef.current?.click()} className="aspect-video rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-300 hover:text-blue-500 transition-all bg-slate-50/50 group active:scale-95"><Plus size={32} className="group-hover:rotate-90 transition-transform" /></button>
                </div>
              </section>

              <button onClick={() => { handleSaveChanges(); }} className="w-full py-6 bg-slate-950 text-white font-black text-[12px] uppercase tracking-[0.6em] rounded-[2.5rem] shadow-2xl hover:bg-blue-600 transition-all active:scale-95 italic">EXECUTE GLOBAL MASTER SYNC</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
