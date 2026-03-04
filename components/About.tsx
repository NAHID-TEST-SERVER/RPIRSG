
import React, { useState, useEffect, useRef } from 'react';
import { History, Target, Eye, X } from 'lucide-react';
import { AboutContent } from '../types';

interface AboutProps {
  aboutImage: string | null;
  aboutContent: AboutContent;
}

const About: React.FC<AboutProps> = ({ aboutImage, aboutContent }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });
    
    containerRef.current?.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const items = [
    { id: 'h', title: 'History', icon: <History size={10} />, desc: aboutContent.history },
    { id: 'm', title: 'Mission', icon: <Target size={10} />, desc: aboutContent.mission },
    { id: 'v', title: 'Vision', icon: <Eye size={10} />, desc: aboutContent.vision }
  ];

  const defaultImage = "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800";

  return (
    <section ref={containerRef} className="py-6 px-3 max-w-5xl mx-auto overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300" id="about">
      <div className="flex flex-row items-stretch gap-2 md:gap-4">
        
        {/* Left: Image Box */}
        <div className="reveal flex-1">
          <div className="w-full h-full rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm transition-transform duration-700">
            <img 
              src={aboutImage || defaultImage} 
              className="w-full h-full object-cover transition-all duration-700" 
              alt="About Rover" 
              data-fb="siteContent/aboutImage"
              data-type="src"
            />
          </div>
        </div>

        {/* Right: Text Box */}
        <div className="reveal flex-1 bg-slate-50/50 dark:bg-slate-900/20 p-2 sm:p-4 md:p-6 rounded-lg border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
          <div className="mb-1 sm:mb-2">
            <span 
              className="text-[6px] sm:text-[7px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest"
              data-fb="siteContent/aboutSectionTitle"
              data-type="text"
            >
              {aboutContent.sectionTitle}
            </span>
            <h3 
              className="text-[10px] sm:text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none mt-0.5"
              data-fb="siteContent/aboutHeading"
              data-type="text"
            >
              {aboutContent.heading}
            </h3>
          </div>
          <p 
            className="text-[8px] sm:text-[9px] text-slate-500 dark:text-slate-400 leading-tight mb-2 sm:mb-4"
            data-fb="siteContent/aboutDescription"
            data-type="text"
          >
            {aboutContent.description}
          </p>
          <div className="space-y-1 sm:space-y-1.5">
            {items.map(item => (
              <button 
                key={item.id}
                onClick={() => setActiveId(item.id)}
                className="w-full flex items-center p-1 sm:p-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-900/30 transition-all text-left group"
              >
                <div className="p-1 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded mr-1.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {React.cloneElement(item.icon as React.ReactElement<any>, { size: 8 })}
                </div>
                <div className="overflow-hidden">
                   <h4 className="text-[7px] sm:text-[9px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tighter truncate">{item.title}</h4>
                   <p className="text-[6px] sm:text-[8px] text-slate-400 dark:text-slate-500 leading-none truncate hidden sm:block">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/20 dark:bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-5 max-w-xs w-full shadow-2xl animate-in zoom-in duration-200 border dark:border-slate-800">
            <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase mb-2 border-b border-slate-100 dark:border-slate-800 pb-1">
              {items.find(i => i.id === activeId)?.title}
            </h4>
            <p className="text-[9px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {items.find(i => i.id === activeId)?.desc}
            </p>
            <button onClick={() => setActiveId(null)} className="mt-5 w-full py-2 bg-slate-900 dark:bg-blue-600 text-white text-[8px] font-bold rounded uppercase tracking-widest">Close</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default About;