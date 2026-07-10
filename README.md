# Nexus CRM

**Full-stack revenue operations console** — a multi-module CRM with a premium Next.js control plane and an Express/Node API. Built to demonstrate senior product engineering: typed domain models, modular UI architecture, JWT auth, REST CRUD, and a clear live / stub / external feature matrix.

| Layer | Stack | Default URL |
|---|---|---|
| Frontend | Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · GSAP | http://localhost:3000 |
| Backend | **TypeScript** · Node.js · Express 5 · JWT · JSON file store | http://127.0.0.1:8001 |

**Backend language is TypeScript** (strict `tsc`, Express routes typed end-to-end). An earlier FastAPI / Python prototype was removed. Plain JavaScript sources were migrated to `.ts` — run with `tsx` in development and `tsc` → `dist/` for production.

---

## Why this project

Hiring managers and recruiters can evaluate:

- **Product surface area** — dashboard, leads, deals (kanban + list), contacts, analytics, automations, notifications, settings, feature catalog, login
- **Frontend craft** — App Router, design tokens, reusable primitives, GSAP motion, readable premium UI
- **Backend craft** — TypeScript Express REST API, JWT + role guards, seeded demo data, feature registry
- **System thinking** — API contract documented in the frontend, honest status labels for incomplete / third-party modules

---

## Quick start

### Prerequisites

- Node.js 20+ (recommended)
- npm 10+
- No Python / pip — backend is **TypeScript + Express** only

### 1) Backend

```bash
cd backend
npm install
copy .env.example .env   # Windows
# cp .env.example .env   # macOS / Linux
npm run dev
```

- API: http://127.0.0.1:8001  
- Health: http://127.0.0.1:8001/health  

### 2) Frontend

```bash
cd frontend
npm install
copy .env.local.example .env.local   # Windows
# cp .env.local.example .env.local   # macOS / Linux
npm run dev
```

- App: http://localhost:3000  
- Login redirects from `/`

### Seed accounts

| Email | Password | Role |
|---|---|---|
| `admin@nexus.crm` | `Admin123!` | Admin |
| `sales@nexus.crm` | `Sales123!` | Sales |

---

## Architecture overview

```text
CRM/
├── frontend/                 # Next.js App Router UI (Nexus Control Plane)
│   └── src/
│       ├── app/              # Routes: login + (crm) modules
│       ├── components/       # Shell, deals, leads, charts, UI primitives
│       ├── data/             # Demo seed + feature catalog
│       ├── hooks/            # Shared CRM state provider
│       ├── lib/api/          # Endpoint contract + client adapters
│       └── types/            # Domain TypeScript models
└── backend/                  # TypeScript Express API
    └── src/
        ├── index.ts          # Server bootstrap, CORS, health
        ├── routes/api.ts     # /api/v1 REST surface
        ├── middleware/auth.ts
        ├── store/db.ts       # JSON persistence
        ├── seed.ts           # Demo users + CRM records
        ├── types.ts          # Shared domain types
        └── data/features.ts  # Enterprise feature registry
```

**Data flow (target):** UI → typed API contract (`endpoints.ts`) → Express `/api/v1/*` → JSON store.  
**Demo mode:** frontend can run on in-memory demo state; set `NEXT_PUBLIC_USE_DEMO_API=false` to prefer the live API base URL.

---

## Frontend

### Technologies

| Area | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router) | Route groups, layouts, static generation |
| UI library | **React 19** | Client components for interactive CRM surfaces |
| Language | **TypeScript 5** | Strict domain types for leads, deals, contacts, etc. |
| Styling | **Tailwind CSS 4** + CSS variables | Ink / stone / brass design tokens in `globals.css` |
| Primitives | CVA + custom UI kit | Button, card, badge, input, avatar (shadcn-style) |
| Motion | **GSAP 3** | Sidebar timeline, dashboard entrance, kanban FLIP |
| Icons | **Lucide React** | Consistent iconography |
| Fonts | Outfit + JetBrains Mono | Product UI + tabular / meta labels |

### Modules (routes)

| Route | Purpose |
|---|---|
| `/login` | Auth entry |
| `/dashboard` | Executive KPIs, charts, activity |
| `/leads` | Grid, filters, CRUD / bulk delete, detail drawer |
| `/deals` | Board + list, stage moves, pipeline customize |
| `/contacts` | Contact directory + CRUD |
| `/analytics` | Operational KPI trends |
| `/automations` | Workflow rules surface |
| `/notifications` | Alerts + activity hub |
| `/settings` | Workspace configuration |
| `/features` | Full enterprise feature catalog (live / partial / stub / needs_external) |

