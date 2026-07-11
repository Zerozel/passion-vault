```markdown
# Passion Vault

**Remember why you started.**

Passion Vault is a personal evidence system. It preserves the moments, emotions, and identity behind your passion — then reconnects you with that version of yourself when life makes you forget.

> *People rarely lose passion overnight. They slowly lose connection with the version of themselves who first believed.*

---

## Table of Contents

- [What is Passion Vault?](#what-is-passion-vault)
- [The Philosophy](#the-philosophy)
- [How It Works](#how-it-works)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [AI Integration](#ai-integration)
- [Offline Architecture](#offline-architecture)
- [Design System](#design-system)
- [Deployment](#deployment)
- [Challenges & Lessons](#challenges--lessons)

---

## What is Passion Vault?

Passion Vault is **not** a journal. It's **not** a productivity app. It's **not** an AI chatbot.

It is a **personal evidence system**.

When you're excited about your dream, you record what you believe — through text, voice recordings, images, and emotion tags. Months later, when doubt creeps in and you've lost touch with why you started, your vault quietly resurfaces the moments that prove who you've been.

The AI inside Passion Vault doesn't generate motivation. It reconstructs identity using evidence you've left behind.

---

## The Philosophy

### Passion is Memory

Most people think passion is fuel — something that burns and eventually runs out. We believe passion is memory — something that fades when you lose connection with the version of yourself who first believed.

### Evidence Over Motivation

Motivation is cheap. "You've got this" is forgettable. But hearing your own voice from six months ago saying *"I don't care how hard this gets — I'm going to finish this"* — that's evidence. That reconnects you with something real.

### Immutability

Every memory in Passion Vault is frozen the moment you create it. You cannot edit it. Ever. Because memory becomes unreliable over time, but evidence doesn't.

### The Vault Metaphor

This isn't a dashboard. It's a vault. A place where your most meaningful moments are preserved, sealed, and protected. When you open it, you're not checking stats — you're walking into an archive of who you've been.

---

## How It Works

```
You capture a meaningful moment
        ↓
AI analyzes it — not to motivate, but to understand
        ↓
The system extracts emotional themes, lessons, and identity statements
        ↓
Over time, your timeline becomes living evidence of your journey
        ↓
"Remember Why" resurfaces forgotten memories with context
        ↓
