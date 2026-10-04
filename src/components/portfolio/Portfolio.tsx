import React, { useState } from 'react';
import { Flame, ArrowUpRight, Github, ExternalLink, Eye, Layers } from 'lucide-react';
import { ProjectModal } from './ProjectModal.js';
import type { Project } from '../../types/database.js';

interface PortfolioProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ projects, onProjectClick }) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ['ALL', 'WEB', 'APP', '3D', 'SYSTEM'];

  const filteredProjects = activeCategory === 'ALL'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const handleOpenDetail = (proj: Project) => {
    setSelectedProject(proj);
    onProjectClick(proj);
  };

  return (
    <section id="portfolio" className="relative py-28 border-t border-[#1a0505] bg-[#070202]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#FF1A1A] uppercase mb-2">
              <Flame className="w-3.5 h-3.5 text-[#FF1A1A]" />
              <span>SELECTED COMMISSIONS</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-white tracking-tight">
              FEATURED WORKS
            </h2>
            <div className="w-16 h-[2px] bg-[#E50914] mt-4" />
          </div>

          <div className="text-xs text-[#888888] font-mono-clean">
            HIGH-FIDELITY ARCHITECTURE · ZERO PLACEHOLDERS
          </div>
        </div>

        {/* Filter Controls (Buttons with click handlers) */}
        <div className="flex flex-wrap items-center gap-2 mb-12 pb-2 border-b border-[#1c0404]">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold tracking-wider transition-all duration-200 border ${
                  isActive
                    ? 'border-[#E50914] bg-[#E50914]/15 text-white shadow-[0_0_15px_rgba(229,9,20,0.3)]'
                    : 'border-[#1f0606] bg-[#0c0303] text-[#888888] hover:text-white hover:border-[#380909]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 2-Column Grid on Desktop, 1-Column on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleOpenDetail(project)}
              className="group cursor-pointer border border-[#1f0505] bg-[#090202] hover:border-[#E50914] hover:shadow-[0_0_35px_rgba(229,9,20,0.3)] transition-all duration-500 overflow-hidden flex flex-col justify-between"
            >
              {/* Image Frame with Zoom & Dark Gradient Scrim */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#060202]">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter contrast-110 brightness-90 group-hover:scale-105 group-hover:brightness-105 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090202] via-[#090202]/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Top Action Indicators */}
                <div className="absolute top-4 right-4 w-9 h-9 border border-[#3a0909] bg-[#0f0303]/90 backdrop-blur-sm flex items-center justify-center text-[#FF1A1A] group-hover:bg-[#E50914] group-hover:text-white group-hover:border-[#FF1A1A] transition-all">
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>

                {/* Bottom Left Category & Year */}
                <div className="absolute bottom-4 left-5 flex items-center gap-2 text-xs font-mono-clean text-[#D4D4D4]">
                  <span className="text-[#FF1A1A] font-semibold">{project.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.year}</span>
                </div>
              </div>

              {/* Text & Metadata Container */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white group-hover:text-[#FF1A1A] transition-colors leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#888888] line-clamp-2 leading-relaxed font-light">
                    {project.description}
                  </p>
                </div>

                {/* Zero-Pill Unboxed Technologies with Typographic Separator */}
                <div className="pt-3 border-t border-[#1a0404] flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono-clean text-[#A0A0A0]">
                    {project.technologies.slice(0, 4).map((tech, i) => (
                      <React.Fragment key={tech}>
                        <span>{tech}</span>
                        {i < Math.min(project.technologies.length, 4) - 1 && (
                          <span className="text-[#FF1A1A]/70" aria-hidden="true">/</span>
                        )}
                      </React.Fragment>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-[#666666]">+{project.technologies.length - 4}</span>
                    )}
                  </div>

                  <span className="text-[11px] text-[#FF1A1A] font-mono-clean flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>EXPLORE</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
