import React from 'react';
import { Flame, CheckCircle2 } from 'lucide-react';
import { IconRenderer } from '../ui/IconRenderer.js';
import type { Service } from '../../types/database.js';

interface ServicesProps {
  services: Service[];
  onRequestService: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ services, onRequestService }) => {
  return (
    <section id="services" className="relative py-28 border-t border-[#1a0505] bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#FF1A1A] uppercase mb-2">
              <Flame className="w-3.5 h-3.5 text-[#FF1A1A]" />
              <span>DISCIPLINE & SOLUTIONS</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white tracking-tight">
              WHAT I DO
            </h2>
            <div className="w-16 h-[2px] bg-[#E50914] mt-4" />
          </div>

          <div className="text-xs text-[#888888] font-mono-clean">
            HIGH-THROUGHPUT ENGINEERING · ZERO FLUFF
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
          {services.map((srv, idx) => (
            <div
              key={srv.id}
              className="group p-8 border border-[#1c0404] bg-[#090202] hover:border-[#E50914] hover:shadow-[0_0_35px_rgba(229,9,20,0.25)] transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Subtle Red Energy Accent on Top Border */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E50914]/0 to-transparent group-hover:via-[#E50914] transition-all duration-500" />

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 border border-[#2b0606] bg-[#120303] flex items-center justify-center text-[#FF1A1A] group-hover:border-[#FF1A1A] group-hover:shadow-[0_0_20px_rgba(255,26,26,0.4)] group-hover:scale-105 transition-all">
                    <IconRenderer name={srv.iconName} className="w-6 h-6 text-[#FF1A1A]" />
                  </div>
                  <span className="text-xs font-mono-clean text-[#666666] tracking-widest">
                    0{idx + 1} // DISCIPLINE
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white group-hover:text-[#FF1A1A] transition-colors tracking-wide">
                    {srv.title}
                  </h3>
                  <p className="text-sm text-[#888888] leading-relaxed font-light">
                    {srv.description}
                  </p>
                </div>

                {/* Features List */}
                {srv.features && srv.features.length > 0 && (
                  <div className="pt-2 space-y-2 border-t border-[#180303]">
                    {srv.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2.5 text-xs text-[#C0C0C0]">
                        <div className="w-1 h-1 bg-[#FF1A1A]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onRequestService(srv.title)}
                  className="w-full py-2.5 border border-[#2c0707] bg-[#0d0303] hover:border-[#E50914] hover:bg-[#E50914]/10 text-xs font-semibold tracking-widest text-[#D4D4D4] hover:text-white transition-all text-center"
                >
                  COMMISSION ARCHITECTURE
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
