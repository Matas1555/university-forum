import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import ForumMegaPanel from './ForumMegaPanel';

const MegaMenu = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = (menuName) => {
    // Clear any existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Only show mega menu for 'forumai'
    if (menuName === 'forumai') {
      setActiveMenu(menuName);
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);

      setTimeout(() => {
        if (!isVisible) setActiveMenu(null);
      }, 300); 
    }, 150); 
  };

  const handleMenuEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(true);
  };

  return (
    <div className="relative hidden md:block">
      <div className="flex gap-6 items-center">
        <div className='flex gap-1 items-center'>
            <NavLink 
                to="/forumai"
                className="text-white hover:text-lght-blue transition-colors duration-150"
                onMouseEnter={() => handleMouseEnter('forumai')}
                >
                Forumai
            </NavLink>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-white">
            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>

        </div>
        <NavLink 
          to="/universitetai"
          className="text-white hover:text-lght-blue transition-colors duration-150"
        >
          Universitetai
        </NavLink>
        <NavLink 
          to="/destytojai"
          className="text-white hover:text-lght-blue transition-colors duration-150"
        >
          Dėstytojai
        </NavLink>
      </div>

      {/* Mega Menu Panel Container - Only for Forumai */}
      <div 
        className={`fixed left-0 w-screen top-20 bg-dark border-t border-light-grey shadow-lg shadow-white/10 transition-all duration-400 ease-in-out z-50 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        onMouseEnter={handleMenuEnter}
        onMouseLeave={handleMouseLeave}
      >
        {activeMenu === 'forumai' && <ForumMegaPanel />}
      </div>
    </div>
  );
};

export default MegaMenu; 