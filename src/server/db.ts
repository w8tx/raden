import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { DatabaseSchema, User, Project, Skill, Service, Experience, Message, SocialLink, SiteSetting, VisitorMetric } from '../types/database.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Password hashing using Node.js crypto standard scrypt
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, key] = combinedHash.split(':');
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

const INITIAL_DATA: DatabaseSchema = {
  users: [
    {
      id: 'usr_admin_01',
      email: 'admin@reddragon.dev',
      passwordHash: hashPassword('reddragon2026'),
      name: 'Red Dragon Architect',
      role: 'ADMIN',
      createdAt: '2026-01-01T00:00:00.000Z',
    }
  ],
  settings: {
    id: 'setting_main',
    name: 'KAI VALEN',
    title: 'CREATIVE ENGINEER & DIGITAL ARCHITECT',
    subtitle: 'TURNING IDEAS INTO DIGITAL EXPERIENCES.',
    bio: 'Pioneering immersive cyberspace applications, high-performance distributed systems, and real-time 3D spatial environments. Blending aggressive crimson aesthetics with surgical software precision.',
    availableForWork: true,
    statusText: 'AVAILABLE FOR COMMISSIONS & ENTERPRISE ARCHITECTURE',
    yearsExperience: '08+',
    completedProjects: '42+',
    techCount: '24+',
    passionRate: '100%',
    contactEmail: 'contact@reddragon.dev',
    avatarUrl: '/src/assets/images/portrait_creator_director_1791114835688.jpg',
  },
  projects: [
    {
      id: 'proj_01',
      title: 'DRACO DEX — High-Frequency Cybernetic Exchange',
      slug: 'draco-dex',
      description: 'Ultra-low latency decentralized exchange terminal with real-time orderbook depth visualization, sub-millisecond execution, and volumetric dark glass UI.',
      longDescription: 'DRACO DEX is a next-generation decentralized liquidity protocol and trading terminal engineered for extreme volatility. Designed with an aggressive dark cyber aesthetic, it leverages WebGL hardware acceleration to render dynamic order book heatmaps and real-time depth vectors at 120 FPS.',
      category: 'WEB',
      technologies: ['TypeScript', 'Next.js', 'React', 'Three.js', 'WebSockets', 'Tailwind CSS', 'Rust'],
      thumbnail: '/src/assets/images/project_cyber_dex_1791114797026.jpg',
      gallery: [
        '/src/assets/images/project_cyber_dex_1791114797026.jpg',
        '/src/assets/images/dragon_hero_cinematic_1791114781863.jpg'
      ],
      challenge: 'Handling thousands of concurrent tick updates over WebSocket while keeping frame rates locked at 120Hz without garbage collection hiccups.',
      solution: 'Constructed an offscreen canvas rendering pipeline using typed arrays and Web Workers to decouple data ingestion from the React main thread.',
      features: [
        'Real-time order book heatmap rendered on WebGL canvas',
        'Sub-10ms trade confirmation telemetry',
        'Modular HUD workspace with drag-and-drop widget docks',
        'Hardware wallet biometric authentication integration'
      ],
      results: '$180M+ daily simulated trade volume stress-tested with 0 memory leaks across continuous 48-hour benchmarks.',
      demoUrl: 'https://github.com/reddragon-portfolio',
      sourceUrl: 'https://github.com/reddragon-portfolio/draco-dex',
      year: '2026',
      featured: true,
      published: true,
      views: 1420,
      order: 1,
      createdAt: '2026-02-10T14:30:00.000Z',
    },
    {
      id: 'proj_02',
      title: 'VALYR OS — Dark Cinematic Cloud Operating Environment',
      slug: 'valyr-os',
      description: 'Futuristic developer workspace and kernel management system boasting dark obsidian glassmorphism, crimson telemetry charts, and unified container orchestration.',
      longDescription: 'VALYR OS reimagines remote server fleet administration as a tactile spatial mission-control room. Engineers can visualize cluster nodes as crystalline constellations, execute zero-downtime canary rollouts, and analyze anomaly traces with real-time log ingestion.',
      category: 'SYSTEM',
      technologies: ['React', 'TypeScript', 'Node.js', 'Docker', 'PostgreSQL', 'Tailwind CSS', 'WebAssembly'],
      thumbnail: '/src/assets/images/project_dragon_os_1791114808908.jpg',
      gallery: [
        '/src/assets/images/project_dragon_os_1791114808908.jpg',
        '/src/assets/images/project_cyber_dex_1791114797026.jpg'
      ],
      challenge: 'Unifying multi-cloud telemetry from Kubernetes and edge nodes without introducing dashboard latency or cognitive overload.',
      solution: 'Architected a reactive streaming pipeline with SSE and time-series aggregation, presenting key health metrics with surgical typographic hierarchy.',
      features: [
        'Interactive cluster topology visualizer',
        'Built-in sandboxed terminal emulator with keyboard-first shortcuts',
        'Automated failover protocol with cryptographic audit logs',
        'Custom high-contrast dark theme with adaptive brightness compensation'
      ],
      results: 'Deployed across 85 distributed nodes, reducing incident response MTTR by 42%.',
      demoUrl: 'https://github.com/reddragon-portfolio',
      sourceUrl: 'https://github.com/reddragon-portfolio/valyr-os',
      year: '2025',
      featured: true,
      published: true,
      views: 980,
      order: 2,
      createdAt: '2025-11-15T09:00:00.000Z',
    },
    {
      id: 'proj_03',
      title: 'AETHER RUNES — 3D Spatial Fantasy Web Experience',
      slug: 'aether-runes',
      description: 'Immersive WebGL journey through crystalline monoliths and ancient crimson ruins. Features dynamic audio reactive lighting, procedural particle clouds, and spatial sound.',
      longDescription: 'An avant-garde digital art experience where users interact with procedural monoliths carved with glowing crimson glyphs. Powered by custom GLSL shaders and physical-based lighting models.',
      category: '3D',
      technologies: ['Three.js', 'WebGL', 'GLSL', 'React', 'Web Audio API', 'TypeScript'],
      thumbnail: '/src/assets/images/project_spatial_realm_1791114820792.jpg',
      gallery: [
        '/src/assets/images/project_spatial_realm_1791114820792.jpg',
        '/src/assets/images/dragon_hero_cinematic_1791114781863.jpg'
      ],
      challenge: 'Maintaining smooth 60fps on mobile touch devices while simulating 15,000 glowing volumetric particles and post-processing bloom.',
      solution: 'Implemented GPU instancing and frustum culling with adaptive level-of-detail (LOD) that throttles particle density on battery-saver mobile profiles.',
      features: [
        'Procedural GPU rune generation via noise shaders',
        'Spatial 3D audio synthesizer synchronized with camera proximity',
        'Post-processing chromatic aberration and bloom passes',
        'Full gyro and touch orientation controls on mobile devices'
      ],
      results: 'Featured in WebGL showcases and experienced by 60,000+ interactive visitors worldwide.',
      demoUrl: 'https://github.com/reddragon-portfolio',
      sourceUrl: 'https://github.com/reddragon-portfolio/aether-runes',
      year: '2025',
      featured: true,
      published: true,
      views: 2150,
      order: 3,
      createdAt: '2025-08-20T18:00:00.000Z',
    },
    {
      id: 'proj_04',
      title: 'PYRE ENGINE — Real-Time Distributed Telemetry Daemon',
      slug: 'pyre-engine',
      description: 'High-throughput event ingestion engine processing millions of structured event packets per second with automated anomaly quarantine and zero data loss.',
      longDescription: 'PYRE is an open-source event backbone designed for mission-critical microservice architectures. Featuring persistent ring-buffers and zero-copy deserialization.',
      category: 'APP',
      technologies: ['Go', 'TypeScript', 'PostgreSQL', 'Redis', 'Kafka', 'GraphQL'],
      thumbnail: '/src/assets/images/project_dragon_os_1791114808908.jpg',
      gallery: [
        '/src/assets/images/project_dragon_os_1791114808908.jpg'
      ],
      challenge: 'Preventing memory spikes and GC stalls during sudden 10x traffic surges.',
      solution: 'Constructed lock-free ring buffers with backpressure signaling and disk spills.',
      features: [
        'Zero-copy binary event parser',
        'Automatic sliding-window rate limiter',
        'End-to-end payload signature verification'
      ],
      results: 'Processes 2.4M ops/sec with p99 latency under 1.2ms.',
      demoUrl: 'https://github.com/reddragon-portfolio',
      sourceUrl: 'https://github.com/reddragon-portfolio/pyre-engine',
      year: '2024',
      featured: false,
      published: true,
      views: 740,
      order: 4,
      createdAt: '2024-12-05T11:00:00.000Z',
    }
  ],
  skills: [
    { id: 'sk_01', name: 'React & Next.js', category: 'Frontend', level: 98, iconName: 'Layers', order: 1, createdAt: '2026-01-01' },
    { id: 'sk_02', name: 'TypeScript', category: 'Frontend', level: 96, iconName: 'Code', order: 2, createdAt: '2026-01-01' },
    { id: 'sk_03', name: 'Tailwind CSS', category: 'Frontend', level: 95, iconName: 'Palette', order: 3, createdAt: '2026-01-01' },
    { id: 'sk_04', name: 'Three.js & WebGL', category: '3D / Creative', level: 92, iconName: 'Box', order: 4, createdAt: '2026-01-01' },
    { id: 'sk_05', name: 'Node.js & Express', category: 'Backend', level: 94, iconName: 'Server', order: 5, createdAt: '2026-01-01' },
    { id: 'sk_06', name: 'Python & FastAPI', category: 'Backend', level: 88, iconName: 'Terminal', order: 6, createdAt: '2026-01-01' },
    { id: 'sk_07', name: 'PostgreSQL & Prisma', category: 'Database', level: 92, iconName: 'Database', order: 7, createdAt: '2026-01-01' },
    { id: 'sk_08', name: 'Redis & Caching', category: 'Database', level: 90, iconName: 'Zap', order: 8, createdAt: '2026-01-01' },
    { id: 'sk_09', name: 'Docker & Kubernetes', category: 'DevOps', level: 86, iconName: 'Cpu', order: 9, createdAt: '2026-01-01' },
    { id: 'sk_10', name: 'Linux Fleet Admin', category: 'DevOps', level: 90, iconName: 'HardDrive', order: 10, createdAt: '2026-01-01' },
    { id: 'sk_11', name: 'System Security & Auth', category: 'Security', level: 90, iconName: 'Shield', order: 11, createdAt: '2026-01-01' },
    { id: 'sk_12', name: 'UI/UX & Motion Design', category: 'UI/UX', level: 94, iconName: 'Sparkles', order: 12, createdAt: '2026-01-01' }
  ],
  services: [
    {
      id: 'srv_01',
      title: 'FULL STACK DEVELOPMENT',
      description: 'End-to-end web applications crafted with modern TypeScript, React, and resilient microservices. Optimized for extreme scale, security, and sub-second TTFB.',
      features: ['Modern React & Next.js architectures', 'Type-safe server APIs & ORMs', 'Micro-interactions and fluid motion', 'Automated CI/CD pipelines'],
      iconName: 'Layout',
      order: 1
    },
    {
      id: 'srv_02',
      title: '3D & SPATIAL EXPERIENCES',
      description: 'Bespoke WebGL and Three.js environments that elevate your brand into an unforgettable interactive digital spectacle without sacrificing mobile battery.',
      features: ['Custom GLSL shader development', 'Interactive procedural particle fields', 'Hardware-accelerated 3D viewports', 'Smooth 60/120 FPS camera choreography'],
      iconName: 'Box',
      order: 2
    },
    {
      id: 'srv_03',
      title: 'HIGH-FREQUENCY APIS & SYSTEMS',
      description: 'Robust server infrastructures capable of digesting massive concurrent workloads with rate limiting, encryption, and comprehensive observability.',
      features: ['WebSocket & streaming pipelines', 'PostgreSQL database modeling', 'Redis cache clusters', 'Distributed authentication & RBAC'],
      iconName: 'Server',
      order: 3
    },
    {
      id: 'srv_04',
      title: 'UI/UX & CINEMATIC DESIGN',
      description: 'Futuristic, high-contrast visual identities that command authority. Zero generic templates; strictly crafted typographic systems and dark aesthetics.',
      features: ['Design systems & design tokens', 'Dark mode optical compensation', 'Fluid responsive layout engineering', 'Micro-interaction physics'],
      iconName: 'Sparkles',
      order: 4
    }
  ],
  experiences: [
    {
      id: 'exp_01',
      year: '2026 — PRESENT',
      role: 'Principal Creative Technologist',
      company: 'Draco Labs / Autonomous Systems',
      location: 'Tokyo / Remote',
      description: 'Directing the architecture of next-gen spatial dashboards, high-frequency decentralized interfaces, and WebGL visualization engines.',
      order: 1
    },
    {
      id: 'exp_02',
      year: '2024 — 2026',
      role: 'Senior Full Stack Engineer',
      company: 'Obsidian Media Group',
      location: 'San Francisco, CA',
      description: 'Engineered high-scale web platforms servicing 4M+ monthly active users. Replaced legacy services with modern reactive microservices.',
      order: 2
    },
    {
      id: 'exp_03',
      year: '2022 — 2024',
      role: 'Creative Frontend Specialist',
      company: 'Crimson Interactive',
      location: 'Berlin, Germany',
      description: 'Built award-winning interactive promotional sites and WebGL brand showcases for Fortune 500 tech clients.',
      order: 3
    },
    {
      id: 'exp_04',
      year: '2020 — 2022',
      role: 'Software Engineer',
      company: 'Nexus Core Software',
      location: 'Jakarta, Indonesia',
      description: 'Developed scalable REST/GraphQL backends, PostgreSQL schemas, and real-time operational monitoring tools.',
      order: 4
    }
  ],
  messages: [
    {
      id: 'msg_01',
      name: 'Alexander Cross',
      email: 'alex.cross@hyperion-ventures.io',
      subject: 'Inquiry: Enterprise Spatial Dashboard Architecture',
      message: 'Hello Kai, we were blown away by the DRACO DEX interface and would love to discuss a commercial engagement for our upcoming institutional crypto analytics suite.',
      status: 'NEW',
      createdAt: '2026-10-02T10:15:00.000Z',
    },
    {
      id: 'msg_02',
      name: 'Elena Rostova',
      email: 'elena@valkyrie-audio.de',
      subject: '3D WebGL Audio Synthesizer Collaboration',
      message: 'Greetings! Our Berlin studio is developing a spatial synthesizer and we need a master of Three.js and custom GLSL shaders.',
      status: 'READ',
      createdAt: '2026-09-28T14:45:00.000Z',
    }
  ],
  socialLinks: [
    { id: 'soc_01', platform: 'GitHub', url: 'https://github.com/reddragon-portfolio', username: 'reddragon-portfolio', order: 1 },
    { id: 'soc_02', platform: 'LinkedIn', url: 'https://linkedin.com/in/reddragon-creative', username: 'reddragon-creative', order: 2 },
    { id: 'soc_03', platform: 'X', url: 'https://x.com/reddragon_dev', username: '@reddragon_dev', order: 3 },
    { id: 'soc_04', platform: 'Discord', url: 'https://discord.gg/reddragon', username: 'reddragon#0001', order: 4 },
    { id: 'soc_05', platform: 'YouTube', url: 'https://youtube.com/@reddragon_dev', username: 'RedDragonLab', order: 5 }
  ],
  visitors: [
    { id: 'vis_01', timestamp: '2026-10-04T02:10:00.000Z', path: '/', deviceType: 'desktop' },
    { id: 'vis_02', timestamp: '2026-10-04T03:45:00.000Z', path: '/portfolio/draco-dex', deviceType: 'desktop' },
    { id: 'vis_03', timestamp: '2026-10-04T04:20:00.000Z', path: '/', deviceType: 'mobile' }
  ]
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDirectory();
    this.data = this.loadData();
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Merge with initial data to ensure all keys exist
        return {
          ...INITIAL_DATA,
          ...parsed,
          settings: { ...INITIAL_DATA.settings, ...(parsed.settings || {}) },
          users: parsed.users || INITIAL_DATA.users,
          projects: parsed.projects || INITIAL_DATA.projects,
          skills: parsed.skills || INITIAL_DATA.skills,
          services: parsed.services || INITIAL_DATA.services,
          experiences: parsed.experiences || INITIAL_DATA.experiences,
          messages: parsed.messages || INITIAL_DATA.messages,
          socialLinks: parsed.socialLinks || INITIAL_DATA.socialLinks,
          visitors: parsed.visitors || INITIAL_DATA.visitors,
        };
      }
    } catch (err) {
      console.error('Failed to load database file, using seed data:', err);
    }
    this.saveData(INITIAL_DATA);
    return INITIAL_DATA;
  }

  private saveData(data: DatabaseSchema) {
    try {
      this.ensureDataDirectory();
      // Atomic write using temp file
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to save database file:', err);
    }
  }

  // --- Users ---
  getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  // --- Projects ---
  getProjects(includeUnpublished = false): Project[] {
    const list = includeUnpublished ? this.data.projects : this.data.projects.filter(p => p.published);
    return list.sort((a, b) => a.order - b.order);
  }

  getProjectBySlug(slug: string): Project | undefined {
    return this.data.projects.find(p => p.slug === slug);
  }

  incrementProjectViews(slug: string): void {
    const project = this.data.projects.find(p => p.slug === slug);
    if (project) {
      project.views = (project.views || 0) + 1;
      this.saveData(this.data);
    }
  }

  createProject(project: Omit<Project, 'id' | 'createdAt' | 'views'>): Project {
    const newProject: Project = {
      ...project,
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      views: 0,
      order: project.order || this.data.projects.length + 1
    };
    this.data.projects.push(newProject);
    this.saveData(this.data);
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): Project | undefined {
    const index = this.data.projects.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    this.data.projects[index] = { ...this.data.projects[index], ...updates };
    this.saveData(this.data);
    return this.data.projects[index];
  }

  deleteProject(id: string): boolean {
    const initialLen = this.data.projects.length;
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    if (this.data.projects.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- Skills ---
  getSkills(): Skill[] {
    return [...this.data.skills].sort((a, b) => a.order - b.order);
  }

  createSkill(skill: Omit<Skill, 'id' | 'createdAt'>): Skill {
    const newSkill: Skill = {
      ...skill,
      id: `sk_${Date.now()}`,
      createdAt: new Date().toISOString(),
      order: skill.order || this.data.skills.length + 1
    };
    this.data.skills.push(newSkill);
    this.saveData(this.data);
    return newSkill;
  }

  updateSkill(id: string, updates: Partial<Skill>): Skill | undefined {
    const index = this.data.skills.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    this.data.skills[index] = { ...this.data.skills[index], ...updates };
    this.saveData(this.data);
    return this.data.skills[index];
  }

  deleteSkill(id: string): boolean {
    const initialLen = this.data.skills.length;
    this.data.skills = this.data.skills.filter(s => s.id !== id);
    if (this.data.skills.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- Services ---
  getServices(): Service[] {
    return [...this.data.services].sort((a, b) => a.order - b.order);
  }

  createService(service: Omit<Service, 'id'>): Service {
    const newService: Service = {
      ...service,
      id: `srv_${Date.now()}`,
      order: service.order || this.data.services.length + 1
    };
    this.data.services.push(newService);
    this.saveData(this.data);
    return newService;
  }

  updateService(id: string, updates: Partial<Service>): Service | undefined {
    const index = this.data.services.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    this.data.services[index] = { ...this.data.services[index], ...updates };
    this.saveData(this.data);
    return this.data.services[index];
  }

  deleteService(id: string): boolean {
    const initialLen = this.data.services.length;
    this.data.services = this.data.services.filter(s => s.id !== id);
    if (this.data.services.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- Experiences ---
  getExperiences(): Experience[] {
    return [...this.data.experiences].sort((a, b) => a.order - b.order);
  }

  createExperience(exp: Omit<Experience, 'id'>): Experience {
    const newExp: Experience = {
      ...exp,
      id: `exp_${Date.now()}`,
      order: exp.order || this.data.experiences.length + 1
    };
    this.data.experiences.push(newExp);
    this.saveData(this.data);
    return newExp;
  }

  updateExperience(id: string, updates: Partial<Experience>): Experience | undefined {
    const index = this.data.experiences.findIndex(e => e.id === id);
    if (index === -1) return undefined;
    this.data.experiences[index] = { ...this.data.experiences[index], ...updates };
    this.saveData(this.data);
    return this.data.experiences[index];
  }

  deleteExperience(id: string): boolean {
    const initialLen = this.data.experiences.length;
    this.data.experiences = this.data.experiences.filter(e => e.id !== id);
    if (this.data.experiences.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- Messages ---
  getMessages(): Message[] {
    return [...this.data.messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createMessage(msg: Omit<Message, 'id' | 'createdAt' | 'status'>): Message {
    const newMessage: Message = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'NEW',
      createdAt: new Date().toISOString()
    };
    this.data.messages.unshift(newMessage);
    this.saveData(this.data);
    return newMessage;
  }

  updateMessageStatus(id: string, status: Message['status']): Message | undefined {
    const msg = this.data.messages.find(m => m.id === id);
    if (!msg) return undefined;
    msg.status = status;
    this.saveData(this.data);
    return msg;
  }

  deleteMessage(id: string): boolean {
    const initialLen = this.data.messages.length;
    this.data.messages = this.data.messages.filter(m => m.id !== id);
    if (this.data.messages.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- Social Links ---
  getSocialLinks(): SocialLink[] {
    return [...this.data.socialLinks].sort((a, b) => a.order - b.order);
  }

  updateSocialLink(id: string, updates: Partial<SocialLink>): SocialLink | undefined {
    const index = this.data.socialLinks.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    this.data.socialLinks[index] = { ...this.data.socialLinks[index], ...updates };
    this.saveData(this.data);
    return this.data.socialLinks[index];
  }

  // --- Site Settings ---
  getSettings(): SiteSetting {
    return this.data.settings;
  }

  updateSettings(updates: Partial<SiteSetting>): SiteSetting {
    this.data.settings = { ...this.data.settings, ...updates };
    this.saveData(this.data);
    return this.data.settings;
  }

  // --- Analytics & Visitors ---
  recordVisitor(path: string, deviceType: 'desktop' | 'mobile' | 'tablet', referrer?: string): void {
    const visitor: VisitorMetric = {
      id: `vis_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
      path,
      deviceType,
      referrer
    };
    this.data.visitors.push(visitor);
    // Keep max 2000 records to prevent file bloating
    if (this.data.visitors.length > 2000) {
      this.data.visitors = this.data.visitors.slice(-1500);
    }
    this.saveData(this.data);
  }

  getAnalyticsSummary() {
    const totalViews = this.data.visitors.length;
    const now = Date.now();
    const last24h = this.data.visitors.filter(v => now - new Date(v.timestamp).getTime() < 24 * 60 * 60 * 1000).length;
    const totalMessages = this.data.messages.length;
    const newMessages = this.data.messages.filter(m => m.status === 'NEW').length;
    const totalProjects = this.data.projects.length;

    // Device breakdown
    const devices = { desktop: 0, mobile: 0, tablet: 0 };
    for (const v of this.data.visitors) {
      if (v.deviceType in devices) {
        devices[v.deviceType]++;
      }
    }

    const popularProjects = [...this.data.projects]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 3)
      .map(p => ({ title: p.title, views: p.views || 0, slug: p.slug }));

    return {
      totalViews,
      viewsLast24h: last24h,
      totalMessages,
      newMessages,
      totalProjects,
      deviceBreakdown: devices,
      popularProjects
    };
  }
}

export const db = new Database();
