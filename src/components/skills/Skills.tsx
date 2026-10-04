import React, { useState } from 'react';
import { Layers, Flame, CheckCircle2 } from 'lucide-react';
import { IconRenderer } from '../ui/IconRenderer.js';
import type { Skill } from '../../types/database.js';

interface SkillsProps {
  skills: Skill[];
}

export const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'Frontend',
    'Backend',
    'Database',
    'UI/UX',
    'DevOps',
    'Security',
    '3D / Creative',
  ];

  const filteredSkills = selectedCategory === 'ALL'
    ? skills
    : skills.filter(s => s.category === selectedCategory);

  return (
    <section id="skills" className="relative py-28 border-t border-[#1a0505] bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#FF1A1A] uppercase mb-2">
              <Flame className="w-3.5 h-3.5 text-[#FF1A1A]" />
              <span>CAPABILITIES & ARSENAL</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white tracking-tight">
              TECHNICAL EXPERTISE
            </h2>
            <div className="w-16 h-[2px] bg-[#E50914] mt-4" />
          </div>

          <div className="text-xs text-[#888888] font-mono-clean">
            CONTINUOUSLY BENCHMARKED · 2026 MATRIX
          </div>
        </div>

        {/* Interactive Filter Control Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-[#1c0404]">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold tracking-wider transition-all duration-200 border ${
                  isActive
                    ? 'border-[#E50914] bg-[#E50914]/15 text-white shadow-[0_0_15px_rgba(229,9,20,0.3)]'
                    : 'border-[#1f0606] bg-[#0c0303] text-[#888888] hover:text-white hover:border-[#380909]'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="group p-5 border border-[#1c0404] bg-[#080202] hover:border-[#E50914]/50 hover:bg-[#0e0303] transition-all duration-300 relative overflow-hidden"
            >
              {/* Corner Ambient Glow on Hover */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#E50914]/5 rounded-bl-full pointer-events-none group-hover:bg-[#E50914]/15 transition-colors" />

              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 border border-[#2d0707] bg-[#120303] flex items-center justify-center text-[#FF1A1A] group-hover:border-[#FF1A1A] group-hover:shadow-[0_0_15px_rgba(255,26,26,0.35)] transition-all">
                  <IconRenderer name={skill.iconName} className="w-5 h-5 text-[#FF1A1A]" />
                </div>
                <span className="text-[11px] font-mono-clean text-[#888888] group-hover:text-[#D4D4D4] transition-colors tabular-nums">
                  {skill.level}%
                </span>
              </div>

              <div className="space-y-1 mb-4">
                <h3 className="font-semibold text-sm text-white group-hover:text-[#FF1A1A] transition-colors">
                  {skill.name}
                </h3>
                <div className="text-[11px] text-[#666666] font-mono-clean uppercase">
                  {skill.category}
                </div>
              </div>

              {/* Crimson Energy Progress Bar */}
              <div className="w-full h-1 bg-[#1a0404] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#880000] via-[#E50914] to-[#FF1A1A] transition-all duration-1000 ease-out shadow-[0_0_8px_#FF1A1A]"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
