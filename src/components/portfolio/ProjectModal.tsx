import React, { useEffect } from 'react';
import { X, ExternalLink, Github, ArrowRight, ShieldCheck, CheckCircle2, Calendar, Layers, Eye } from 'lucide-react';
import type { Project } from '../../types/database.js';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#090303] border border-[#2e0707] shadow-[0_0_60px_rgba(229,9,20,0.25)] text-left my-8 z-10 overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#200505] bg-[#0c0404]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono-clean text-[#FF1A1A] font-semibold">
              CASE STUDY // {project.year}
            </span>
            <span className="text-[#444444]" aria-hidden="true">·</span>
            <span className="text-xs text-[#888888] font-mono-clean uppercase">
              {project.category}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close project modal"
            className="p-1.5 border border-[#300808] hover:border-[#FF1A1A] text-[#888888] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* Hero Image Container */}
          <div className="relative aspect-[16/9] w-full overflow-hidden border border-[#2a0606] bg-[#050202]">
            <img
              src={project.thumbnail}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090303] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono-clean text-[#D4D4D4]">
                <Eye className="w-3.5 h-3.5 text-[#FF1A1A]" />
                <span>{project.views} Interactive Impressions</span>
              </div>
            </div>
          </div>

          {/* Title and Summary */}
          <div className="space-y-3">
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white tracking-wide">
              {project.title}
            </h2>
            <p className="text-base text-[#D4D4D4] leading-relaxed font-light">
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Technologies Used (Zero-pill typographic separator) */}
          <div className="p-4 border border-[#200505] bg-[#0c0404]">
            <div className="text-[11px] font-mono-clean tracking-widest text-[#888888] uppercase mb-2">
              TECHNOLOGY MATRIX
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#D4D4D4] font-mono-clean">
              {project.technologies.map((tech, i) => (
                <React.Fragment key={tech}>
                  <span className="text-white font-medium">{tech}</span>
                  {i < project.technologies.length - 1 && (
                    <span className="text-[#FF1A1A]" aria-hidden="true">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Challenge & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 border border-[#250505] bg-[#0b0303] space-y-2">
              <div className="text-xs font-mono-clean text-[#FF1A1A] font-semibold uppercase">
                01. THE ARCHITECTURAL CHALLENGE
              </div>
              <p className="text-sm text-[#D4D4D4] leading-relaxed">
                {project.challenge}
              </p>
            </div>

            <div className="p-5 border border-[#250505] bg-[#0b0303] space-y-2">
              <div className="text-xs font-mono-clean text-[#FF1A1A] font-semibold uppercase">
                02. THE ENGINEERED SOLUTION
              </div>
              <p className="text-sm text-[#D4D4D4] leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-mono-clean text-[#FF1A1A] font-semibold uppercase">
                CORE CAPABILITIES & ATTRIBUTES
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 border border-[#1a0404] bg-[#080202]">
                    <CheckCircle2 className="w-4 h-4 text-[#FF1A1A] shrink-0 mt-0.5" />
                    <span className="text-xs text-[#D4D4D4] leading-relaxed">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Metric */}
          {project.results && (
            <div className="p-4 border-l-2 border-[#E50914] bg-[#120303]">
              <div className="text-[11px] font-mono-clean text-[#888888] uppercase mb-1">
                MEASURED IMPACT
              </div>
              <div className="text-sm font-semibold text-white">
                {project.results}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#200505]">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E50914] text-white text-xs font-bold tracking-wider hover:bg-[#FF1A1A] hover:shadow-[0_0_20px_rgba(255,26,26,0.5)] transition-all"
              >
                <span>LAUNCH LIVE DEMO</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {project.sourceUrl && (
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#380808] bg-[#0d0404] text-xs font-bold tracking-wider text-[#D4D4D4] hover:text-white hover:border-[#FF1A1A] transition-all"
              >
                <Github className="w-3.5 h-3.5" />
                <span>INSPECT SOURCE CODE</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="ml-auto text-xs text-[#888888] hover:text-white transition-colors"
            >
              CLOSE PREVIEW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
