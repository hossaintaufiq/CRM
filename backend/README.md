# Nexus CRM — Backend (TypeScript)

**TypeScript + Express / Node.js** API for Nexus CRM. Provides JWT auth, role-aware REST resources, seeded demo CRM data, and an enterprise feature registry consumed by the frontend `/features` page.

> Full-stack overview (frontend + architecture): see the [root README](../README.md).

---

## Language & runtime

| Item | Detail |
|---|---|
| Language | **TypeScript 5** (strict mode) |
| Runtime | Node.js (ES modules) |
| Framework | Express **5** |
| Dev | `tsx watch` (`npm run dev`) |
| Prod | `tsc` → `node dist/index.js` (`npm run build` / `npm run start`) |

Python / FastAPI and plain JavaScript sources were removed. All application code lives under `src/**/*.ts`.

---

## Tech stack

| Category | Technology |
|---|---|
| Language | TypeScript (strict) |
| Runtime | Node.js |
| Framework | Express **5** |
| Auth | JWT (`jsonwebtoken`), password hashing (`bcryptjs`) |
| Config | `dotenv` |
| Cross-origin | `cors` |
| IDs | `uuid` |
| Persistence | JSON file store (`src/data/db.json`) |
| Tooling | `typescript`, `tsx`, `@types/*` |

Domain models are shared in `src/types.ts` (User, Deal, Lead, Contact, Database, Feature, …).

---

## Quick start

```bash
cd backend
npm install
cp .env.example .env   # or copy on Windows
npm run dev
```

| Endpoint | URL |
|---|---|
| API base | http://127.0.0.1:8001 |
| Health | http://127.0.0.1:8001/health |
| Features | http://127.0.0.1:8001/api/v1/modules/features |

Health response includes `"language": "TypeScript"`.

### Seed accounts

| Email | Password | Role |
|---|---|---|
| `admin@nexus.crm` | `Admin123!` | Admin |
| `sales@nexus.crm` | `Sales123!` | Sales |

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | TypeScript watch via `tsx` |
| `npm run build` | Compile to `dist/` |
| `npm run start` | Run compiled `dist/index.js` |
| `npm run seed` | Re-seed demo database |
| `npm run typecheck` | `tsc --noEmit` |

---

## Project structure

```text
src/
├── index.ts              # Bootstrap, CORS, /health, mount /api/v1
├── config.ts             # Env-driven config
├── types.ts              # Shared domain TypeScript types
├── seed.ts               # Demo users + CRM records
├── middleware/auth.ts    # JWT + role guards
├── routes/api.ts         # REST surface
├── store/db.ts           # Read/write JSON persistence
└── data/
    ├── db.json           # Runtime data file
    └── features.ts       # Feature registry
```

---

## API domains

All business routes are under **`/api/v1`**.

| Domain | Capabilities |
|---|---|
| **Auth** | Register, login, `me`, password-reset request; OAuth / SSO / LDAP / OTP stubs |
| **Users & roles** | List, invite, status, delete (Admin / Manager where required) |
| **Dashboard** | Summary aggregates for executive KPIs |
| **Deals** | CRUD, stage move, bulk delete |
| **Leads** | CRUD, status patch, bulk delete, import/export stubs |
| **Contacts & companies** | CRUD |
| **Tasks & activities** | List / create |
| **Notifications** | List, mark read, read-all |
| **Automations** | List, status patch, delete |
| **Pipeline** | Stages + board preferences |
| **Settings** | Workspace get/put |
| **Modules / features** | Catalog, summary, per-feature detail |

Example auth flow:

```http
POST /api/v1/auth/login
Content-Type: application/json

{ "email": "admin@nexus.crm", "password": "Admin123!" }
```

Use the returned token:

```http
Authorization: Bearer <token>
```

---

## Environment

See `.env.example`:

```env
SECRET_KEY=dev-secret-change-me-in-production-nexus-crm-2026
PORT=8001
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Optional third-party keys (Google/Microsoft OAuth, Twilio, SMTP, Stripe, OpenAI, LDAP, SSO) unlock stubbed integrations when configured.

---

## Feature maturity

Documented in [`FEATURE_MATRIX.md`](./FEATURE_MATRIX.md):

| Status | Meaning |
|---|---|
| `live` | Implemented for the demo |
| `partial` | Basic support |
| `stub` | Scaffold only |
| `needs_external` | Needs vendor credentials |

Summary endpoint: `GET /api/v1/modules/features/summary` (auth required).

---

## Engineering highlights

- Strict TypeScript across routes, middleware, store, and seed
- Versioned REST API with consistent JSON responses
- JWT middleware + role checks on sensitive user routes
- Auto-seed on empty store for one-command demos
- Feature registry keeps portfolio claims honest and extensible
- CORS configured for local Next.js origins
