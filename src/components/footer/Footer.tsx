import React from 'react';
import { Flame, ArrowUp, Github, Linkedin, Twitter, Instagram, Youtube, Radio } from 'lucide-react';
import type { SocialLink, SiteSetting } from '../../types/database.js';

interface FooterProps {
  settings?: SiteSetting;
  socialLinks: SocialLink[];
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  socialLinks,
  onNavigate,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github': return <Github className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'x': case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      default: return <Radio className="w-4 h-4" />;
    }
  };

  return (
    <footer className="relative bg-[#040101] text-[#888888] overflow-hidden">
      {/* Red Glowing Line on Top of Footer */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent shadow-[0_0_15px_#FF1A1A]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start justify-between">
          {/* Brand & Short Description (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 border border-[#E50914]/50 bg-[#160202] flex items-center justify-center text-[#FF1A1A]">
                <Flame className="w-4 h-4" />
              </div>
              <span className="font-cinzel text-lg font-bold tracking-widest text-white">
                RED DRAGON
              </span>
            </div>
            <p className="text-xs text-[#888888] leading-relaxed max-w-sm">
              {settings?.bio || 'Dark cinematic personal portfolio. Engineering futuristic digital experiences, high-throughput distributed systems, and real-time WebGL graphics.'}
            </p>
          </div>

          {/* Navigation Links (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-mono-clean tracking-widest text-[#FF1A1A] uppercase">
              INDEX DIRECTORY
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => onNavigate('hero')} className="text-left hover:text-white transition-colors">
                HOME
              </button>
              <button onClick={() => onNavigate('about')} className="text-left hover:text-white transition-colors">
                ABOUT
              </button>
              <button onClick={() => onNavigate('portfolio')} className="text-left hover:text-white transition-colors">
                PORTFOLIO
              </button>
              <button onClick={() => onNavigate('skills')} className="text-left hover:text-white transition-colors">
                SKILLS
              </button>
              <button onClick={() => onNavigate('services')} className="text-left hover:text-white transition-colors">
                SERVICES
              </button>
              <button onClick={() => onNavigate('contact')} className="text-left hover:text-white transition-colors">
                CONTACT
              </button>
            </div>
          </div>

          {/* Socials & Back to Top (3 cols) */}
          <div className="md:col-span-3 space-y-4 md:text-right">
            <div className="text-xs font-mono-clean tracking-widest text-[#FF1A1A] uppercase">
              CONNECT
            </div>
            <div className="flex md:justify-end gap-3">
              {socialLinks.map((soc) => (
                <a
                  key={soc.id}
                  href={soc.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={soc.platform}
                  className="p-2 border border-[#200505] bg-[#090202] text-[#888888] hover:text-white hover:border-[#FF1A1A] transition-all"
                >
                  {getSocialIcon(soc.platform)}
                </a>
              ))}
            </div>

            <div>
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 text-xs text-[#888888] hover:text-[#FF1A1A] transition-colors"
              >
                <span>BACK TO APEX</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quiet Copyright Row */}
        <div className="mt-12 pt-6 border-t border-[#140303] flex flex-col sm:flex-row items-center justify-between text-xs text-[#555555] gap-4">
          <div>
            &copy; 2026 {settings?.name || 'KAI VALEN'}. ALL RIGHTS RESERVED.
          </div>
          <div className="font-mono-clean text-[11px] text-[#444444]">
            SYNTHESIZED WITH NEXT-GEN WEBGL &amp; TYPESCRIPT
          </div>
        </div>
      </div>
    </footer>
  );
};
