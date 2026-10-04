import React from 'react';
import { ArrowRight, Mail, Briefcase, Sparkles, Flame, Terminal } from 'lucide-react';
import { DragonCanvas } from '../dragon/DragonCanvas.js';
import type { SiteSetting } from '../../types/database.js';

interface HeroProps {
  settings?: SiteSetting;
  onViewPortfolio: () => void;
  onContactMe: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onViewPortfolio,
  onContactMe,
}) => {
  return (
    <section id="hero" className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Radial Red Ambient Glow */}
      <div
        className="absolute top-1/3 right-1/4 w-[500px] h-[500px] -translate-y-1/2 rounded-full pointer-events-none opacity-25 filter blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(229,9,20,0.4) 0%, rgba(110,0,0,0.15) 50%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Grid Overlay Texture (Subtle) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center min-h-[calc(100vh-140px)]">
          {/* Left Column: Typography & CTAs (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6">
            {/* Small Label Kicker */}
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] text-[#FF1A1A] uppercase font-semibold">
              <span className="w-2 h-2 bg-[#FF1A1A] animate-ping" />
              <span>{settings?.title || 'CREATIVE DEVELOPER'}</span>
              <span className="text-[#888888] font-normal">/ 2026 ARCHITECTURE</span>
            </div>

            {/* Massive Heading */}
            <h1 className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
              TURNING <br />
              <span className="bg-gradient-to-r from-[#FF1A1A] via-[#E50914] to-[#880000] bg-clip-text text-transparent dragon-text-glow">
                IDEAS
              </span>{' '}
              INTO <br />
              DIGITAL <br />
              <span className="text-white relative inline-block">
                EXPERIENCES.
                <span className="absolute -bottom-1 left-0 w-24 h-[2px] bg-[#E50914]" />
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#D4D4D4] max-w-xl font-light leading-relaxed font-sans-clean">
              {settings?.bio || 'Building immersive digital experiences with technology, design and creativity. Combining raw computational power with dark cinematic visual identities.'}
            </p>

            {/* Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onViewPortfolio}
                className="group relative px-6 py-3.5 bg-[#E50914] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:bg-[#FF1A1A] hover:shadow-[0_0_25px_rgba(255,26,26,0.6)] flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF1A1A]"
              >
                <span>VIEW PORTFOLIO</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onContactMe}
                className="group px-6 py-3.5 border border-[#3A0000] bg-[#0c0303]/80 hover:border-[#E50914] hover:bg-[#180404] text-xs font-bold tracking-widest uppercase text-[#D4D4D4] hover:text-white transition-all duration-300 flex items-center gap-2.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF1A1A]"
              >
                <Mail className="w-4 h-4 text-[#FF1A1A] group-hover:scale-110 transition-transform" />
                <span>CONTACT ME</span>
              </button>
            </div>

            {/* Floating Information Cards */}
            <div className="pt-6 grid grid-cols-2 gap-3 sm:gap-4 max-w-md">
              <div className="p-3.5 border border-[#200505] bg-[#0a0303]/90 backdrop-blur-sm transition-all hover:border-[#E50914]/40">
                <div className="flex items-center gap-2 text-[10px] tracking-widest text-[#888888] uppercase mb-1">
                  <Terminal className="w-3 h-3 text-[#FF1A1A]" />
                  <span>SPECIALIZATION</span>
                </div>
                <div className="text-xs font-semibold tracking-wider text-white">
                  FULL STACK & 3D CREATIVE
                </div>
              </div>

              <div className="p-3.5 border border-[#200505] bg-[#0a0303]/90 backdrop-blur-sm transition-all hover:border-[#E50914]/40">
                <div className="flex items-center gap-2 text-[10px] tracking-widest text-[#888888] uppercase mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF1A1A] animate-pulse" />
                  <span>STATUS</span>
                </div>
                <div className="text-xs font-semibold tracking-wider text-[#FF1A1A]">
                  AVAILABLE FOR COMMISSIONS
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Red Dragon Canvas (5 cols on desktop, responsive background on mobile) */}
          <div className="lg:col-span-5 relative w-full h-[380px] sm:h-[480px] lg:h-[620px] flex items-center justify-center">
            {/* Soft Ambient Ring */}
            <div className="absolute inset-0 rounded-full border border-[#E50914]/10 pointer-events-none scale-90 animate-[spin_60s_linear_infinite]" />

            {/* 3D Dragon Interactive Canvas */}
            <DragonCanvas className="w-full h-full" isHero={true} />
          </div>
        </div>
      </div>
    </section>
  );
};
