
import React, { useState } from 'react';
import { X, Lock, User, AlertCircle } from 'lucide-react';
import { storageService } from '../services/storageService';
import { AdminUser } from '../types';

interface AdminLoginProps {
  onClose: () => void;
  onSuccess: (admin: AdminUser) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onClose, onSuccess }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const admins = storageService.getAdmins();
    const foundAdmin = admins.find(a => a.username === userId && a.password === password);

    if (foundAdmin) {
      onSuccess(foundAdmin);
    } else {
      setError('Invalid User ID or Password');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500 border border-slate-200 dark:border-slate-800">
        <div className="relative h-32 bg-blue-600 flex items-center justify-center">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
          >
            <X size={20} />
          </button>
          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-600 shadow-xl">
            <Lock size={32} />
          </div>
        </div>
        
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Admin Portal</h3>
            <p className="text-gray-500 dark:text-slate-400">Authorized personnel only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-slate-500 mb-2 uppercase tracking-widest">User ID</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  required
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 dark:text-white border border-gray-100 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  placeholder="Enter User ID"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-slate-500 mb-2 uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-slate-800 dark:text-white border border-gray-100 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl text-sm font-medium animate-pulse">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black text-lg shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all transform active:scale-95"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
