import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Flame, Shield, Lock } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'portfolio', label: 'PORTFOLIO' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'services', label: 'SERVICES' },
    { id: 'experience', label: 'EXPERIENCE' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080808]/90 backdrop-blur-md border-b border-[#E50914]/20 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.8)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark & Dragon Insignia */}
        <button
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF1A1A]"
        >
          <div className="w-8 h-8 rounded-none border border-[#E50914]/40 bg-[#160202] flex items-center justify-center text-[#FF1A1A] group-hover:border-[#FF1A1A] group-hover:shadow-[0_0_15px_rgba(255,26,26,0.5)] transition-all">
            <Flame className="w-4 h-4 animate-pulse text-[#FF1A1A]" />
          </div>
          <span className="font-cinzel text-lg sm:text-xl font-bold tracking-widest text-white group-hover:text-[#FF1A1A] transition-colors">
            RED DRAGON
          </span>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative text-xs tracking-widest font-semibold transition-all py-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF1A1A] ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-[#888888] hover:text-[#D4D4D4]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E50914] shadow-[0_0_8px_#FF1A1A]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Admin Lock */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenAdmin}
            aria-label="Admin Control Panel"
            className="p-2 border border-[#E50914]/30 hover:border-[#FF1A1A] bg-[#0c0404] text-[#888888] hover:text-white hover:shadow-[0_0_12px_rgba(255,26,26,0.3)] transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF1A1A]"
            title={isAdminLoggedIn ? 'Admin Panel Active' : 'Admin Portal'}
          >
            {isAdminLoggedIn ? (
              <Shield className="w-3.5 h-3.5 text-[#FF1A1A]" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-[#888888] hover:text-[#FF1A1A]" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className="group relative inline-flex items-center gap-2 px-4 py-2 border border-[#E50914] bg-[#0f0202] text-xs font-semibold tracking-wider text-white hover:bg-[#E50914] hover:shadow-[0_0_20px_rgba(229,9,20,0.5)] transition-all duration-200"
          >
            <span>LET&apos;S TALK</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#FF1A1A] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenAdmin}
            aria-label="Admin Panel"
            className="p-2 border border-[#E50914]/30 text-[#888888] bg-[#0d0404]"
          >
            <Lock className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 border border-[#E50914]/40 bg-[#140303] text-white hover:text-[#FF1A1A] transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[61px] bg-[#080808]/98 backdrop-blur-xl border-b border-[#E50914]/30 px-6 py-8 shadow-2xl transition-all">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between text-left py-2.5 text-sm tracking-widest font-semibold border-b border-[#200505] ${
                    isActive ? 'text-[#FF1A1A]' : 'text-[#D4D4D4] hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <div className="w-1.5 h-1.5 bg-[#FF1A1A] shadow-[0_0_8px_#FF1A1A]" />}
                </button>
              );
            })}

            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => handleNavClick('contact')}
                className="w-full py-3 border border-[#E50914] bg-[#E50914]/10 text-center text-xs font-bold tracking-widest text-white hover:bg-[#E50914] transition-all"
              >
                LET&apos;S TALK
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
