# RED DRAGON — Dark Cinematic Personal Portfolio

A modern, full-stack, dark cinematic personal portfolio engineered with React, TypeScript, Express, Three.js WebGL, and Tailwind CSS. Featuring real-time 3D red dragon choreography, interactive physics-based particle systems, an authenticated command console, and file-persisted ACID database operations.

---

## 1. Features

- **3D Red Dragon Experience**: Procedural Three.js 3D Dragon with articulated spine, obsidian metallic chitin scales, glowing ruby horns, incandescent crimson eyes, breathing animation, wing flutter, and cursor/scroll tracking.
- **Dark Cinematic Visual Identity**: Deep obsidian backgrounds (`#050505`, `#080808`), glowing crimson red highlights (`#FF1A1A`, `#E50914`), and zero generic templates.
- **Zero-Pill Typographic Discipline**: Clean unboxed metadata with subtle typographic separators (`·`, `/`) following strict design principles.
- **100% Professional Iconography**: All icons powered by Lucide Icons — zero emojis.
- **Full-Stack Backend**:
  - Express.js with REST API routes.
  - File-persisted ACID database with automatic initial seed data.
  - Password hashing with Node.js standard cryptographic `scrypt`.
  - Rate limiting on sensitive endpoints (Contact Form and Auth).
  - Real visitor analytics and device telemetry.
- **Admin Command Console (`/admin`)**:
  - Full CRUD for Projects, Skills, Services, Experiences.
  - Transmission Inbox with message status workflows (`NEW`, `READ`, `REPLIED`, `ARCHIVED`).
  - Real-time Site Settings customizer (Bio, Stats, Availability, Contact email).
- **Interactive Micro-Interactions**:
  - Desktop custom cursor with magnetic hover expansion.
  - Interactive ember and starfield canvas with cursor repulsion.
  - Responsive mobile drawer navigation with backdrop blur.

---

## 2. Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Three.js, Lucide React
- **Backend**: Node.js, Express, tsx
- **Storage / Database**: File-persisted JSON database (`data/database.json`) with atomic writes and relational schemas
- **Security**: Cryptographic password hashing (`scrypt`), rate limiting, Bearer session tokens

---

## 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Port for the Express server (default: 3000)
PORT=3000

# Node Environment ('development' or 'production')
NODE_ENV=development

# Optional Gemini API Key
GEMINI_API_KEY=""

# Public Application URL
APP_URL="http://localhost:3000"
```

---

## 4. Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run in Development**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application with live Vite integration.

3. **Database & Seed Data**:
   The application automatically provisions and seeds `data/database.json` upon initial startup if the file does not exist.

4. **Admin Portal Credentials**:
   - Access: Click the lock icon in the top right navigation bar.
   - **Email**: `admin@reddragon.dev`
   - **Password**: `reddragon2026`

---

## 5. Production Build & Deployment

1. **Build Frontend**:
   ```bash
   npm run build
   ```

2. **Start Production Server**:
   ```bash
   NODE_ENV=production npm run start
   ```

---

## 6. License

Proprietary © 2026 Red Dragon Portfolio. All rights reserved.