You reconnect with the version of yourself who first believed
```

### The Core Loop

1. **Capture** — When conviction is high, record what you believe. Text, voice, images — freeze the moment before memory rewrites it.

2. **Reflect** — Gemini reads your words and extracts the emotional truth beneath them. Not generic motivation. Specific, evidence-based observations about who you are.

3. **Preserve** — Every entry becomes immutable. Your vault holds the truth of who you were — uneditable, unfiltered, real.

4. **Reconnect** — When doubt arrives, your vault quietly reminds you. Not with inspiration. With your own words. With evidence.

---

## Features

### Memory Creation

Write about moments that matter. Attach images. Record your voice. Tag your emotions. Every memory is preserved exactly as you lived it.

**The prompt you'll see:** *"What happened that your future self should never forget?"*

### AI Reflection

After every memory, Gemini generates:

- **Emotional Summary** — What this moment reveals about your state of mind
- **Lesson Learned** — The deeper insight embedded in this experience
- **Identity Statement** — A sentence about who you are, based on your own words

### Timeline

A chronological journey through your evidence. Cards fade in with staggered animations. Memories group by date. A subtle amber gradient runs down the timeline like a thread connecting your story.

### Remember Why (Signature Feature)

One click. Your vault searches through your memories — preferring older ones that carry more emotional weight — and resurfaces a forgotten moment with fresh AI context. The reveal is staged: searching → found → revealed. The reconnection message reads like a letter from your past self.

### Identity Evolution

Compare your earliest reflected memory with your most recent one. Gemini writes a narrative about how you've grown — not with metrics or graphs, but with honest observation. What changed? What endured? Who are you becoming?

### Time Capsules

Write a letter to your future self. Seal it with an unlock date. It sits in your vault — visible but unreadable — until that day arrives. When you open it, Gemini compares who you were at writing time with who you appear to be now. A conversation across time.

### Offline-First Architecture

Every memory saves to your device first. When you're offline, you still see "Preserved locally — will sync when connected." Your vault never fails because of a poor connection. Your memories stay with you.

### Progressive Web App

Install Passion Vault on your phone. It launches without browser chrome. Has its own icon on your home screen. Works offline. Feels indistinguishable from a thoughtfully designed native app.

### Theme System

Dark mode feels like reading in a quiet archive at night. Light mode feels like a warm library. System mode follows your device. Transitions are smooth. No flash of white.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS, CSS Custom Properties |
| **Components** | shadcn/ui (Nova theme) |
| **Animation** | CSS animations, Framer Motion |
| **Auth** | Supabase Auth (email/password) |
| **Database** | Supabase PostgreSQL with Row Level Security |
| **Storage** | Supabase Storage (images, voice recordings) |
| **Local DB** | Dexie.js (IndexedDB wrapper) |
| **AI** | Google Gemini (gemini-flash-lite-latest) |
| **PWA** | Custom Service Worker, Web App Manifest |
| **Deployment** | Vercel |
| **Package Manager** | npm |

---

## Project Structure

```
passion-vault/
│
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Login & Signup (no navigation)
│   ├── (vault)/dashboard/        # Protected vault pages
│   │   ├── new/                  # Memory creation
│   │   ├── timeline/             # Chronological journey
│   │   ├── remember/             # "Remember Why" feature
│   │   ├── identity/             # Identity evolution
│   │   ├── memories/[id]/        # Memory detail view
│   │   └── capsules/             # Time capsules
│   ├── api/ai/                   # Gemini API routes
│   ├── actions/                  # Server actions
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Design tokens & global styles
│
├── components/
│   ├── ui/                       # shadcn primitives
│   ├── auth/                     # Login & signup forms
│   ├── layout/                   # Shell, navigation, offline banner
│   ├── vault/                    # Dashboard, vault creation, capsules
│   ├── memories/                 # Memory form, timeline, reconnect
│   ├── shared/                   # Loading skeletons
│   └── providers/                # Theme & offline providers
│
├── lib/
│   ├── supabase/                 # Browser & server clients
│   ├── gemini.ts                 # AI prompt templates
│   ├── storage.ts                # Media upload to Supabase
│   ├── sync.ts                   # Offline sync engine
│   ├── db.ts                     # Local IndexedDB schema
│   └── utils.ts                  # Shared utilities
│
├── types/
│   └── index.ts                  # TypeScript interfaces
│
├── public/
│   ├── manifest.json             # PWA manifest
│   ├── sw.js                     # Service Worker
│   ├── register-sw.js            # SW registration
│   └── icons/                    # App icons
│
├── middleware.ts                 # Auth protection
├── next.config.ts
└── package.json
```

### Why This Structure?

- **Route Groups** `(auth)` and `(vault)` let us apply completely different layouts without affecting URLs. Auth pages have no navigation. Vault pages share a persistent shell with sidebar.
- **Server Components by default.** Only components that need interactivity (`"use client"`) use client-side rendering. Everything else runs on the server.
- **Separation of concerns.** Business logic lives in `lib/`. UI lives in `components/`. Types live in `types/`. No mixing.
- **API routes for AI.** All Gemini calls go through server-side endpoints. The API key never touches the client.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Supabase account
- A Google Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/Zerozel/passion-vault.git
cd passion-vault

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

### Environment Variables

Edit `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-key
```

### Database Setup

Run these in your Supabase SQL Editor:

1. Create tables (see [Database Schema](#database-schema) below)
2. Create a `memories` storage bucket with public access
3. Apply storage RLS policies

### Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

### Deploy

Connect your GitHub repo to Vercel. Add the three environment variables. Deploy.

---

## Database Schema

### Three Core Tables

#### `vaults`

Each user has exactly one vault. It stores their dream, mission, and the reason they started.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users |
| display_name | TEXT | What we call you |
| dream_title | TEXT | Your dream in one line |
| mission | TEXT | What you're building toward |
| why_i_started | TEXT | The original reason |
| created_at | TIMESTAMPTZ | When the vault was created |
| updated_at | TIMESTAMPTZ | Last modified |

#### `memories`

Every meaningful moment. Immutable after creation.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| vault_id | UUID | References vaults |
| user_id | UUID | References auth.users |
| title | TEXT | What you called this moment |
| content | TEXT | The story |
| emotion | TEXT | Hope, gratitude, fear, joy, etc. |
| image_url | TEXT | Optional image |
| voice_url | TEXT | Optional voice recording |
| video_url | TEXT | Optional video |
| created_at | TIMESTAMPTZ | When captured |

**Important:** There is no UPDATE policy on memories. Once created, they cannot be edited. Only soft-deleted.

#### `ai_reflections`

One per memory. Gemini's analysis.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| memory_id | UUID | References memories (UNIQUE) |
| user_id | UUID | References auth.users |
| emotional_summary | TEXT | What this moment held |
| lesson_learned | TEXT | What you discovered |
| identity_statement | TEXT | Who you were becoming |
| created_at | TIMESTAMPTZ | When generated |

#### `time_capsules`

Sealed letters to your future self.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users |
| title | TEXT | Capsule name |
| letter | TEXT | The sealed message |
| unlock_date | DATE | When it opens |
| mood | TEXT | Optional mood tag |
| image_url | TEXT | Optional image |
| voice_url | TEXT | Optional voice |
| opened | BOOLEAN | Has it been opened? |
| opened_at | TIMESTAMPTZ | When it was opened |
| ai_reflection | TEXT | AI comparison after opening |
| created_at | TIMESTAMPTZ | When sealed |

### Row Level Security

Every table has RLS enabled. Users can only:

- SELECT their own rows (`auth.uid() = user_id`)
- INSERT with their own user_id
- UPDATE their own rows (where allowed)
- DELETE their own rows

Storage buckets follow the same pattern — folder names start with the user's ID.

---

## AI Integration

### Three Distinct Prompts

Passion Vault uses Gemini for three different purposes. Each has its own carefully designed prompt.

#### 1. Reflection (after every memory)

Analyzes a single memory and returns structured JSON with emotional summary, lesson learned, and identity statement.

#### 2. Reconnection (Remember Why)

Generates a fresh message that reconnects the user with a forgotten memory. The tone is quiet and observant — like a letter from their past self.

#### 3. Comparison (Identity Evolution & Time Capsules)

Compares two points in time and writes a narrative about growth, change, and what's endured.

### The Honesty Constraint

All three prompts share one critical rule:

> *"If the user's writing reveals fear, uncertainty, or struggle, do not minimize it. Acknowledge it honestly. The goal is not to make them feel better — it is to help them see themselves clearly."*

This prevents Gemini from defaulting to positivity bias. Sometimes a memory is about doubt, and the AI must honor that.

### Model

We use `gemini-flash-lite-latest` — a lightweight model alias that's fast, reliable, and handles our structured prompts well.

---

## Offline Architecture

Passion Vault is **local-first**. Every memory saves to your device before touching the network.

### The Flow

```
You write a memory
        ↓
