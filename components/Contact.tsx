
import React, { useState, useEffect, useRef } from 'react';
import { Send, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';
import { storageService } from '../services/storageService';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ fullName: '', mobileNumber: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.mobileNumber || !form.message) return;
    setStatus('loading');
    setTimeout(() => {
      storageService.addMessage(form);
      setStatus('success');
      setForm({ fullName: '', mobileNumber: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    }, 700);
  };

  const infoItems = [
    { icon: <MapPin size={16} />, val: '', link: 'https://maps.app.goo.gl/JJXiUAaRqoXRCSx58' },
    { icon: <Phone size={16} />, val: '', link: 'tel:01792774219' },
    { icon: <Mail size={16} />, val: '', link: 'mailto:rpirovers@gmail.com' }
  ];

  return (
    <section ref={sectionRef} className="py-16 px-4 max-w-6xl mx-auto bg-white dark:bg-slate-950 transition-colors duration-300" id="contact">
      <div className="space-y-12">
        <div className="reveal flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
          <div className="shrink-0">
            <span className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">ORG</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">INFO</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full lg:w-auto">
            {infoItems.map((it, i) => (
              <a 
                key={i} 
                href={it.link} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 sm:p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] sm:rounded-[2.5rem] hover:bg-blue-50 dark:hover:bg-blue-900 hover:border-blue-200 dark:hover:border-blue-600 transition-all group aspect-square shadow-sm hover:shadow-md min-w-[85px] sm:min-w-[160px]"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-2 sm:mb-4 group-hover:scale-125 transition-transform duration-300 bg-white dark:bg-slate-800 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-sm">
                  {it.icon}
                </div>
                <div className="text-center">
                  <p className="text-[7px] sm:text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter leading-tight break-all sm:break-normal">{it.val}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="reveal bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[3rem] shadow-sm max-w-4xl mx-auto">
          {status === 'success' ? (
            <div className="flex flex-col items-center py-12 animate-in zoom-in">
              <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} />
              </div>
              <p className="text-[11px] font-black uppercase text-slate-800 dark:text-slate-100 tracking-widest">Message Received</p>
              <button onClick={() => setStatus('idle')} className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase mt-4 hover:underline">Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                   <input
                    required
                    placeholder="NAME"
                    value={form.fullName}
                    onChange={e => setForm({...form, fullName: e.target.value})}
                    className="w-full px-5 py-4 text-[11px] font-bold rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 dark:text-white transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Mobile Number</label>
                  <input
                    required
                    type="tel"
                    placeholder="+880*****123"
                    value={form.mobileNumber}
                    onChange={e => setForm({...form, mobileNumber: e.target.value})}
                    className="w-full px-5 py-4 text-[11px] font-bold rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 dark:text-white transition-all shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="HOW CAN WE HELP YOU TODAY?"
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  className="w-full px-5 py-4 text-[11px] font-bold rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 dark:text-white transition-all resize-none shadow-sm"
                />
              </div>
              <button
                disabled={status === 'loading'}
                className="w-full py-5 bg-blue-600 dark:bg-blue-600 text-white font-black text-[12px] uppercase tracking-[0.2em] rounded-2xl flex justify-center items-center space-x-2 shadow-xl shadow-blue-500/20 hover:bg-blue-700 dark:hover:bg-blue-700 active:scale-[0.98] transition-all"
              >
                {status === 'loading' ? <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <><Send size={16} /><span>Send Message</span></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;