
import React, { useState, useEffect } from 'react';

interface HeroProps {
  banners: string[];
}

const Hero: React.FC<HeroProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) {
        setCurrentIndex(0);
        return;
    }
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <section className="relative h-[20vh] md:h-[180px] w-full bg-slate-100" id="home">
      {banners.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img 
            src={img} 
            alt="" 
            className="w-full h-full object-cover" 
            data-fb={`siteContent/banners/${index}`}
            data-type="src"
          />
        </div>
      ))}
    </section>
  );
};

export default Hero;
