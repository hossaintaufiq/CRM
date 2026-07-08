# Senior Full-Stack Developer Showcase

Enterprise-grade CRM platform frontend scaffolded with modern web architecture, production-ready code quality, and interaction design standards expected in senior-level delivery.

---

## Why This Repository Matters

This repository demonstrates how a Senior Full-Stack Developer approaches frontend architecture in a business-critical environment:

- Translates product requirements into scalable technical systems
- Balances performance, accessibility, maintainability, and UX polish
- Implements modular design systems and typed domain modeling
- Applies animation and state strategies without sacrificing code health

The current implementation focuses on a high-performance CRM interface with dashboard analytics, lead management workflows, and sales pipeline interactions.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + CSS variable token system
- **UI Paradigm:** Shadcn/Radix-inspired reusable primitives
- **Animation:** GSAP (timeline orchestration, staggering, FLIP transitions)
- **Icons:** Lucide React

---

## Senior Engineering Signals in This Project

### 1) Architecture First

- Feature modules are separated by domain (`dashboard`, `kanban`, `leads`, `layout`, `ui`)
- Shared types and utilities reduce drift and improve consistency
- Data/state concerns are isolated via a dedicated CRM hook

### 2) Production-Minded Frontend Patterns

- Typed interfaces for CRM entities (deals, leads, KPIs, activities)
- Reusable UI primitives with variant-based styling patterns
- Theme/token design with CSS variables for predictable scaling

### 3) UX + Motion Quality

- Sidebar transitions orchestrated with a unified GSAP timeline
- Dashboard load sequence uses controlled staggered entrance animation
- Kanban card reflow uses GSAP FLIP for smooth, non-jarring layout transitions
- Lead drawer interaction includes layered animation and cleanup-safe effects

### 4) Reliability & Standards

- Lint-safe and build-verified implementation
- Explicit component boundaries for easier testing and team collaboration
- Strict TypeScript discipline without `any`

---

## Project Structure

```text
.
├── README.md
└── frontend/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   │   ├── dashboard/
    │   │   ├── kanban/
    │   │   ├── layout/
    │   │   ├── leads/
    │   │   └── ui/
    │   ├── hooks/
    │   ├── lib/
    │   └── types/
    └── package.json
```

---

## Business-Centric Feature Coverage

- Persistent CRM shell with collapsible navigation and command palette behavior
- Executive dashboard with KPI ribbon, pipeline forecast section, and activity stream
- Enterprise sales pipeline layout with stage-based deal organization
- Lead management grid with detail drawer and quick interaction controls

---

## How to Run

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

Production validation:

```bash
npm run lint
npm run build
```

---

## Recruiter Snapshot

If you are evaluating this repository for a Senior Full-Stack Developer role, this codebase highlights:

- System design thinking at the UI architecture level
- Strong frontend engineering fundamentals with modern tooling
- Ability to ship polished, interactive SaaS experiences
- Readiness for ownership in cross-functional product teams

---

## Next Evolution Path (Senior Scope)

- Route-based module segmentation (`/dashboard`, `/deals`, `/leads`, `/analytics`)
- Real drag-and-drop pipeline interactions with persisted state
- API integration layer (server actions / typed client contracts)
- Role-aware permissions and feature flags
- End-to-end test coverage (Playwright) + component testing (Vitest/RTL)

