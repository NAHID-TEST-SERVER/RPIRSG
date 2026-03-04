
import React from 'react';
import { Facebook, Linkedin, Youtube, ExternalLink, Moon, Sun } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';

const XIcon = ({ size }: { size: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 2.395h-2.19L17.607 20.65z" />
  </svg>
);

interface FooterProps {
  onToggleTheme?: () => void;
  currentTheme?: 'light' | 'dark';
  brandName: string;
  description: string;
}

const Footer: React.FC<FooterProps> = ({ onToggleTheme, currentTheme, brandName, description }) => {
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-6 px-6 border-t border-slate-900 dark:bg-black dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Flexbox Layout */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-32 mb-12">
          
          {/* Left Side: Brand Info */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-[14px] font-black italic shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">R</div>
              <span 
                className="text-base font-black tracking-widest uppercase italic group-hover:text-blue-500 transition-colors"
                data-fb="siteContent/identity/footerBrandName"
                data-type="text"
              >
                {brandName}
              </span>
            </div>
            <p 
              className="text-slate-500 text-[9px] md:text-[10px] leading-relaxed max-w-sm font-medium uppercase tracking-tight"
              data-fb="siteContent/identity/footerDescription"
              data-type="text"
            >
              {description}
            </p>
          </div>

          {/* Right Side: Links Sections */}
          <div className="flex flex-row flex-wrap gap-8 sm:gap-16 justify-end">
            <div className="space-y-4 text-right">
              <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-500">Navigation</h4>
              <ul className="space-y-2 text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                <li><a href="#home" className="hover:text-white transition-all">Home</a></li>
                <li><a href="#about" className="hover:text-white transition-all">Our Story</a></li>
                <li><a href="#members" className="hover:text-white transition-all">Leadership</a></li>
                <li><a href="#rover-info" className="hover:text-white transition-all">Resources</a></li>
              </ul>
            </div>

            <div className="space-y-4 text-right">
              <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-500">Resources</h4>
              <ul className="space-y-2 text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                <li><a href="#contact" className="hover:text-white transition-all">Contact Support</a></li>
                <li><a href="#" className="hover:text-white transition-all flex items-center justify-end gap-1">Training <ExternalLink size={8} /></a></li>
                <li><a href="#" className="hover:text-white transition-all">Volunteer Guide</a></li>
                <li><a href="#" className="hover:text-white transition-all">Global Events</a></li>
              </ul>
            </div>
            
            <div className="space-y-4 text-right">
              <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-500">Company</h4>
              <ul className="space-y-2 text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                <li><a href="#" className="hover:text-white transition-all">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-all">Terms of Use</a></li>
                <li><a href="#" className="hover:text-white transition-all">Press Kit</a></li>
                <li><a href="#" className="hover:text-white transition-all">Partner with Us</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-[8px] font-bold text-slate-700 uppercase tracking-[0.2em] gap-6">
          <div className="order-2 md:order-1 flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} Rajshahi Polytechnic Institute Rover Scout Group. All rights reserved.</p>
            <a 
              href="https://www.facebook.com/nahidul407" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-600 tracking-tighter hover:text-blue-500 transition-colors"
            >
              DEVELOPED BY MD.NAHIDUL ISLAM
            </a>
          </div>

          <div className="order-1 md:order-2 flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button 
              onClick={onToggleTheme}
              className="p-2 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center group"
              title={currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {currentTheme === 'dark' ? (
                <Sun size={12} className="text-yellow-400 group-hover:rotate-45 transition-transform" />
              ) : (
                <Moon size={12} className="text-blue-400 group-hover:-rotate-12 transition-transform" />
              )}
            </button>

            <div className="h-4 w-px bg-slate-900" />

            {/* Social Icons */}
            <div className="flex space-x-2">
              <a href={SOCIAL_LINKS.facebook} target="_blank" className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 text-slate-500 hover:text-blue-500 hover:bg-white/10">
                <Facebook size={12} />
              </a>
              <a href={SOCIAL_LINKS.twitter} target="_blank" className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 text-slate-500 hover:text-white hover:bg-white/10">
                <XIcon size={12} />
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 text-slate-500 hover:text-blue-700 hover:bg-white/10">
                <Linkedin size={12} />
              </a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 text-slate-500 hover:text-red-600 hover:bg-white/10">
                <Youtube size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;