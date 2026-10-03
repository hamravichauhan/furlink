# 🐾 FurLink

**A production-ready animal welfare platform connecting rescuers, adopters, and donors with community animals that need care.**

FurLink combines real-time rescue reporting, a verified pet adoption catalog, humane sterilization (TNVR) tracking with certificate verification, community recovery stories, and transparent donation handling — all on a modern Next.js + Prisma + Supabase stack.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [1. Clone & install](#1-clone--install)
  - [2. Supabase project](#2-supabase-project)
  - [3. Clerk authentication](#3-clerk-authentication)
  - [4. Cloudinary media](#4-cloudinary-media)
  - [5. Razorpay payments](#5-razorpay-payments)
  - [6. Environment variables](#6-environment-variables)
  - [7. Database schema](#7-database-schema)
  - [8. Promote yourself to admin](#8-promote-yourself-to-admin)
- [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Roles & Permissions](#roles--permissions)
- [Verification Workflow](#verification-workflow)
- [Known Constraints & Workarounds](#known-constraints--workarounds)
- [Deploying to Production](#deploying-to-production)
- [Pushing to GitHub](#pushing-to-github)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

### 🆘 Rescue Reporting

- Geolocation-enabled rescue reports with photos
- Public feed of active and resolved cases
- Status lifecycle: `REPORTED → IN_PROGRESS → RESCUED → CLOSED`
- Admin status management

### 🐾 Pet Adoption

- Adoption catalog with species filters and status tabs
- Individual pet profiles with photo galleries
- Direct application submission from pet detail page
- Admin review queue: approve or reject applications
- Auto-updates pet status when an application is approved

### 💉 Sterilization & Vaccination (TNVR)

- Rate-limited request submission (3/day, 30-min cooldown, 5-pending cap)
- Duplicate detection by location
- Interactive map picker for precise coordinates
- Rescuer assignment with scheduling
- **Certificate-based verification workflow** — rescuers upload proof, verified users approve
- Public verification timeline with full audit trail

### 📖 FurStories

- Community-published recovery stories with multi-photo support
- Search, sort, and "my stories" filtering
- Owner-editable, admin-moderatable
- Paginated feed

### ❤️ Donations

- Razorpay-powered checkout (INR, custom amounts)
- Server-side signature verification
- Idempotent donation recording
- Public transparency: total raised, recent supporters

### ⚙️ Admin Console

- Role-based access control: `USER`, `VERIFIER`, `ADMIN`
- User management with promote/demote
- Live metrics dashboard
- Verification queue
- Rescue and adoption operations pages

---

## Tech Stack

| Layer          | Technology                                             |
| -------------- | ------------------------------------------------------ |
| Framework      | **Next.js 16** (App Router, Turbopack, Server Actions) |
| Language       | **TypeScript**                                         |
| Database       | **PostgreSQL** (via Supabase)                          |
| ORM            | **Prisma 6**                                           |
| Authentication | **Clerk Core 3**                                       |
| Media          | **Cloudinary** (unsigned upload preset)                |
| Payments       | **Razorpay** (INR, test mode by default)               |
| Maps           | **Leaflet** + OpenStreetMap (no API key required)      |
| Styling        | **Tailwind CSS 4**                                     |
| Icons          | **Lucide React**                                       |
| Charts         | **Recharts**                                           |
| UI Primitives  | **Shadcn UI** patterns                                 |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App Router                   │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐  │
│  │ Server       │  │  Route        │  │  Client      │  │
│  │ Components   │  │  Handlers     │  │  Components  │  │
│  │ (RSC)        │  │  (/api/*)     │  │  ('use client')│ │
│  └──────┬───────┘  └───────┬───────┘  └──────┬───────┘  │
│         │                  │                  │          │
│         └──────────────────┼──────────────────┘          │
│                            ▼                             │
│                  ┌──────────────────┐                    │
│                  │ Server Actions   │                    │
│                  │ (src/actions/*)  │                    │
│                  └────────┬─────────┘                    │
└───────────────────────────┼──────────────────────────────┘
                            │
        ┌───────────────────┼────────────────────┐
        ▼                   ▼                    ▼
   ┌─────────┐        ┌──────────┐        ┌──────────────┐
   │ Prisma  │        │ Clerk    │        │  External    │
   │ Client  │        │ Auth     │        │  APIs        │
   └────┬────┘        └──────────┘        │  ·Cloudinary │
        │                                 │  ·Razorpay   │
        ▼                                 │  ·Nominatim  │
   ┌─────────────────┐                    └──────────────┘
   │ Supabase        │
   │ PostgreSQL      │
   │ (via pooler)    │
   └─────────────────┘
```

**Key architectural decisions:**

- **Server Actions over API routes** for mutations — cleaner auth, automatic serialization, fits App Router idiom
- **Return-object pattern** (`{ success: true } | { success: false; error }`) instead of throwing — avoids `NEXT_REDIRECT` pitfalls
- **Role hierarchy** in the DB (`USER < VERIFIER < ADMIN`) enforced server-side, never trusted from client
- **Certificate verification layer** — the trust mechanism that makes FurLink more than a form-filler
- **Supavisor pooler** — Supabase's connection pooler, required for Prisma on serverless

---

## Prerequisites

| Requirement        | Version      | Notes                                    |
| ------------------ | ------------ | ---------------------------------------- |
| Node.js            | 20+          | Required by Next.js 16                   |
| npm                | 10+          | Ships with Node 20                       |
| Supabase account   | Free tier OK | [supabase.com](https://supabase.com)     |
| Clerk account      | Free tier OK | [clerk.com](https://clerk.com)           |
| Cloudinary account | Free tier OK | [cloudinary.com](https://cloudinary.com) |
| Razorpay account   | Test mode OK | [razorpay.com](https://razorpay.com)     |
| Git                | Any          | For version control                      |

---

## Setup

### 1. Clone & install

```bash
git clone <your-repo-url> furlink
cd furlink
npm install
```

### 2. Supabase project

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Note your **project reference** (looks like `abcdefghijklmnop`) and **database password**
3. Go to **Settings → Database → Connection string** and copy:
   - **Transaction pooler** URI (port `6543`) → this is your `DATABASE_URL`
   - **Session pooler** URI (port `5432`) → this is your `DIRECT_URL`

⚠️ **Important:** On newer Supabase projects, the `db.<ref>.supabase.co` direct host may not resolve. Use the **session pooler** on `5432` for `DIRECT_URL` instead — it handles migrations correctly.

⚠️ **Important:** If your DB password contains special characters (`@`, `:`, `/`, `?`, `#`, `&`, `%`), you must URL-encode them:

- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- Or simpler: reset the password to **alphanumeric-only** so no encoding is needed

### 3. Clerk authentication

1. Create an application at [dashboard.clerk.com](https://dashboard.clerk.com)
2. Copy:
   - **Publishable key** (`pk_test_...`) → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret key** (`sk_test_...`) → `CLERK_SECRET_KEY`
3. Under **User & Authentication → Social Connections**, enable whichever providers you want (Google, GitHub, email/password)
4. Under **Paths**, set:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/`
   - After sign-up: `/`

### 4. Cloudinary media

1. Create an account at [cloudinary.com](https://cloudinary.com)
2. From the Dashboard, note your **Cloud name**, **API Key**, **API Secret**
3. Go to **Settings → Upload → Upload presets → Add upload preset**
4. Configure:
   - **Signing mode:** Unsigned
   - **Folder:** `furlink`
   - **Maximum files per request:** `6` (important for multi-photo uploads)
   - **Client-side allowed formats:** `jpg,jpeg,png,webp,pdf`
5. Note the **preset name** (e.g. `furlink_unsigned`)

### 5. Razorpay payments

1. Create an account at [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Toggle to **Test Mode** (top-right)
3. Go to **Settings → API Keys → Generate Test Key**
4. Copy:
   - **Key ID** (`rzp_test_...`) → `RAZORPAY_KEY_ID` and `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - **Key Secret** → `RAZORPAY_KEY_SECRET`

For production, register a webhook at **Settings → Webhooks**:

- URL: `https://yourdomain.com/api/razorpay/webhook`
- Events: `payment.captured`, `payment.failed`
- Copy the signing secret → `RAZORPAY_WEBHOOK_SECRET`

### 6. Environment variables

Create `.env` at the project root:

```bash
# ─── Database ───────────────────────────────────────────────
# Transaction pooler (port 6543) — for app runtime queries
DATABASE_URL="postgresql://postgres.<PROJECT_REF>:<PASSWORD>@aws-0-<REGION>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5&pool_timeout=20&connect_timeout=30"

# Session pooler (port 5432) — for migrations & DDL
DIRECT_URL="postgresql://postgres.<PROJECT_REF>:<PASSWORD>@aws-0-<REGION>.pooler.supabase.com:5432/postgres?sslmode=no-verify"

# ─── Clerk ──────────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# ─── Cloudinary ─────────────────────────────────────────────
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="furlink_unsigned"
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# ─── Razorpay ───────────────────────────────────────────────
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_WEBHOOK_SECRET="..."  # Optional, for webhook verification
```

Save this file as `.env`. **Do not commit it to git** — it's already in `.gitignore`.

### 7. Database schema

Because Prisma's Rust engine struggles with Supabase's Supavisor pooler, we apply schema changes via a Node + `pg` script rather than `prisma db push`.

**Step 1 — Generate the client:**

```bash
npx prisma generate
```

**Step 2 — Apply the schema:**

The schema is defined in `prisma/schema.prisma`. To create the tables, run the migration script:

```bash
node scripts/apply-schema.js
```

If `scripts/apply-schema.js` doesn't exist, create it from the SQL in `scripts/schema.sql`:

```bash
# Or manually apply SQL if you have a fresh DB
node -e "
const fs = require('fs');
const { Client } = require('pg');
const sql = fs.readFileSync('scripts/schema.sql', 'utf8');
const c = new Client({
  connectionString: process.env.DIRECT_URL.replace('?sslmode=no-verify', ''),
  ssl: { rejectUnauthorized: false },
});
c.connect()
 .then(() => c.query(sql))
 .then(() => { console.log('✅ Schema applied'); return c.end(); })
 .catch(e => { console.error(e.message); process.exit(1); });
"
```

**Step 3 — Verify:**

```bash
npx prisma studio
```

Opens at `http://localhost:5555`. You should see tables: `User`, `RescueReport`, `Pet`, `AdoptionApplication`, `Donation`, `SterilizationRequest`, `FurStory`, `FurStoryImage`.

### 8. Promote yourself to admin

After signing up once in the app (so your User row exists), promote yourself:

```bash
node -e "
const { Client } = require('pg');
const c = new Client({
  connectionString: process.env.DIRECT_URL.replace('?sslmode=no-verify', ''),
  ssl: { rejectUnauthorized: false },
});
const EMAIL = 'your.email@example.com';  // ← replace
c.connect()
 .then(() => c.query('UPDATE \"User\" SET role = \$1, \"roleUpdatedAt\" = NOW() WHERE email = \$2 RETURNING id, email, role', ['ADMIN', EMAIL]))
 .then(r => { console.log('Promoted:', r.rows[0]); return c.end(); })
 .catch(e => { console.error(e.message); process.exit(1); });
"
```

Now sign out and back in (to refresh the session), then visit `/admin`.

---

## Running Locally

```bash
npm run dev
```

Opens at **http://localhost:3000**

### Available scripts

| Command               | Purpose                                 |
| --------------------- | --------------------------------------- |
| `npm run dev`         | Start dev server with Turbopack         |
| `npm run build`       | Production build                        |
| `npm run start`       | Start production server (after `build`) |
| `npm run lint`        | Run ESLint                              |
| `npx prisma generate` | Regenerate Prisma client from schema    |
| `npx prisma studio`   | Open DB browser at :5555                |
| `npx prisma db pull`  | Introspect DB and update schema         |

### Test accounts

For testing multi-user workflows (requester → rescuer → verifier), sign up multiple Clerk accounts, or use Clerk's **test mode** which lets you impersonate users.

### Testing payments

Razorpay test mode accepts these:

| Method       | Test value                     |
| ------------ | ------------------------------ |
| Visa card    | `4100 2800 0000 1007`          |
| Mastercard   | `5555 5100 0008 1006`          |
| CVV / Expiry | Any 3 digits / any future date |
| UPI          | `success@razorpay`             |

---

## Project Structure

```
furlink/
├── prisma/
│   ├── schema.prisma              # DB schema (models, enums)
│   └── migrations/                # (empty — see Known Constraints)
├── scripts/
│   ├── schema.sql                 # Full DDL for initial setup
│   ├── verification-flow.sql      # Migration: verification system
│   ├── sterilization-workflow.sql # Migration: workflow fields
│   ├── sterilization-location.sql # Migration: lat/lng fields
│   └── admin-diagnostic.js        # DB health check utility
├── public/                        # Static assets
├── src/
│   ├── actions/                   # Server Actions (mutations)
│   │   ├── adoption.ts            # Pet listings + applications
│   │   ├── admin-adoptions.ts     # Admin: approve/reject apps
│   │   ├── admin-rescues.ts       # Admin: update rescue status
│   │   ├── admin-stats.ts         # Admin: dashboard metrics
│   │   ├── admin-users.ts         # Admin: promote/demote users
│   │   ├── donation.ts            # Razorpay order + verify
│   │   ├── rescue.ts              # Rescue reporting
│   │   ├── sterilization.ts       # TNVR workflow
│   │   └── story.ts               # FurStories CRUD
│   ├── app/                       # Next.js App Router
│   │   ├── admin/                 # Admin console (role-gated)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Metrics dashboard
│   │   │   ├── adoptions/
│   │   │   ├── rescues/
│   │   │   ├── users/
│   │   │   └── verifications/
│   │   ├── adoptions/             # Pet adoption catalog
│   │   │   ├── page.tsx           # Catalog
│   │   │   ├── new/page.tsx       # List a pet
│   │   │   └── [id]/
│   │   │       ├── page.tsx       # Pet detail
│   │   │       └── adoption-form.tsx
│   │   ├── api/
│   │   │   └── razorpay/
│   │   │       ├── verify/route.ts
│   │   │       └── webhook/route.ts
│   │   ├── donate/
│   │   │   ├── page.tsx
│   │   │   ├── checkout-form.tsx
│   │   │   └── success/page.tsx
│   │   ├── rescues/
│   │   │   ├── page.tsx           # Public feed
│   │   │   └── new/page.tsx       # Report form
│   │   ├── sign-in/[[...sign-in]]/
│   │   ├── sign-up/[[...sign-up]]/
│   │   ├── sterilization/
│   │   │   ├── page.tsx           # Feed + form
│   │   │   ├── sterilization-form.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx       # Detail + timeline
│   │   │       ├── request-actions.tsx
│   │   │       └── mini-map.tsx
│   │   ├── stories/
│   │   │   ├── page.tsx           # Feed
│   │   │   ├── new/page.tsx       # Create
│   │   │   └── [id]/
│   │   │       ├── page.tsx       # Detail
│   │   │       ├── story-actions.tsx
│   │   │       └── edit/
│   │   ├── verify/                # Verifier queue (role-gated)
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── verify-actions.tsx
│   │   ├── globals.css            # Tailwind + Leaflet CSS
│   │   ├── layout.tsx             # Root layout + navbar
│   │   └── page.tsx               # Landing page
│   ├── components/                # Reusable UI
│   │   ├── navbar.tsx             # Role-aware nav (server)
│   │   ├── navbar-client-links.tsx
│   │   ├── image-upload.tsx       # Cloudinary single-image
│   │   ├── multi-image-upload.tsx # Cloudinary multi-image
│   │   ├── location-picker.tsx    # Leaflet map + address
│   │   ├── story-card.tsx
│   │   ├── stories-filter.tsx
│   │   └── ui/                    # Shadcn primitives
│   ├── lib/
│   │   ├── auth-helpers.ts        # hasRole, requireAdmin, requireVerifier
│   │   ├── auth-sync.ts           # Clerk → Prisma user sync
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── razorpay.ts            # Razorpay SDK instance
│   │   ├── sterilization-constants.ts
│   │   └── validation.ts          # Input validators
│   ├── types/
│   │   └── index.ts               # Shared types
│   └── middleware.ts              # clerkMiddleware()
├── .env                           # (not committed)
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Roles & Permissions

FurLink has three roles stored on `User.role`:

| Role         | Can do                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **USER**     | Report rescues · List pets · Apply to adopt · Request sterilization · Accept requests as rescuer · Submit proof · Publish stories · Donate |
| **VERIFIER** | Everything a USER can do, plus verify or dispute sterilization proofs                                                                      |
| **ADMIN**    | Everything above, plus: promote/demote users · resolve disputes · manage rescue/adoption statuses · access `/admin`                        |

**Enforcement is server-side.** Every role check goes through `src/lib/auth-helpers.ts`:

```typescript
import { hasRole, requireAdmin, requireVerifier } from "@/lib/auth-helpers";

// In a server action
const user = await getOrCreateCurrentUser();
if (!hasRole(user, "VERIFIER")) return { success: false, error: "Forbidden" };

// In a page
await requireAdmin(); // redirects to /sterilization if not admin
```

Never trust role from the client — always re-fetch and re-check on the server.

---

## Verification Workflow

The sterilization module uses a three-party trust model:

```
┌────────────┐      ┌────────────┐      ┌────────────┐
│ Requester  │      │  Rescuer   │      │  Verifier  │
│ (reports)  │      │ (does it)  │      │ (confirms) │
└──────┬─────┘      └──────┬─────┘      └──────┬─────┘
       │                   │                    │
       │ submit request    │                    │
       ├──────────────────▶│                    │
       │                   │ accept             │
       │                   ├──────────────────▶ │
       │                   │                    │
       │                   │ do work + upload   │
       │                   │ certificate        │
       │                   ├──────────────────▶ │
       │                   │                    │
       │                   │                    │ verify or
       │                   │                    │ dispute
       │                   │                    │
```

**Statuses:**

| Status            | Meaning                                 | Who acts next                    |
| ----------------- | --------------------------------------- | -------------------------------- |
| `PENDING`         | Waiting for a rescuer                   | Any signed-in user (≠ requester) |
| `SCHEDULED`       | Rescuer assigned                        | Rescuer                          |
| `PROOF_SUBMITTED` | Certificate uploaded, awaiting review   | VERIFIER or ADMIN                |
| `VERIFIED`        | Certificate confirmed — public, trusted | Nobody (terminal)                |
| `DISPUTED`        | Someone flagged the proof               | VERIFIER or ADMIN                |
| `CANCELLED`       | Terminated by requester or admin        | Nobody (terminal)                |

**Why this matters:** The verifier layer is what makes FurLink trustworthy. A certificate isn't "real" just because someone uploaded it — it's real because a named human with domain knowledge confirmed it. This is the difference between a form-filler and a platform donors can trust.

---

## Known Constraints & Workarounds

### Prisma migrations don't work on this Supabase setup

`prisma migrate dev` and `prisma db push` hang or fail with `P1001` because Prisma's Rust engine can't complete the TLS handshake with Supavisor's session pooler at `5432`.

**Workaround:** Apply schema changes via raw SQL through Node's `pg` driver:

```bash
node scripts/apply-schema.js
```

Or for individual migrations:

```bash
node -e "
const fs = require('fs');
const { Client } = require('pg');
const sql = fs.readFileSync('scripts/verification-flow.sql', 'utf8');
const c = new Client({
  connectionString: process.env.DIRECT_URL.replace('?sslmode=no-verify', ''),
  ssl: { rejectUnauthorized: false },
});
c.connect()
 .then(() => c.query(sql))
 .then(() => { console.log('✅ Applied'); return c.end(); })
 .catch(e => { console.error(e.code, e.message); process.exit(1); });
"
```

`prisma generate` and `prisma db pull` work fine — they don't need the DDL path.

**Long-term fix:** Add Supabase's IPv4 add-on ($4/mo) to provision a real `db.<ref>.supabase.co` direct host.

### `NEXT_REDIRECT` swallowing in client `try/catch`

Server actions that call `redirect()` throw a special `NEXT_REDIRECT` error. If a client component wraps the action call in `try/catch`, the redirect is swallowed and the button stays in loading state.

**Workaround:** FurLink server actions return objects instead of redirecting:

```typescript
// Server
return { success: true, requestId: "abc" };

// Client
const res = await createThing(formData);
if (res.success) {
  router.push(`/things/${res.requestId}`);
}
```

This sidesteps the entire `NEXT_REDIRECT` class of bugs.

### Clerk Core 3 API changes

Deprecated `authMiddleware()` and `createRouteMatcher()` throw at runtime. FurLink uses:

```typescript
// src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
```

And `<SignedIn>` / `<SignedOut>` are replaced by `<Show when="signed-in">` / `<Show when="signed-out">` in Clerk Core 3.

### `next/image` crashes on invalid URLs

`<Image src="not-a-url">` throws `Failed to construct 'URL': Invalid URL` and crashes the entire page.

**Workaround:** For any user-provided image URL, use a plain `<img>` with a validity guard:

```typescript
const isUrl = (u: string) => /^https?:\/\/.+/i.test(u);

{isUrl(url) ? <img src={url} alt="" /> : <div>Fallback</div>}
```

Or whitelist domains in `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
  ],
},
```

### Leaflet marker icons 404 in production

Bundlers don't resolve Leaflet's default marker images. FurLink overrides them explicitly in `location-picker.tsx` and `mini-map.tsx`:

```typescript
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
```

---

## Deploying to Production

### Vercel (recommended)

1. Push your repo to GitHub
2. Import it at [vercel.com/new](https://vercel.com/new)
3. Add **all environment variables** from your `.env` in **Project Settings → Environment Variables**
4. **Important:** Use the **transaction pooler** (port `6543`) for `DATABASE_URL` in production. This is what the pooler is designed for.
5. For `DIRECT_URL`, keep the session pooler (`5432`) — Vercel's build environment can reach it for schema operations.
6. Deploy

### Post-deploy checklist

- [ ] Environment variables are set in the hosting platform
- [ ] Clerk **production keys** are swapped in (create a production instance in Clerk)
- [ ] Cloudinary upload preset allows your production domain
- [ ] Razorpay is switched to **live mode** with production keys
- [ ] Razorpay webhook is registered pointing to `https://yourdomain.com/api/razorpay/webhook`
- [ ] Supabase **IPv4 add-on** is enabled if using migrations in CI
- [ ] Domain is added to Clerk's allowed origins
- [ ] `NEXT_PUBLIC_*` variables are rebuilt (they're baked in at build time)

---

## Pushing to GitHub

### First-time push

```bash
# Initialize git (if not already done)
git init

# Check what git sees
git status

# Verify .env is NOT in the list. If it is, stop and add it to .gitignore first.
```

**Verify `.gitignore` includes:**

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Next.js
.next/
out/
build/
dist/

# Environment
.env
.env.local
.env.*.local

# Prisma
prisma/migrations/*.lock

# Editor
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Misc
/tmp/
.vercel
*.tsbuildinfo
next-env.d.ts
```

**Then commit and push:**

```bash
# Stage everything
git add .

# Verify .env is not staged
git status | grep ".env"
# If it shows .env, run: git reset HEAD .env

# Commit
git commit -m "Initial commit: FurLink animal welfare platform"

# Create repo on GitHub (via web or gh CLI)
gh repo create furlink --public --source=. --remote=origin --push

# Or manually:
git remote add origin https://github.com/yourusername/furlink.git
git branch -M main
git push -u origin main
```

### If you accidentally committed `.env`

**Do this immediately:**

```bash
# 1. Remove from git tracking
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "Remove .env from tracking"

# 2. Rotate EVERY secret in .env:
#    - Supabase database password
#    - Clerk secret key
#    - Cloudinary API secret
#    - Razorpay key secret
#    - Any webhook secrets

# 3. Force push to overwrite history (only if it's your own private repo)
git push --force origin main

# 4. If it's public, use git-filter-repo or BFG Repo Cleaner
#    to purge the secret from history, then force push.
```

The rules: **every secret that was ever committed must be treated as compromised and rotated.** Even if you delete the file, it's in git history forever.

### Ongoing workflow

```bash
# Pull latest
git pull

# Create a feature branch
git checkout -b feature/some-change

# Make changes, then
git add .
git commit -m "Add some feature"
git push -u origin feature/some-change

# Open PR on GitHub, review, merge
```

### Common git ignores to double-check before your first push

```bash
# Make sure these are NOT in git
git ls-files | grep -E "\.env|node_modules|\.next"
# Should return nothing
```

---

## Troubleshooting

### `P1001: Can't reach database server`

**Causes & fixes:**

| Cause                           | Fix                                                                        |
| ------------------------------- | -------------------------------------------------------------------------- |
| Wrong port for `DATABASE_URL`   | Use `6543` (transaction pooler) for runtime, `5432` for `DIRECT_URL`       |
| Password has special characters | URL-encode them, or reset the password to alphanumeric-only                |
| Username missing tenant suffix  | Pooler requires `postgres.<project-ref>`, not just `postgres`              |
| Trailing whitespace in `.env`   | Run `cat -vet .env` to reveal hidden chars                                 |
| Project paused                  | Free-tier projects pause after 7 days idle — restore in Supabase dashboard |

### `Timed out fetching a new connection from the connection pool`

Increase `connection_limit` and add `pool_timeout`:

```
?pgbouncer=true&connection_limit=5&pool_timeout=20&connect_timeout=30
```

Clear caches after changing `.env`:

```bash
rm -rf .next node_modules/.prisma
npx prisma generate
npm run dev
```

### `Failed to construct 'URL': Invalid URL`

Somewhere a `<Image>` component is receiving a non-URL string. Find it:

```bash
grep -rn "next/image" src/
```

For each match, either guard with `/^https?:\/\//i.test(url)` or swap to `<img>`.

### Leaflet map tiles won't load

Check the browser Network tab for `tile.openstreetmap.org`. If blocked (corporate network, region restrictions), swap the tile URL in `location-picker.tsx` and `mini-map.tsx`:

```typescript
// Alternative: CartoDB Positron
L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
}).addTo(map);
```

### Clerk `auth()` returns null in a server component

Clerk's request context requires `clerkMiddleware()` to have run for that request. Verify:

1. `src/middleware.ts` exists and exports `clerkMiddleware()`
2. The route matches the `matcher` config
3. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are both set

### Razorpay payment succeeds but no Donation row appears

The browser callback didn't fire (user closed tab, network dropped). This is what the **webhook** is for. Verify:

1. `RAZORPAY_WEBHOOK_SECRET` is set
2. Webhook endpoint is registered in Razorpay dashboard
3. Webhook URL is publicly reachable (use `ngrok http 3000` for local testing)

### `npm run build` fails with type errors

```bash
# Clear caches and rebuild
rm -rf .next node_modules/.cache
npx prisma generate
npm run build
```

If specific type errors persist, restart the TS server in your editor:

- VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

### Editor shows stale content after terminal write

Some editors (particularly VS Code with autosave) keep an in-memory buffer that overwrites terminal writes. To avoid:

1. **Close the file's tab** before running terminal commands that write to it
2. **Reopen the file** after the command completes (it reads from disk)
3. If the file reverts, your editor autosaved a stale buffer

---

## License

MIT — free to use, modify, and distribute.

---

## Contributing

Issues and PRs welcome. For major changes, open an issue first to discuss.

**When contributing:**

1. Follow the existing patterns (`{ success, error }` returns, role checks via `auth-helpers`, image guards)
2. Test with multiple user roles — the app's value is in the workflow, not just the UI
3. Never commit `.env`
4. Update this README if you add new setup steps

---

## Credits

Built with care for the animals who can't ask for help.

🐾