### Frontend quality signals

- Feature-based folders under `components/` and route group `(crm)`
- Shared shell (sidebar + top nav + command palette hook)
- Central CRM state boundary (`use-crm-data`) for cross-module updates
- Documented REST contract in `src/lib/api/endpoints.ts`
- Premium visual system: high-contrast ink text, soft brass accents, readable 15px base type

### Frontend scripts

```bash
cd frontend
npm run dev      # development server
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
```

---

## Backend

### Technologies

| Area | Choice | Notes |
|---|---|---|
| Language | **TypeScript 5** (strict) | Shared domain types in `src/types.ts` |
| Runtime | **Node.js** (ES modules) | Compiled with `tsc` to `dist/` |
| Framework | **Express 5** | REST under `/api/v1` |
| Dev runner | **tsx** | `npm run dev` / `npm run seed` |
| Auth | **JWT** (`jsonwebtoken`) + **bcryptjs** | Login / register / `me`; role middleware |
| Config | **dotenv** | Port, CORS, optional third-party keys |
| CORS | **cors** | Allows local Next.js origins |
| IDs | **uuid** | Entity identifiers |
| Persistence | JSON file store (`src/data/db.json`) | Zero-ops local demo DB (swap-ready for Postgres later) |

### API surface (selected)

| Domain | Methods | Examples |
|---|---|---|
| Health | GET | `/health` |
| Auth | POST / GET | `/api/v1/auth/login`, `/register`, `/me` |
| Users / roles | GET / POST / PATCH / DELETE | Invites, status, Admin guards |
| Dashboard | GET | `/api/v1/dashboard/summary` |
| Deals | CRUD + stage + bulk delete | `/api/v1/deals`, `.../stage` |
| Leads | CRUD + status + bulk | `/api/v1/leads` |
| Contacts / companies | CRUD | `/api/v1/contacts`, `/companies` |
| Tasks / activities | GET / POST | Feed + task list |
| Notifications | GET / PATCH | Read / read-all |
| Automations | GET / PATCH / DELETE | Rule status |
| Pipeline | GET / PUT | Stages + board preferences |
| Settings | GET / PUT | Workspace |
| Features | GET | Catalog + summary for `/features` UI |

OAuth, SSO, LDAP, OTP, Stripe, AI, and similar providers are **stubbed** and return clear “needs credentials” responses until env vars are set. See `backend/FEATURE_MATRIX.md`.

### Backend scripts

```bash
cd backend
npm run dev         # tsx watch (TypeScript)
npm run build       # tsc → dist/
npm run start       # node dist/index.js
npm run seed        # re-seed demo data
npm run typecheck   # tsc --noEmit
```

---

## Feature maturity model

Statuses are intentional and visible in the product (`/features`) and API:

| Status | Meaning |
|---|---|
| **live** | Implemented and runnable end-to-end for the demo |
| **partial** | Basic path exists; not full enterprise depth |
| **stub** | Scaffold / contract only |
| **needs_external** | Requires third-party credentials (OAuth, Twilio, Stripe, OpenAI, etc.) |

This keeps the portfolio honest: core CRM is real; enterprise breadth is catalogued and extensible.

---

## Environment variables

### Backend (`backend/.env`)

```env
SECRET_KEY=dev-secret-change-me-in-production
PORT=8001
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Optional keys (OAuth, SMTP, Twilio, Stripe, OpenAI, LDAP, SSO) are listed in `backend/.env.example`.

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8001
NEXT_PUBLIC_USE_DEMO_API=false
```

---

## Recruiter snapshot

| Signal | Evidence in this repo |
|---|---|
| Full-stack ownership | Next.js UI + TypeScript Express API in one monorepo |
| Modern frontend | Next 16, React 19, Tailwind 4, TypeScript |
| Typed backend | Strict TypeScript Express, domain models, JWT auth |
| API design | Versioned `/api/v1`, role-aware routes |
| Product UX | Multi-module CRM with premium motion and typography |
| Engineering honesty | Feature matrix with live vs stub vs external |
| Runnability | Seed users, health check, documented local setup |

---

## Roadmap (natural next steps)

- Wire all frontend mutations through the live Express client (replace remaining demo adapters)
- Swap JSON store for PostgreSQL / Prisma (or similar)
- Add integration tests for auth + deals/leads CRUD
- Complete high-priority stubs (email, calendar, billing) behind real credentials
- Deploy frontend (Vercel) + backend (Railway / Render / Fly) with production secrets

---

## License

Private portfolio / interview project unless otherwise noted.
