# Senior Full-Stack Developer Showcase (Dynamic CRM)

Production-grade CRM frontend built with Next.js App Router, TypeScript strict mode, Tailwind CSS token theming, and GSAP micro-interactions.  
This repository is designed to demonstrate senior-level frontend architecture, system thinking, and delivery quality for recruiter and hiring manager review.

---

## What Is Implemented

This is no longer a single page scaffold. The system now includes complete route-based CRM modules with shared dynamic state:

- `/dashboard` - executive metrics, pipeline chart, live activity stream
- `/leads` - searchable/sortable lead grid, multi-select, status updates, animated detail drawer
- `/deals` - enterprise kanban stages with GSAP FLIP reflow transitions
- `/contacts` - account contact directory
- `/analytics` - KPI trend monitor and computed operational metrics
- `/automations` - workflow rules with live run counters
- `/notifications` - realtime notification hub with read/unread state
- `/settings` - organization configuration surface

---

## Tech Stack

- **Framework:** Next.js 14+ style architecture via App Router
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS + CSS variable design tokens
- **UI Approach:** Reusable shadcn-style primitives (`card`, `button`, `badge`, `input`, `avatar`)
- **Animation:** GSAP 3 (timeline transitions + FLIP)
- **Icons:** Lucide React

---

## Dynamic Data System (Backend-Ready)

The app now runs on a centralized dynamic state model (frontend-only demo mode) and is structured for backend replacement later:

- **Demo data source:** `frontend/src/data/crm-demo-data.ts`
- **Global shared state provider:** `frontend/src/hooks/use-crm-data.tsx`
- **Typed domain models:** `frontend/src/types/crm.ts`

Current dynamic behavior:

- KPI trend arrays update over time
- activity timestamps refresh
- deal stage moves create new activity + notification events
- automation run counters mutate over time
- lead status updates propagate globally
- notification read/unread state updates top nav badge in realtime

---

## Senior Engineering Signals

### 1) Architecture & Modularity

- Route groups and feature-based module organization
- Explicit domain typing across CRM entities
- Shared app shell + page-specific module composition

### 2) UX + Motion Quality

- Sidebar collapse/expand synchronized with GSAP timeline
- Dashboard staggered entrance sequence
- FLIP-based kanban transitions for smooth re-layout
- Drawer and overlay animations with cleanup-safe GSAP usage

### 3) Reliability & Standards

- Strict TypeScript with no `any`
- Lint-safe and build-verified implementation
- Reusable UI primitives reduce duplication and style drift

---

## Project Structure

```text
.
├── README.md
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── (crm)/
    │   │   │   ├── analytics/
    │   │   │   ├── automations/
    │   │   │   ├── contacts/
    │   │   │   ├── dashboard/
    │   │   │   ├── deals/
    │   │   │   ├── leads/
    │   │   │   ├── notifications/
    │   │   │   └── settings/
    │   ├── components/
    │   │   ├── dashboard/
    │   │   ├── kanban/
    │   │   ├── layout/
    │   │   ├── leads/
    │   │   └── ui/
    │   ├── data/
    │   ├── hooks/
    │   ├── lib/
    │   └── types/
    └── package.json
```

---

## Run Locally

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm run build
```

---

## Recruiter Snapshot

For Senior Full-Stack Developer evaluation, this project demonstrates:

- scalable frontend system design (not just visual implementation)
- strong TypeScript and modular component architecture
- polished SaaS-grade interaction quality and animation discipline
- backend-ready state layer separation (demo data now, API later)
- ability to ship complete, multi-module product surfaces

---

## Next Step (Backend Integration)

When you are ready to add backend:

- replace `crm-demo-data.ts` with API fetch layer
- preserve `use-crm-data` contract as app-facing state boundary
- add optimistic updates + error handling around mutations
- wire auth/roles for route/module permissions
- add integration and e2e tests for critical CRM flows

