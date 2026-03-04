
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Members from './components/Members';
import RoverInfo from './components/RoverInfo';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import Chatbot from './components/Chatbot';
import { storageService } from './services/storageService';
import { initSiteContentSync, syncFirebasePathToState, updateFirebasePath } from './services/siteContentSync';
import { SLIDER_IMAGES } from './constants';
import { AboutContent, Member, RoverSection, AdminUser, SiteIdentity } from './types';

const App: React.FC = () => {
  const [isAdminView, setIsAdminView] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [banners, setBanners] = useState<string[]>(SLIDER_IMAGES);
  const [aboutImage, setAboutImage] = useState<string | null>(null);
  const [aboutContent, setAboutContent] = useState<AboutContent>(storageService.getAboutContent());
  const [siteIdentity, setSiteIdentity] = useState<SiteIdentity>({
    brandName: 'RPIRSG',
    footerBrandName: 'RPIRSG',
    footerDescription: "Rajshahi Polytechnic Institute Rover Scout Group's official page. Any other pages of this page are not controlled by Rajshahi Polytechnic Institute Rover Scout Group."
  });
  const [members, setMembers] = useState<Member[]>(storageService.getMembers());
  const [roverInfo, setRoverInfo] = useState<RoverSection[]>(storageService.getRoverInfo());
  
  // Initialize Site Content Sync (DOM-based)
  useEffect(() => {
    initSiteContentSync();
    
    // Real-time About Content Update
    syncFirebasePathToState('siteContent/aboutContent', (newContent) => {
      if (newContent) {
        setAboutContent(newContent);
        storageService.setAboutContent(newContent);
      }
    });

    // Real-time Site Identity Update
    syncFirebasePathToState('siteContent/identity', (newIdentity) => {
      if (newIdentity) {
        setSiteIdentity(newIdentity);
      }
    });

    // Real-time Member Directory Update
    syncFirebasePathToState('members', (newMembers) => {
      if (Array.isArray(newMembers)) {
        setMembers(newMembers);
        storageService.setMembers(newMembers);
      }
    });

    // Real-time Banners Update
    syncFirebasePathToState('siteContent/banners', (newBanners) => {
      if (Array.isArray(newBanners)) {
        setBanners(newBanners);
        storageService.setBanners(newBanners);
      }
    });

    // Real-time Logo Update
    syncFirebasePathToState('siteContent/logoUrl', (newLogo) => {
      setLogo(newLogo);
      storageService.setLogo(newLogo);
    });

    // Real-time About Image Update
    syncFirebasePathToState('siteContent/aboutImage', (newImage) => {
      setAboutImage(newImage);
      storageService.setAboutImage(newImage);
    });

    // Real-time Rover Info Update
    syncFirebasePathToState('roverInfo', (newInfo) => {
      if (Array.isArray(newInfo)) {
        setRoverInfo(newInfo);
        storageService.setRoverInfo(newInfo);
      }
    });
  }, []);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('rover_scout_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('rover_scout_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  useEffect(() => {
    if (!isAdminView) {
      storageService.incrementViewCount();
    }
    // Note: We rely on Firebase sync for initial load too if available
  }, [isAdminView]);

  const handleLoginSuccess = (admin: AdminUser) => {
    setIsLoggedIn(true);
    setCurrentAdmin(admin);
    setShowLoginModal(false);
    setIsAdminView(true);
    storageService.addLog(admin, 'LOGIN', `Administrator logged in from dashboard.`);
  };

  const handleLogout = () => {
    if (currentAdmin) {
      storageService.addLog(currentAdmin, 'LOGOUT', `Administrator logged out safely.`);
    }
    setIsLoggedIn(false);
    setCurrentAdmin(null);
    setIsAdminView(false);
  };

  const toggleAdminView = () => {
    if (isLoggedIn) {
      setIsAdminView(!isAdminView);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogoUpdate = (newLogo: string | null) => {
    setLogo(newLogo);
    updateFirebasePath('siteContent/logoUrl', newLogo);
  };

  const handleBannersUpdate = (newBanners: string[]) => {
    setBanners(newBanners);
    updateFirebasePath('siteContent/banners', newBanners);
  };

  const handleAboutImageUpdate = (newImage: string | null) => {
    setAboutImage(newImage);
    updateFirebasePath('siteContent/aboutImage', newImage);
  };

  const handleAboutContentUpdate = (newContent: AboutContent) => {
    setAboutContent(newContent);
    updateFirebasePath('siteContent/aboutContent', newContent);
  };

  const handleIdentityUpdate = (newIdentity: SiteIdentity) => {
    setSiteIdentity(newIdentity);
    updateFirebasePath('siteContent/identity', newIdentity);
  };

  const handleMembersUpdate = (newMembers: Member[]) => {
    setMembers(newMembers);
    updateFirebasePath('members', newMembers);
  };

  const handleRoverInfoUpdate = (newInfo: RoverSection[]) => {
    setRoverInfo(newInfo);
    updateFirebasePath('roverInfo', newInfo);
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Navbar 
        onAdminClick={toggleAdminView} 
        isAdminView={isAdminView} 
        onLogoClick={() => setIsAdminView(false)}
        logo={logo}
        brandName={siteIdentity.brandName}
      />
      
      {isAdminView && isLoggedIn && currentAdmin ? (
        <main className="pt-20 bg-white dark:bg-slate-950">
          <AdminDashboard 
            currentAdmin={currentAdmin}
            onLogout={handleLogout} 
            logo={logo} 
            onLogoUpdate={handleLogoUpdate} 
            banners={banners}
            onBannersUpdate={handleBannersUpdate}
            aboutImage={aboutImage}
            onAboutImageUpdate={handleAboutImageUpdate}
            aboutContent={aboutContent}
            onAboutContentUpdate={handleAboutContentUpdate}
            siteIdentity={siteIdentity}
            onIdentityUpdate={handleIdentityUpdate}
            members={members}
            onMembersUpdate={handleMembersUpdate}
            roverInfo={roverInfo}
            onRoverInfoUpdate={handleRoverInfoUpdate}
          />
        </main>
      ) : (
        <main className="bg-white dark:bg-slate-950">
          <div id="home">
            <Hero banners={banners} />
          </div>
          <div id="about" className="bg-white dark:bg-slate-950">
            <About aboutImage={aboutImage} aboutContent={aboutContent} />
          </div>
          <div id="members" className="bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
            <Members members={members} />
          </div>
          <div id="rover-info" className="bg-white dark:bg-slate-950">
            <RoverInfo roverInfo={roverInfo} />
          </div>
          <div id="contact" className="bg-white dark:bg-slate-950">
            <Contact />
          </div>
          <Footer 
            onToggleTheme={toggleTheme} 
            currentTheme={theme} 
            brandName={siteIdentity.footerBrandName}
            description={siteIdentity.footerDescription}
          />
        </main>
      )}

      {showLoginModal && (
        <AdminLogin 
          onClose={() => setShowLoginModal(false)} 
          onSuccess={handleLoginSuccess} 
        />
      )}
      <Chatbot />
    </div>
  );
};

export default App;
