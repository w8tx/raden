import React from 'react';
import { Flame, Compass, Cpu, Target, Award, ArrowUpRight } from 'lucide-react';
import type { SiteSetting } from '../../types/database.js';

interface AboutProps {
  settings?: SiteSetting;
  onExploreProjects: () => void;
}

export const About: React.FC<AboutProps> = ({ settings, onExploreProjects }) => {
  const stats = [
    { label: 'YEARS EXPERIENCE', value: settings?.yearsExperience || '08+' },
    { label: 'DELIVERED PROJECTS', value: settings?.completedProjects || '42+' },
    { label: 'CORE TECHNOLOGIES', value: settings?.techCount || '24+' },
    { label: 'COMMITMENT & PASSION', value: settings?.passionRate || '100%' },
  ];

  const milestones = [
    { year: '2024', status: 'INITIATION', title: 'Deep Cyber Systems', desc: 'Explored kernel telemetry, decentralized protocols, and low-latency network backbones.' },
    { year: '2025', status: 'ACCELERATION', title: 'Spatial 3D & WebGL', desc: 'Crafted high-fidelity WebGL graphics engines, custom GLSL shaders, and interactive audio visualizers.' },
    { year: '2026', status: 'PINNACLE', title: 'Red Dragon Architecture', desc: 'Synthesizing distributed backend resilience with cutting-edge cinematic dark interfaces.' },
    { year: 'FUTURE', status: 'EXPANSION', title: 'Autonomous Reality', desc: 'Pioneering next-generation spatial computing interfaces and AI-accelerated developer toolchains.' },
  ];

  return (
    <section id="about" className="relative py-28 border-t border-[#1a0505] bg-[#070202]">
      {/* Subtle Crimson Ambient */}
      <div
        className="absolute top-1/2 left-0 w-96 h-96 -translate-y-1/2 rounded-full pointer-events-none opacity-15 filter blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(229,9,20,0.5) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#FF1A1A] uppercase mb-2">
            <Flame className="w-3.5 h-3.5 text-[#FF1A1A]" />
            <span>IDENTITY & DISCIPLINE</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white tracking-tight">
            ABOUT ME
          </h2>
          <div className="w-16 h-[2px] bg-[#E50914] mt-4" />
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Portrait Frame (5 cols) */}
          <div className="lg:col-span-5 relative group">
            {/* Geometric Accent Borders */}
            <div className="absolute -inset-2 border border-[#E50914]/20 group-hover:border-[#E50914]/50 transition-colors pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF1A1A]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF1A1A]" />

            <div className="relative aspect-[4/5] overflow-hidden bg-[#0c0303] border border-[#260505]">
              <img
                src={settings?.avatarUrl || '/src/assets/images/portrait_creator_director_1791114835688.jpg'}
                alt={settings?.name || 'Creative Developer Portrait'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter contrast-110 grayscale-[25%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070202] via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-[11px] tracking-widest text-[#FF1A1A] font-semibold uppercase mb-1">
                  ARCHITECT DIRECTORY
                </div>
                <div className="font-cinzel text-xl font-bold text-white tracking-wider">
                  {settings?.name || 'KAI VALEN'}
                </div>
                <div className="text-xs text-[#888888] font-mono-clean mt-0.5">
                  TOKYO · SAN FRANCISCO · WORLDWIDE
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative, Statistics & Journey (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-4">
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white leading-snug">
                FUSING RELENTLESS PERFORMANCE WITH AVANT-GARDE VISUAL ATMOSPHERE.
              </h3>
              <p className="text-sm sm:text-base text-[#D4D4D4] leading-relaxed font-light">
                I am a full-stack digital architect specializing in high-performance web systems, bespoke WebGL 3D spatial environments, and mission-critical cloud backends. With a background spanning systems programming and cinematic motion design, I reject sluggish, cookie-cutter templates in favor of bespoke software craftsmanship.
              </p>
              <p className="text-sm sm:text-base text-[#888888] leading-relaxed font-light">
                Whether deploying low-latency WebSocket order books or orchestrating WebGL particle fields at 120 FPS, every project is engineered with mathematical precision, surgical type hierarchy, and relentless reliability.
              </p>
            </div>

            {/* Statistics Bar - Zero-pill clean numbers with tabular figures */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 pb-4 border-y border-[#1f0505]">
              {stats.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white tabular-nums tracking-tight">
                    <span className="text-white">{stat.value}</span>
                  </div>
                  <div className="text-[11px] font-medium tracking-widest text-[#888888] uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline Milestones */}
            <div className="space-y-4">
              <div className="text-xs font-semibold tracking-widest text-[#FF1A1A] uppercase">
                STRATEGIC ROADMAP
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-[#200505] bg-[#0c0303]/80 hover:border-[#E50914]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-mono-clean text-[#FF1A1A] mb-1">
                      <span>{m.year}</span>
                      <span className="text-[10px] text-[#888888]">{m.status}</span>
                    </div>
                    <div className="font-semibold text-sm text-white mb-1">
                      {m.title}
                    </div>
                    <p className="text-xs text-[#888888] leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onExploreProjects}
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-white hover:text-[#FF1A1A] transition-colors group"
              >
                <span>EXPLORE SELECTED ARCHITECTURAL WORKS</span>
                <ArrowUpRight className="w-4 h-4 text-[#FF1A1A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
