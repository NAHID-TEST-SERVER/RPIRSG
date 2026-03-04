
import React from 'react';
import { Phone, User, MessageCircle, MessageSquare } from 'lucide-react';
import { Member } from '../types';
 
interface MembersProps {
  members: Member[];
}

const Members: React.FC<MembersProps> = ({ members }) => {
  const cleanPhone = (phone: string) => phone.replace(/\D/g, '');

  return (
    <section className="py-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300" id="members">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-6 reveal active">
          <span className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">The Council</span>
          <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Active Leaders</h3>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                  <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                  <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                  <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">Phone</th>
                  <th className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter">{member.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">{member.phone}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <a 
                          href={`tel:${cleanPhone(member.phone)}`} 
                          className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                          title="Call"
                        >
                          <Phone size={12} />
                        </a>
                        <a 
                          href={`https://wa.me/${cleanPhone(member.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-green-500 transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle size={12} />
                        </a>
                        <a 
                          href={`sms:${cleanPhone(member.phone)}`}
                          className="p-1.5 text-slate-400 hover:text-sky-500 transition-colors"
                          title="SMS"
                        >
                          <MessageSquare size={12} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Members;