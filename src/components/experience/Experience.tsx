import React from 'react';
import { Flame, Briefcase, MapPin, Calendar } from 'lucide-react';
import type { Experience as ExperienceType } from '../../types/database.js';

interface ExperienceProps {
  experiences: ExperienceType[];
}

export const Experience: React.FC<ExperienceProps> = ({ experiences }) => {
  return (
    <section id="experience" className="relative py-28 border-t border-[#1a0505] bg-[#070202]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#FF1A1A] uppercase mb-2">
              <Flame className="w-3.5 h-3.5 text-[#FF1A1A]" />
              <span>CAREER CHRONICLE</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white tracking-tight">
              EXPERIENCE & TRACK RECORD
            </h2>
            <div className="w-16 h-[2px] bg-[#E50914] mt-4" />
          </div>

          <div className="text-xs text-[#888888] font-mono-clean">
            HIGH-IMPACT DELIVERABLES · ENTERPRISE TRUST
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-10 space-y-12 before:absolute before:left-2 sm:before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#E50914] before:via-[#420404] before:to-transparent">
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="relative group">
              {/* Timeline Red Anchor Node */}
              <div className="absolute -left-[29px] sm:-left-[37px] top-1.5 w-3.5 h-3.5 bg-[#070202] border-2 border-[#E50914] group-hover:bg-[#FF1A1A] group-hover:scale-125 group-hover:shadow-[0_0_12px_#FF1A1A] transition-all duration-300" />

              <div className="p-6 sm:p-8 border border-[#1c0404] bg-[#090202] group-hover:border-[#E50914]/50 group-hover:shadow-[0_0_30px_rgba(229,9,20,0.15)] transition-all">
                {/* Year & Location */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono-clean text-[#FF1A1A] font-bold tracking-widest">
                    {exp.year}
                  </span>
                  {exp.location && (
                    <span className="text-[11px] font-mono-clean text-[#666666] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#FF1A1A]" />
                      <span>{exp.location}</span>
                    </span>
                  )}
                </div>

                {/* Role and Company */}
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white group-hover:text-[#FF1A1A] transition-colors mb-1">
                  {exp.role}
                </h3>
                <div className="text-xs font-semibold text-[#888888] tracking-wider uppercase mb-3">
                  {exp.company}
                </div>

                {/* Description */}
                <p className="text-sm text-[#D4D4D4] font-light leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
