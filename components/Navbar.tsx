
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onAdminClick: () => void;
  isAdminView: boolean;
  onLogoClick: () => void;
  logo: string | null;
  brandName: string;
}

const Navbar: React.FC<NavbarProps> = ({ onAdminClick, isAdminView, onLogoClick, logo, brandName }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 5);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Rover', href: '#rover-info' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled || isAdminView ? 'glass border-b border-slate-100 py-0.5' : 'bg-transparent py-2'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-8">
          {/* Logo - Admin portal access */}
          <div 
            className="flex items-center space-x-1.5 cursor-pointer group" 
            onClick={onAdminClick}
          >
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white shrink-0 overflow-hidden shadow-sm">
               {logo ? (
                 <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-full h-full object-cover" 
                  data-fb="siteContent/logoUrl"
                  data-type="src"
                 />
               ) : (
                 <span className="text-[12px] font-black italic">R</span>
               )}
            </div>
            <span 
              className={`font-black text-[11px] tracking-tighter uppercase ${!isScrolled && !isAdminView ? 'text-white' : 'text-slate-900'}`}
              data-fb="siteContent/identity/brandName"
              data-type="text"
            >
              {brandName}
            </span>
          </div>

          {/* Micro Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAdminView && navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-[9px] font-bold uppercase tracking-widest hover:text-blue-600 transition-colors ${!isScrolled && !isAdminView ? 'text-white/80' : 'text-slate-500'}`}
              >
                {link.name}
              </a>
            ))}
            {isAdminView && (
               <button onClick={onLogoClick} className="text-[9px] font-black uppercase text-blue-600">Home</button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className={`md:hidden p-1 ${!isScrolled && !isAdminView ? 'text-white' : 'text-slate-900'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-transparent border-none animate-in slide-in-from-top-1 duration-200">
          <div className="px-4 py-6 flex flex-col items-end space-y-3">
            {!isAdminView && navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 w-32 h-10 flex items-center justify-center rounded-2xl bg-white/40 backdrop-blur-md border border-white/20 shadow-xl shadow-black/5 transition-all duration-200 hover:bg-blue-600 hover:text-white hover:border-blue-500 hover:shadow-blue-500/10 active:scale-95"
              >
                {link.name}
              </a>
            ))}
            {isAdminView && (
              <button 
                onClick={() => {
                  onLogoClick();
                  setIsMobileMenuOpen(false);
                }} 
                className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 w-32 h-10 flex items-center justify-center rounded-2xl bg-white/40 backdrop-blur-md border border-white/20 shadow-xl shadow-black/5 transition-all duration-200 hover:bg-blue-600 hover:text-white hover:border-blue-500 hover:shadow-blue-500/10 active:scale-95"
              >
                Home
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
