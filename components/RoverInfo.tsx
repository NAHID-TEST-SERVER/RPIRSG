
import React, { useState } from 'react';
import { X, Info } from 'lucide-react';
import { RoverSection } from '../types';

interface RoverInfoProps {
  roverInfo: RoverSection[];
}

const RoverInfo: React.FC<RoverInfoProps> = ({ roverInfo }) => {
  const [selectedInfo, setSelectedInfo] = useState<RoverSection | null>(null);

  return (
    <section className="py-12 px-2 max-w-[1400px] mx-auto bg-white dark:bg-slate-950 transition-colors duration-300" id="rover-info">
      <div className="text-center mb-10 reveal active">
        <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.4em]">Education</span>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mt-1 italic">Learning Materials</h3>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
        {roverInfo.map((info, idx) => (
          <div 
            key={idx} 
            onClick={() => setSelectedInfo(info)}
            className="reveal active group relative bg-slate-200 dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden cursor-pointer h-32 sm:h-44 md:h-52 border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
          >
            <img 
              src={info.image} 
              className="w-full h-full object-cover transition-transform duration-700" 
              alt={info.title} 
            />
            
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
               <div className="px-5 py-2 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  READ
               </div>
            </div>
          </div>
        ))}
      </div>

      {selectedInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in slide-in-from-bottom-10 duration-500 border dark:border-slate-800">
            <div className="relative h-48 sm:h-64">
              <img src={selectedInfo.image} className="w-full h-full object-cover" alt="" />
              <button 
                onClick={() => setSelectedInfo(null)}
                className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all backdrop-blur-md"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white dark:from-slate-900 to-transparent h-24" />
            </div>
            
            <div className="p-8 sm:p-10 -mt-10 relative bg-white dark:bg-slate-900 rounded-t-[3rem]">
              <div className="flex items-center space-x-3 mb-6">
                 <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <Info size={20} />
                 </div>
                 <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">
                   {selectedInfo.title}
                 </h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {selectedInfo.description}
              </p>
              <button 
                onClick={() => setSelectedInfo(null)} 
                className="mt-8 w-full py-4 bg-slate-950 dark:bg-blue-600 text-white text-xs font-black rounded-2xl uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all active:scale-95"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RoverInfo;