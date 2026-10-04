import React, { useState, useEffect } from 'react';
import { Navbar } from './components/navbar/Navbar.js';
import { Hero } from './components/hero/Hero.js';
import { About } from './components/about/About.js';
import { Portfolio } from './components/portfolio/Portfolio.js';
import { Skills } from './components/skills/Skills.js';
import { Services } from './components/services/Services.js';
import { Experience } from './components/experience/Experience.js';
import { Contact } from './components/contact/Contact.js';
import { Footer } from './components/footer/Footer.js';
import { CustomCursor } from './components/ui/CustomCursor.js';
import { BackgroundParticles } from './components/particles/BackgroundParticles.js';
import { AdminLoginModal } from './components/admin/AdminLoginModal.js';
import { AdminDashboard } from './components/admin/AdminDashboard.js';
import { Flame, RefreshCw, AlertCircle } from 'lucide-react';
import type { Project, Skill, Service, Experience as ExperienceType, SocialLink, SiteSetting } from './types/database.js';

export default function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Backend Data States
  const [settings, setSettings] = useState<SiteSetting | undefined>(undefined);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [contactSubject, setContactSubject] = useState<string>('');

  // Admin Auth States
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('reddragon_admin_token');
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Cinematic Intro sequence (1.2 seconds max)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroFinished(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Fetch Public Data
  const fetchData = async () => {
    try {
      const [resSett, resProj, resSkill, resSrv, resExp, resSoc] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/projects'),
        fetch('/api/skills'),
        fetch('/api/services'),
        fetch('/api/experiences'),
        fetch('/api/social-links'),
      ]);

      if (resSett.ok) setSettings(await resSett.json());
      if (resProj.ok) setProjects(await resProj.json());
      if (resSkill.ok) setSkills(await resSkill.json());
      if (resSrv.ok) setServices(await resSrv.json());
      if (resExp.ok) setExperiences(await resExp.json());
      if (resSoc.ok) setSocialLinks(await resSoc.json());
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
    }
  };

  useEffect(() => {
    fetchData();

    // Track Visitor Telemetry
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: window.location.pathname,
        deviceType,
        referrer: document.referrer || undefined,
      }),
    }).catch(() => {});
  }, []);

  // Check existing admin session
  useEffect(() => {
    if (adminToken) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
        .then((res) => {
          if (!res.ok) {
            localStorage.removeItem('reddragon_admin_token');
            setAdminToken(null);
          }
        })
        .catch(() => {
          localStorage.removeItem('reddragon_admin_token');
          setAdminToken(null);
        });
    }
  }, [adminToken]);

  // Section Observer for Active Navigation
  useEffect(() => {
    const sections = ['hero', 'about', 'portfolio', 'skills', 'services', 'experience', 'contact'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRequestService = (serviceTitle: string) => {
    setContactSubject(serviceTitle);
    handleNavigate('contact');
  };

  const handleAdminSuccess = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('reddragon_admin_token', token);
    setIsAdminDashboardOpen(true);
  };

  const handleAdminLogout = () => {
    if (adminToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      }).catch(() => {});
    }
    localStorage.removeItem('reddragon_admin_token');
    setAdminToken(null);
    setIsAdminDashboardOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#D4D4D4] font-sans-clean overflow-x-hidden">
      {/* Cinematic Intro Splash Screen */}
      {!introFinished && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-700">
          <div className="relative flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-[#E50914] bg-[#160202] flex items-center justify-center text-[#FF1A1A] animate-pulse shadow-[0_0_40px_#FF1A1A]">
              <Flame className="w-6 h-6" />
            </div>
            <div className="font-cinzel text-xl font-bold tracking-[0.3em] text-white">
              RED DRAGON
            </div>
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent animate-pulse" />
          </div>
        </div>
      )}

      {/* Desktop Custom Cursor */}
      <CustomCursor />

      {/* Interactive Background Particle Field */}
      <BackgroundParticles />

      {/* Primary Fixed Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAdmin={() => {
          if (adminToken) {
            setIsAdminDashboardOpen(true);
          } else {
            setIsAdminModalOpen(true);
          }
        }}
        isAdminLoggedIn={!!adminToken}
      />

      {/* Content Sections */}
      <main id="main-content">
        <Hero
          settings={settings}
          onViewPortfolio={() => handleNavigate('portfolio')}
          onContactMe={() => handleNavigate('contact')}
        />

        <About
          settings={settings}
          onExploreProjects={() => handleNavigate('portfolio')}
        />

        <Portfolio
          projects={projects}
          onProjectClick={(proj) => {
            fetch(`/api/projects/${proj.slug}`).catch(() => {});
          }}
        />

        <Skills skills={skills} />

        <Services
          services={services}
          onRequestService={handleRequestService}
        />

        <Experience experiences={experiences} />

        <Contact
          settings={settings}
          socialLinks={socialLinks}
          initialSubject={contactSubject}
        />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        socialLinks={socialLinks}
        onNavigate={handleNavigate}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      {/* Full Admin Dashboard Console */}
      {isAdminDashboardOpen && adminToken && (
        <AdminDashboard
          token={adminToken}
          onLogout={handleAdminLogout}
          onClose={() => setIsAdminDashboardOpen(false)}
          onDataChanged={fetchData}
        />
      )}
    </div>
  );
}