Saved to IndexedDB (Dexie.js)
        ↓
"Preserved locally" confirmation
        ↓
Are you online?
    ├── Yes → Upload to Supabase → Trigger AI reflection
    └── No  → Queued. Will sync when connected.
```

### Sync States

Every local record has a `syncStatus`:

- **pending** — Saved locally, waiting for upload
- **synced** — Uploaded to Supabase, AI reflection triggered
- **failed** — Upload failed, will retry

### Service Worker

The custom service worker (`public/sw.js`) caches:

- The application shell (HTML, CSS, JS)
- Fonts and icons
- Previously viewed pages

API calls to Supabase and Gemini are **not** cached — they always go to the network when available.

### When You Go Offline

- The top banner quietly says: *"You're offline. Your vault is still open."*
- You can create memories, browse cached pages, view existing evidence
- New memories show: *"Preserved locally. Will sync when connected."*
- When connectivity returns, syncing happens automatically

---

## Design System

### Color Palette

**Dark Theme (Twilight)**

- Background: Deep indigo-black `#0a0a12`
- Surface: Muted violet-gray
- Text: Warm off-white
- Accent: Soft amber `#c9a84c` (hope, warmth)
- Rose: Muted rose `#b5767a` (emotion, tenderness)

**Light Theme (Parchment)**

