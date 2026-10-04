import React, { useState, useEffect } from 'react';
import {
  X,
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Wrench,
  History,
  Inbox,
  Sliders,
  BarChart3,
  Plus,
  Trash2,
  Edit,
  Save,
  LogOut,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Mail,
  Shield,
  ExternalLink
} from 'lucide-react';
import type { Project, Skill, Service, Experience, Message, SiteSetting } from '../../types/database.js';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
  onClose: () => void;
  onDataChanged: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  onLogout,
  onClose,
  onDataChanged,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'skills' | 'services' | 'experiences' | 'messages' | 'settings' | 'analytics'>('overview');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Data states
  const [analytics, setAnalytics] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<SiteSetting | null>(null);

  // Edit / Form modals or states
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingExperience, setEditingExperience] = useState<Partial<Experience> | null>(null);

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [resProj, resSkill, resSrv, resExp, resMsg, resSett, resAnal] = await Promise.all([
        fetch('/api/admin/projects', { headers: authHeaders }),
        fetch('/api/skills'),
        fetch('/api/services'),
        fetch('/api/experiences'),
        fetch('/api/admin/messages', { headers: authHeaders }),
        fetch('/api/settings'),
        fetch('/api/admin/analytics', { headers: authHeaders }),
      ]);

      if (resProj.ok) setProjects(await resProj.json());
      if (resSkill.ok) setSkills(await resSkill.json());
      if (resSrv.ok) setServices(await resSrv.json());
      if (resExp.ok) setExperiences(await resExp.json());
      if (resMsg.ok) setMessages(await resMsg.json());
      if (resSett.ok) setSettings(await resSett.json());
      if (resAnal.ok) setAnalytics(await resAnal.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // --- Projects Handlers ---
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const isNew = !editingProject.id;
      const url = isNew ? '/api/admin/projects' : `/api/admin/projects/${editingProject.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(editingProject),
      });

      if (!res.ok) throw new Error('Failed to save project');
      showFeedback('Project preserved successfully');
      setEditingProject(null);
      loadAllData();
      onDataChanged();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to permanently purge this project?')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE', headers: authHeaders });
      if (!res.ok) throw new Error('Purge failed');
      showFeedback('Project purged');
      loadAllData();
      onDataChanged();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // --- Skills Handlers ---
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    try {
      const isNew = !editingSkill.id;
      const url = isNew ? '/api/admin/skills' : `/api/admin/skills/${editingSkill.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(editingSkill),
      });
      if (!res.ok) throw new Error('Failed to save skill');
      showFeedback('Skill synchronized');
      setEditingSkill(null);
      loadAllData();
      onDataChanged();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Delete skill entry?')) return;
    try {
      await fetch(`/api/admin/skills/${id}`, { method: 'DELETE', headers: authHeaders });
      showFeedback('Skill deleted');
      loadAllData();
      onDataChanged();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // --- Messages Handlers ---
  const handleUpdateMessageStatus = async (id: string, status: Message['status']) => {
    try {
      await fetch(`/api/admin/messages/${id}/status`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ status }),
      });
      showFeedback(`Message status set to ${status}`);
      loadAllData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Purge transmission record?')) return;
    try {
      await fetch(`/api/admin/messages/${id}`, { method: 'DELETE', headers: authHeaders });
      showFeedback('Transmission purged');
      loadAllData();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // --- Settings Handlers ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Settings update failed');
      showFeedback('Site settings committed');
      loadAllData();
      onDataChanged();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Red Dragon Command Console"
      className="fixed inset-0 z-50 flex flex-col bg-[#050202] text-[#D4D4D4] overflow-hidden"
    >
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#240505] bg-[#090202]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-[#E50914] bg-[#160202] flex items-center justify-center text-[#FF1A1A]">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-cinzel text-base font-bold text-white tracking-widest">
              RED DRAGON COMMAND CONSOLE
            </h1>
            <div className="text-[10px] font-mono-clean text-[#888888]">
              AUTHENTICATED ROOT // v2.6.4
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {feedback && (
            <div className={`px-3 py-1 text-xs border ${feedback.type === 'success' ? 'border-[#0d5924] bg-[#03200c] text-emerald-300' : 'border-[#800f0f] bg-[#290404] text-[#FF8888]'}`}>
              {feedback.text}
            </div>
          )}

          <button
            onClick={loadAllData}
            title="Refresh Data"
            aria-label="Refresh Data"
            className="p-2 border border-[#2d0707] hover:border-[#FF1A1A] text-[#888888] hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onLogout}
            title="Terminate Session"
            aria-label="Terminate Session"
            className="p-2 border border-[#2d0707] hover:border-[#FF1A1A] text-[#888888] hover:text-[#FF1A1A]"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            title="Exit Console"
            aria-label="Exit Console"
            className="p-2 border border-[#2d0707] hover:border-[#FF1A1A] text-[#888888] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-64 border-r border-[#1f0505] bg-[#080202] p-4 flex flex-col justify-between shrink-0">
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard },
              { id: 'projects', label: 'PROJECTS', icon: FolderGit2, badge: projects.length },
              { id: 'skills', label: 'SKILLS', icon: Cpu, badge: skills.length },
              { id: 'services', label: 'SERVICES', icon: Wrench },
              { id: 'experiences', label: 'EXPERIENCE', icon: History },
              { id: 'messages', label: 'INBOX TRANSMISSIONS', icon: Inbox, badge: messages.filter(m => m.status === 'NEW').length, badgeColor: 'bg-[#E50914]' },
              { id: 'settings', label: 'SITE SETTINGS', icon: Sliders },
              { id: 'analytics', label: 'ANALYTICS', icon: BarChart3 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-mono-clean font-semibold border transition-all text-left ${
                    isActive
                      ? 'border-[#E50914] bg-[#E50914]/15 text-white shadow-[0_0_15px_rgba(229,9,20,0.25)]'
                      : 'border-transparent text-[#888888] hover:text-white hover:bg-[#120303]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF1A1A]' : 'text-[#666666]'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`px-1.5 py-0.2 text-[10px] font-mono-clean rounded-none text-white ${tab.badgeColor || 'bg-[#220505] text-[#888888]'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#180303] text-[10px] font-mono-clean text-[#555555]">
            DATABASE: LOCAL FILE-PERSISTED ACID
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-[#050202]">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-cinzel text-xl font-bold text-white tracking-wide">
                  OPERATIONAL OVERVIEW
                </h2>
                <div className="text-xs text-[#888888] font-mono-clean mt-1">
                  High-level telemetry and status markers
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 border border-[#200505] bg-[#090202]">
                  <div className="text-[11px] font-mono-clean text-[#888888] uppercase mb-1">
                    TOTAL COMMISSIONS
                  </div>
                  <div className="font-cinzel text-3xl font-bold text-white tabular-nums">
                    {projects.length}
                  </div>
                  <div className="text-[10px] text-[#666666] font-mono-clean mt-1">
                    {projects.filter(p => p.published).length} Published to Showcase
                  </div>
                </div>

                <div className="p-5 border border-[#200505] bg-[#090202]">
                  <div className="text-[11px] font-mono-clean text-[#888888] uppercase mb-1">
                    INCOMING TRANSMISSIONS
                  </div>
                  <div className="font-cinzel text-3xl font-bold text-white tabular-nums">
                    {messages.length}
                  </div>
                  <div className="text-[10px] text-[#FF1A1A] font-mono-clean mt-1 font-semibold">
                    {messages.filter(m => m.status === 'NEW').length} Pending Inspection
                  </div>
                </div>

                <div className="p-5 border border-[#200505] bg-[#090202]">
                  <div className="text-[11px] font-mono-clean text-[#888888] uppercase mb-1">
                    TOTAL PAGE VISITS
                  </div>
                  <div className="font-cinzel text-3xl font-bold text-white tabular-nums">
                    {analytics?.totalViews || 1}
                  </div>
                  <div className="text-[10px] text-[#666666] font-mono-clean mt-1">
                    {analytics?.viewsLast24h || 1} in the last 24h
                  </div>
                </div>

                <div className="p-5 border border-[#200505] bg-[#090202]">
                  <div className="text-[11px] font-mono-clean text-[#888888] uppercase mb-1">
                    REGISTERED SKILLS
                  </div>
                  <div className="font-cinzel text-3xl font-bold text-white tabular-nums">
                    {skills.length}
                  </div>
                  <div className="text-[10px] text-[#666666] font-mono-clean mt-1">
                    7 Core Specialization Tracks
                  </div>
                </div>
              </div>

              {/* Popular Projects & Recent Transmissions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 border border-[#200505] bg-[#080202] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1a0404] pb-3">
                    <h3 className="font-cinzel text-sm font-bold text-white">
                      HIGHEST-TRAFFIC COMMISSIONS
                    </h3>
                    <span className="text-[10px] font-mono-clean text-[#888888]">VIEWS</span>
                  </div>
                  <div className="space-y-3">
                    {projects.slice(0, 4).map((p) => (
                      <div key={p.id} className="flex items-center justify-between text-xs font-mono-clean">
                        <span className="text-[#D4D4D4] truncate max-w-xs">{p.title}</span>
                        <span className="text-[#FF1A1A] font-semibold tabular-nums">{p.views} views</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 border border-[#200505] bg-[#080202] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1a0404] pb-3">
                    <h3 className="font-cinzel text-sm font-bold text-white">
                      LATEST CONTACT TRANSMISSIONS
                    </h3>
                    <button
                      onClick={() => setActiveTab('messages')}
                      className="text-[10px] font-mono-clean text-[#FF1A1A] hover:underline"
                    >
                      VIEW ALL
                    </button>
                  </div>
                  <div className="space-y-3">
                    {messages.slice(0, 3).map((m) => (
                      <div key={m.id} className="p-3 border border-[#1c0404] bg-[#0d0303] text-xs">
                        <div className="flex items-center justify-between text-[#888888] font-mono-clean text-[10px] mb-1">
                          <span className="text-white font-medium">{m.name}</span>
                          <span className={m.status === 'NEW' ? 'text-[#FF1A1A] font-bold' : ''}>{m.status}</span>
                        </div>
                        <div className="text-[#D4D4D4] truncate">{m.subject}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS MANAGEMENT */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-cinzel text-xl font-bold text-white tracking-wide">
                    PROJECT MANAGEMENT
                  </h2>
                  <div className="text-xs text-[#888888] font-mono-clean mt-1">
                    Create, edit, and curate architectural showcase entries
                  </div>
                </div>

                <button
                  onClick={() => setEditingProject({
                    title: '',
                    slug: '',
                    description: '',
                    longDescription: '',
                    category: 'WEB',
                    technologies: ['TypeScript', 'Next.js', 'React'],
                    thumbnail: '/src/assets/images/project_cyber_dex_1791114797026.jpg',
                    gallery: [],
                    challenge: '',
                    solution: '',
                    features: [],
                    results: '',
                    year: '2026',
                    featured: true,
                    published: true,
                    order: projects.length + 1,
                  })}
                  className="px-4 py-2 bg-[#E50914] text-white text-xs font-semibold tracking-wider flex items-center gap-1.5 hover:bg-[#FF1A1A]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>NEW PROJECT</span>
                </button>
              </div>

              {/* Projects Table */}
              <div className="border border-[#200505] bg-[#080202] overflow-x-auto">
                <table className="w-full text-left text-xs font-mono-clean">
                  <thead className="bg-[#0e0303] border-b border-[#200505] text-[#888888]">
                    <tr>
                      <th className="p-3">TITLE &amp; SLUG</th>
                      <th className="p-3">CATEGORY</th>
                      <th className="p-3">YEAR</th>
                      <th className="p-3">VIEWS</th>
                      <th className="p-3">STATUS</th>
                      <th className="p-3 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#180303]">
                    {projects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-[#0c0303]">
                        <td className="p-3">
                          <div className="font-semibold text-white">{proj.title}</div>
                          <div className="text-[#666666] text-[10px]">/{proj.slug}</div>
                        </td>
                        <td className="p-3 text-[#D4D4D4]">{proj.category}</td>
                        <td className="p-3 text-[#888888]">{proj.year}</td>
                        <td className="p-3 text-[#FF1A1A] tabular-nums">{proj.views}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] ${proj.published ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800' : 'text-[#888888] bg-[#1a0404]'}`}>
                            {proj.published ? 'PUBLISHED' : 'DRAFT'}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => setEditingProject(proj)}
                            aria-label={`Edit project ${proj.title}`}
                            className="p-1 border border-[#290505] text-[#888888] hover:text-white hover:border-[#E50914]"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            aria-label={`Delete project ${proj.title}`}
                            className="p-1 border border-[#290505] text-[#888888] hover:text-[#FF1A1A] hover:border-[#FF1A1A]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Edit Project Modal */}
              {editingProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
                  <div className="relative w-full max-w-3xl bg-[#0a0303] border border-[#2d0707] p-6 space-y-6 max-h-[85vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-[#200505] pb-3">
                      <h3 className="font-cinzel text-base font-bold text-white">
                        {editingProject.id ? 'EDIT PROJECT RECORD' : 'CREATE NEW PROJECT'}
                      </h3>
                      <button onClick={() => setEditingProject(null)} className="text-[#888888] hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProject} className="space-y-4 text-xs font-mono-clean">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#888888] mb-1">TITLE</label>
                          <input
                            type="text"
                            required
                            value={editingProject.title || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                            className="w-full px-3 py-2 bg-[#120303] border border-[#280505] text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[#888888] mb-1">SLUG (URL FRIENDLY)</label>
                          <input
                            type="text"
                            required
                            value={editingProject.slug || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                            className="w-full px-3 py-2 bg-[#120303] border border-[#280505] text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[#888888] mb-1">CATEGORY</label>
                          <select
                            value={editingProject.category || 'WEB'}
                            onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                            className="w-full px-3 py-2 bg-[#120303] border border-[#280505] text-white"
                          >
                            <option value="WEB">WEB</option>
                            <option value="APP">APP</option>
                            <option value="3D">3D</option>
                            <option value="UI/UX">UI/UX</option>
                            <option value="SYSTEM">SYSTEM</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[#888888] mb-1">YEAR</label>
                          <input
                            type="text"
                            value={editingProject.year || '2026'}
                            onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                            className="w-full px-3 py-2 bg-[#120303] border border-[#280505] text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[#888888] mb-1">ORDER INDEX</label>
                          <input
                            type="number"
                            value={editingProject.order || 1}
                            onChange={(e) => setEditingProject({ ...editingProject, order: parseInt(e.target.value, 10) || 1 })}
                            className="w-full px-3 py-2 bg-[#120303] border border-[#280505] text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#888888] mb-1">SHORT DESCRIPTION</label>
                        <textarea
                          rows={2}
                          value={editingProject.description || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                          className="w-full px-3 py-2 bg-[#120303] border border-[#280505] text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[#888888] mb-1">LONG DESCRIPTION</label>
                        <textarea
                          rows={3}
                          value={editingProject.longDescription || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                          className="w-full px-3 py-2 bg-[#120303] border border-[#280505] text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#888888] mb-1">THE ARCHITECTURAL CHALLENGE</label>
                          <textarea
                            rows={2}
                            value={editingProject.challenge || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, challenge: e.target.value })}
                            className="w-full px-3 py-2 bg-[#120303] border border-[#280505] text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[#888888] mb-1">THE ENGINEERED SOLUTION</label>
                          <textarea
                            rows={2}
                            value={editingProject.solution || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                            className="w-full px-3 py-2 bg-[#120303] border border-[#280505] text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#888888] mb-1">TECHNOLOGIES (COMMA SEPARATED)</label>
                        <input
                          type="text"
                          value={editingProject.technologies?.join(', ') || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                          className="w-full px-3 py-2 bg-[#120303] border border-[#280505] text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[#888888] mb-1">THUMBNAIL IMAGE PATH / URL</label>
                        <input
                          type="text"
                          value={editingProject.thumbnail || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                          className="w-full px-3 py-2 bg-[#120303] border border-[#280505] text-white"
                        />
                      </div>

                      <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingProject.published ?? true}
                            onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                            className="accent-[#E50914]"
                          />
                          <span>PUBLISHED TO SITE</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingProject.featured ?? true}
                            onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                            className="accent-[#E50914]"
                          />
                          <span>FEATURED HIGHLIGHT</span>
                        </label>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-[#200505]">
                        <button
                          type="button"
                          onClick={() => setEditingProject(null)}
                          className="px-4 py-2 border border-[#300505] text-[#888888] hover:text-white"
                        >
                          CANCEL
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#E50914] text-white hover:bg-[#FF1A1A] font-bold"
                        >
                          COMMIT CHANGES
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SKILLS MANAGEMENT */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-cinzel text-xl font-bold text-white tracking-wide">
                    SKILL MANAGEMENT
                  </h2>
                  <div className="text-xs text-[#888888] font-mono-clean mt-1">
                    Manage proficiency matrix and categorized tech stacks
                  </div>
                </div>

                <button
                  onClick={() => setEditingSkill({
                    name: '',
                    category: 'Frontend',
                    level: 90,
                    iconName: 'Code',
                    order: skills.length + 1
                  })}
                  className="px-4 py-2 bg-[#E50914] text-white text-xs font-semibold tracking-wider flex items-center gap-1.5 hover:bg-[#FF1A1A]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD SKILL</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((s) => (
                  <div key={s.id} className="p-4 border border-[#200505] bg-[#090202] flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white text-sm">{s.name}</div>
                      <div className="text-[11px] font-mono-clean text-[#888888]">{s.category} · {s.level}%</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingSkill(s)}
                        aria-label={`Edit skill ${s.name}`}
                        className="p-1.5 border border-[#250505] text-[#888888] hover:text-white hover:border-[#E50914]"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(s.id)}
                        aria-label={`Delete skill ${s.name}`}
                        className="p-1.5 border border-[#250505] text-[#888888] hover:text-[#FF1A1A] hover:border-[#FF1A1A]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Skill Modal */}
              {editingSkill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                  <div className="relative w-full max-w-md bg-[#0a0303] border border-[#2d0707] p-6 space-y-4 text-xs font-mono-clean">
                    <div className="flex items-center justify-between border-b border-[#200505] pb-2">
                      <h3 className="font-cinzel text-sm font-bold text-white">
                        {editingSkill.id ? 'EDIT SKILL' : 'ADD SKILL'}
                      </h3>
                      <button onClick={() => setEditingSkill(null)} className="text-[#888888] hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveSkill} className="space-y-4">
                      <div>
                        <label className="block text-[#888888] mb-1">SKILL NAME</label>
                        <input
                          type="text"
                          required
                          value={editingSkill.name || ''}
                          onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                          className="w-full px-3 py-2 bg-[#120303] border border-[#280505] text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[#888888] mb-1">CATEGORY</label>
                        <select
                          value={editingSkill.category || 'Frontend'}
                          onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                          className="w-full px-3 py-2 bg-[#120303] border border-[#280505] text-white"
                        >
                          <option value="Frontend">Frontend</option>
                          <option value="Backend">Backend</option>
                          <option value="Database">Database</option>
                          <option value="UI/UX">UI/UX</option>
                          <option value="DevOps">DevOps</option>
                          <option value="Security">Security</option>
                          <option value="3D / Creative">3D / Creative</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#888888] mb-1">PROFICIENCY LEVEL ({editingSkill.level || 90}%)</label>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value={editingSkill.level || 90}
                          onChange={(e) => setEditingSkill({ ...editingSkill, level: parseInt(e.target.value, 10) })}
                          className="w-full accent-[#E50914]"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-[#200505]">
                        <button
                          type="button"
                          onClick={() => setEditingSkill(null)}
                          className="px-3 py-1.5 border border-[#300505] text-[#888888]"
                        >
                          CANCEL
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-[#E50914] text-white font-bold"
                        >
                          SAVE
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MESSAGES INBOX */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-cinzel text-xl font-bold text-white tracking-wide">
                  TRANSMISSION INBOX
                </h2>
                <div className="text-xs text-[#888888] font-mono-clean mt-1">
                  Inquiries and communications received via the encrypted contact form
                </div>
              </div>

              {messages.length === 0 ? (
                <div className="p-8 border border-[#200505] bg-[#090202] text-center text-xs text-[#666666] font-mono-clean">
                  NO TRANSMISSIONS CURRENTLY IN QUEUE
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-6 border ${msg.status === 'NEW' ? 'border-[#E50914]/60 bg-[#120303]' : 'border-[#200505] bg-[#080202]'}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1c0404] pb-3 mb-4">
                        <div className="space-y-0.5">
                          <div className="text-xs font-mono-clean font-bold text-white">
                            {msg.name} &lt;{msg.email}&gt;
                          </div>
                          <div className="text-[10px] font-mono-clean text-[#888888]">
                            DISPATCHED: {new Date(msg.createdAt).toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={msg.status}
                            onChange={(e) => handleUpdateMessageStatus(msg.id, e.target.value as any)}
                            className="px-2 py-1 bg-[#1a0404] border border-[#2d0707] text-[11px] font-mono-clean text-white"
                          >
                            <option value="NEW">NEW</option>
                            <option value="READ">READ</option>
                            <option value="REPLIED">REPLIED</option>
                            <option value="ARCHIVED">ARCHIVED</option>
                          </select>

                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            aria-label={`Delete message from ${msg.name}`}
                            className="p-1 border border-[#280505] text-[#888888] hover:text-[#FF1A1A]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs font-semibold text-[#FF1A1A] font-mono-clean mb-2">
                        SUBJECT: {msg.subject}
                      </div>

                      <p className="text-xs sm:text-sm text-[#D4D4D4] leading-relaxed whitespace-pre-wrap font-light">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SITE SETTINGS */}
          {activeTab === 'settings' && settings && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="font-cinzel text-xl font-bold text-white tracking-wide">
                  SITE IDENTITY &amp; SETTINGS
                </h2>
                <div className="text-xs text-[#888888] font-mono-clean mt-1">
                  Adjust bio, stats, and real-time availability markers
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-mono-clean">
                <div>
                  <label className="block text-[#888888] mb-1">OPERATOR NAME</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0c0303] border border-[#280505] text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#888888] mb-1">TITLE / SPECIALIZATION</label>
                  <input
                    type="text"
                    value={settings.title}
                    onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0c0303] border border-[#280505] text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#888888] mb-1">BIOGRAPHY SUMMARY</label>
                  <textarea
                    rows={3}
                    value={settings.bio}
                    onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0c0303] border border-[#280505] text-white"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[#888888] mb-1">YEARS EXP</label>
                    <input
                      type="text"
                      value={settings.yearsExperience}
                      onChange={(e) => setSettings({ ...settings, yearsExperience: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0c0303] border border-[#280505] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#888888] mb-1">PROJECTS</label>
                    <input
                      type="text"
                      value={settings.completedProjects}
                      onChange={(e) => setSettings({ ...settings, completedProjects: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0c0303] border border-[#280505] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#888888] mb-1">TECH STACK</label>
                    <input
                      type="text"
                      value={settings.techCount}
                      onChange={(e) => setSettings({ ...settings, techCount: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0c0303] border border-[#280505] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#888888] mb-1">PASSION RATE</label>
                    <input
                      type="text"
                      value={settings.passionRate}
                      onChange={(e) => setSettings({ ...settings, passionRate: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0c0303] border border-[#280505] text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#888888] mb-1">CONTACT EMAIL</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0c0303] border border-[#280505] text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#888888] mb-1">AVAILABILITY STATUS TEXT</label>
                  <input
                    type="text"
                    value={settings.statusText}
                    onChange={(e) => setSettings({ ...settings, statusText: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0c0303] border border-[#280505] text-white"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#E50914] text-white font-bold hover:bg-[#FF1A1A] transition-all"
                  >
                    COMMIT SETTINGS
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-cinzel text-xl font-bold text-white tracking-wide">
                  AUDIENCE TELEMETRY
                </h2>
                <div className="text-xs text-[#888888] font-mono-clean mt-1">
                  Privacy-first visitor analysis &amp; device breakdowns
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 border border-[#200505] bg-[#090202]">
                  <div className="text-[11px] font-mono-clean text-[#888888] uppercase mb-1">
                    DESKTOP RATIO
                  </div>
                  <div className="font-cinzel text-2xl font-bold text-white">
                    {analytics?.deviceBreakdown?.desktop || 0} visits
                  </div>
                </div>

                <div className="p-5 border border-[#200505] bg-[#090202]">
                  <div className="text-[11px] font-mono-clean text-[#888888] uppercase mb-1">
                    MOBILE RATIO
                  </div>
                  <div className="font-cinzel text-2xl font-bold text-white">
                    {analytics?.deviceBreakdown?.mobile || 0} visits
                  </div>
                </div>

                <div className="p-5 border border-[#200505] bg-[#090202]">
                  <div className="text-[11px] font-mono-clean text-[#888888] uppercase mb-1">
                    TABLET RATIO
                  </div>
                  <div className="font-cinzel text-2xl font-bold text-white">
                    {analytics?.deviceBreakdown?.tablet || 0} visits
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
