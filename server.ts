import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { db, verifyPassword } from './src/server/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Security & Parsing
app.use(express.json({ limit: '5mb' }));

// Simple in-memory session tokens
const validSessions = new Map<string, { userId: string; expiresAt: number }>();

// Simple rate limiter map
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function rateLimiter(limit: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetAt) {
      rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= limit) {
      return res.status(429).json({ error: 'Too many requests. Please cool down.' });
    }

    entry.count++;
    next();
  };
}

// Auth Middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Authentication token required.' });
  }

  const token = authHeader.split(' ')[1];
  const session = validSessions.get(token);

  if (!session || Date.now() > session.expiresAt) {
    if (session) validSessions.delete(token);
    return res.status(401).json({ error: 'Session expired or invalid.' });
  }

  const user = db.getUserById(session.userId);
  if (!user) {
    return res.status(401).json({ error: 'User no longer exists.' });
  }

  (req as any).user = user;
  next();
}

// --- AUTH ROUTES ---
app.post('/api/auth/login', rateLimiter(8, 60000), (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.getUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email credentials or password.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  validSessions.set(token, { userId: user.id, expiresAt });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  });
});

app.get('/api/auth/me', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    validSessions.delete(token);
  }
  res.json({ success: true });
});

// --- PUBLIC DATA ROUTES ---
app.get('/api/projects', (req: Request, res: Response) => {
  const projects = db.getProjects(false);
  res.json(projects);
});

app.get('/api/projects/:slug', (req: Request, res: Response) => {
  const project = db.getProjectBySlug(req.params.slug);
  if (!project || !project.published) {
    return res.status(404).json({ error: 'Project not found.' });
  }
  db.incrementProjectViews(req.params.slug);
  res.json(project);
});

app.get('/api/skills', (_req: Request, res: Response) => {
  res.json(db.getSkills());
});

app.get('/api/services', (_req: Request, res: Response) => {
  res.json(db.getServices());
});

app.get('/api/experiences', (_req: Request, res: Response) => {
  res.json(db.getExperiences());
});

app.get('/api/social-links', (_req: Request, res: Response) => {
  res.json(db.getSocialLinks());
});

app.get('/api/settings', (_req: Request, res: Response) => {
  res.json(db.getSettings());
});

app.post('/api/contact', rateLimiter(5, 60000), (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Please provide a valid name (at least 2 characters).' });
  }
  if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    return res.status(400).json({ error: 'Message must be at least 5 characters long.' });
  }

  const saved = db.createMessage({
    name: name.trim(),
    email: email.trim(),
    subject: (subject || 'General Inquiry').trim(),
    message: message.trim(),
  });

  res.status(201).json({ success: true, message: 'Your transmission has been received.', id: saved.id });
});

app.post('/api/analytics/track', (req: Request, res: Response) => {
  const { path: routePath, deviceType, referrer } = req.body;
  if (routePath) {
    db.recordVisitor(routePath, deviceType || 'desktop', referrer);
  }
  res.json({ ok: true });
});

// --- PROTECTED ADMIN ROUTES ---
app.get('/api/admin/projects', requireAuth, (_req: Request, res: Response) => {
  res.json(db.getProjects(true));
});

app.post('/api/admin/projects', requireAuth, (req: Request, res: Response) => {
  const project = db.createProject(req.body);
  res.status(201).json(project);
});

app.put('/api/admin/projects/:id', requireAuth, (req: Request, res: Response) => {
  const updated = db.updateProject(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Project not found.' });
  res.json(updated);
});

app.delete('/api/admin/projects/:id', requireAuth, (req: Request, res: Response) => {
  const success = db.deleteProject(req.params.id);
  res.json({ success });
});

app.post('/api/admin/skills', requireAuth, (req: Request, res: Response) => {
  const skill = db.createSkill(req.body);
  res.status(201).json(skill);
});

app.put('/api/admin/skills/:id', requireAuth, (req: Request, res: Response) => {
  const updated = db.updateSkill(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Skill not found.' });
  res.json(updated);
});

app.delete('/api/admin/skills/:id', requireAuth, (req: Request, res: Response) => {
  const success = db.deleteSkill(req.params.id);
  res.json({ success });
});

app.post('/api/admin/services', requireAuth, (req: Request, res: Response) => {
  const srv = db.createService(req.body);
  res.status(201).json(srv);
});

app.put('/api/admin/services/:id', requireAuth, (req: Request, res: Response) => {
  const updated = db.updateService(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Service not found.' });
  res.json(updated);
});

app.delete('/api/admin/services/:id', requireAuth, (req: Request, res: Response) => {
  const success = db.deleteService(req.params.id);
  res.json({ success });
});

app.post('/api/admin/experiences', requireAuth, (req: Request, res: Response) => {
  const exp = db.createExperience(req.body);
  res.status(201).json(exp);
});

app.put('/api/admin/experiences/:id', requireAuth, (req: Request, res: Response) => {
  const updated = db.updateExperience(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Experience not found.' });
  res.json(updated);
});

app.delete('/api/admin/experiences/:id', requireAuth, (req: Request, res: Response) => {
  const success = db.deleteExperience(req.params.id);
  res.json({ success });
});

app.get('/api/admin/messages', requireAuth, (_req: Request, res: Response) => {
  res.json(db.getMessages());
});

app.put('/api/admin/messages/:id/status', requireAuth, (req: Request, res: Response) => {
  const updated = db.updateMessageStatus(req.params.id, req.body.status);
  if (!updated) return res.status(404).json({ error: 'Message not found.' });
  res.json(updated);
});

app.delete('/api/admin/messages/:id', requireAuth, (req: Request, res: Response) => {
  const success = db.deleteMessage(req.params.id);
  res.json({ success });
});

app.put('/api/admin/settings', requireAuth, (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

app.put('/api/admin/social-links/:id', requireAuth, (req: Request, res: Response) => {
  const updated = db.updateSocialLink(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Social link not found.' });
  res.json(updated);
});

app.get('/api/admin/analytics', requireAuth, (_req: Request, res: Response) => {
  res.json(db.getAnalyticsSummary());
});

// --- VITE MIDDLEWARE / STATIC FILES ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Red Dragon Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal error starting Red Dragon server:', err);
  process.exit(1);
});
