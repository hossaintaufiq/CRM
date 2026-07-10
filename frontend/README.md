# Nexus CRM — Frontend

Premium **Next.js** control plane for Nexus CRM. This package is the recruiter-facing UI: multi-module CRM surfaces, typed domain models, design-token theming, and GSAP motion.

> Full-stack overview (backend + architecture): see the [root README](../README.md).

---

## Tech stack

| Category | Technology |
|---|---|
| Framework | Next.js **16** (App Router) |
| UI | React **19** |
| Language | TypeScript **5** |
| Styling | Tailwind CSS **4**, CSS design tokens |
| Motion | GSAP **3** |
| Icons | Lucide React |
| UI utilities | class-variance-authority, clsx, tailwind-merge |
| Fonts | Outfit (UI), JetBrains Mono (metrics / labels) |

---

## What you can demo

| Route | Capability |
|---|---|
| `/login` | Auth entry |
| `/dashboard` | KPIs, charts, activity stream |
| `/leads` | Searchable grid, status updates, add/delete, drawer |
| `/deals` | Kanban + list, stage moves, pipeline customize, CRUD |
| `/contacts` | Directory + create/delete |
| `/analytics` | Trend / operational metrics |
| `/automations` | Workflow rules surface |
| `/notifications` | Alerts + activity |
| `/settings` | Workspace settings |
| `/features` | Enterprise feature catalog with maturity labels |

---

## Project structure

```text
src/
├── app/
│   ├── login/
│   └── (crm)/          # Authenticated CRM shell routes
├── components/
│   ├── layout/         # App shell, top nav
│   ├── deals/          # Deals workspace + drawer
│   ├── leads/          # Lead grid
│   ├── charts/         # Premium bar / area / sparkline
│   ├── kanban/         # Enterprise board
│   ├── dashboard/
│   └── ui/             # Button, card, badge, input, avatar
├── data/               # Demo data + feature catalog
├── hooks/              # Shared CRM state (`use-crm-data`)
├── lib/api/            # Endpoint contract + client
└── types/              # CRM domain types
```

---

## Run locally

```bash
cd frontend
npm install
cp .env.local.example .env.local   # or copy on Windows
npm run dev
```

Open http://localhost:3000

### Environment

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8001
NEXT_PUBLIC_USE_DEMO_API=false
```

Start the Express API from `../backend` for live endpoints. With demo mode enabled, the UI can run against in-memory seed data.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

---

## Design system notes

- Tokens live in `src/app/globals.css` (ink + stone + soft brass)
- Surfaces use shared `.surface` / `.nav-active` / `.metric-value` utilities
- Primary actions are high-contrast ink buttons; brass is accent-only for a premium, readable look

---

## Engineering highlights

- Route-group layout with shared shell and module pages
- Typed CRM entities and a single state boundary for cross-page updates
- Documented REST paths in `src/lib/api/endpoints.ts` aligned with the backend
- Motion used for hierarchy (sidebar, board FLIP), not decoration spam
- Feature catalog UI mirrors backend maturity (`live` / `partial` / `stub` / `needs_external`)