- Background: Warm off-white `#faf8f5`
- Surface: Soft cream
- Text: Deep charcoal
- Accent: Rich amber `#b8860b`
- Rose: Dusty rose `#c77d7d`

### Typography

- **Geist Sans** — primary font, clean and modern
- **Geist Mono** — monospace for numbers and technical elements
- Generous line height for body text
- Large headings with tight tracking
- Small uppercase labels with wide tracking for section headers

### Visual Language

- **Glassmorphism** — translucent panels with backdrop blur create depth
- **Ambient glow** — subtle radial gradients behind key elements
- **Rounded corners** — consistent `rounded-xl` throughout
- **Soft shadows** — amber-tinted shadows on elevated elements
- **Staggered animations** — cards fade in with increasing delays
- **Hover lift** — cards rise slightly on hover with a subtle shadow

### Motion Philosophy

No bouncing. No dramatic movements. No exaggerated easing. Every animation should disappear into the experience. The application should feel **alive**, not **animated**.

---

## Deployment

The app is deployed on Vercel at [passionvault-phi.vercel.app](https://passionvault-phi.vercel.app).

### Environment Variables (Vercel)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
GEMINI_API_KEY
```

### Supabase Configuration

- **Site URL:** Your Vercel deployment URL
- **Redirect URLs:** Your Vercel URL + `/**`
- **Auth:** Email/password enabled

---

## Challenges & Lessons

### Gemini Rate Limiting

The free tier for Gemini 2.0 models was completely exhausted across multiple Google Cloud projects. Creating new API keys in fresh projects didn't help — they share the same quota pools. Adding billing with a virtual card was rejected by Google Cloud.

**Solution:** We discovered `gemini-flash-lite-latest`, a model alias with its own separate quota pool. It worked immediately and proved more than capable for our needs.

**Lesson:** When specific model versions are rate-limited, try the `-latest` aliases.

### Next.js 16 + next-pwa

`next-pwa` uses Webpack configuration, but Next.js 16 defaults to Turbopack. The build failed with a confusing error about incompatible config.

**Solution:** Removed `next-pwa` entirely and implemented the service worker manually. A 30-line `sw.js` and a 5-line registration script were all we needed.

**Lesson:** PWA capabilities don't require heavy libraries. A custom service worker gives you more control with less code.

### Storage RLS Policies

Image uploads worked locally but failed in production with row-level security violations. The storage bucket was created but RLS policies weren't applied.

**Solution:** Added explicit INSERT, SELECT, and DELETE policies on `storage.objects` with folder-scoped user checks.

**Lesson:** Supabase Storage has its own RLS system separate from database RLS. Both need to be configured.

### Immutable Architecture

Making memories truly immutable (no UPDATE policy) forced us to think carefully about every feature. Features like "edit" had to be reimagined or removed. This constraint made the product stronger — it reinforced the philosophy that evidence shouldn't be rewritten.

### Mobile Theme Provider

The mobile navigation used React Context for theming, but the provider wasn't available during server-side rendering, causing crashes.

**Solution:** Moved theme state management to localStorage with a polling interval for cross-component sync. The mobile nav became self-sufficient.

**Lesson:** Not everything needs React Context. Sometimes localStorage plus polling is simpler and more reliable.

---

*Built for the days you forget who you are.*
```