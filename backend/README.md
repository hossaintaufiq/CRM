# Nexus CRM — Backend

**Express / Node.js** API for Nexus CRM. Provides JWT auth, role-aware REST resources, seeded demo CRM data, and an enterprise feature registry consumed by the frontend `/features` page.

> Full-stack overview (frontend + architecture): see the [root README](../README.md).

---

## Runtime note

This backend is **Node.js + Express only**. Python / FastAPI artifacts were removed from the package:

| Removed | Why |
|---|---|
| `app-python-legacy/` | Old FastAPI app (superseded) |
| `.venv/` | Python virtualenv |
| `requirements.txt` | Python dependencies |
| `nexus_crm.db` | Legacy SQLite from the Python stack |

Use `npm install` + `npm run dev` — no Python, pip, or uvicorn required.

---

## Tech stack

| Category | Technology |
|---|---|
| Runtime | Node.js (ES modules) |
| Framework | Express **5** |
| Auth | JWT (`jsonwebtoken`), password hashing (`bcryptjs`) |
| Config | `dotenv` |
| Cross-origin | `cors` |
| IDs | `uuid` |
| Persistence | JSON file store (`src/data/db.json`) |

Designed for local demos and portfolio review. The store layer is isolated so it can be replaced with PostgreSQL / Prisma (or similar) without rewriting route contracts.

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

### Seed accounts

| Email | Password | Role |
|---|---|---|
| `admin@nexus.crm` | `Admin123!` | Admin |
| `sales@nexus.crm` | `Sales123!` | Sales |

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Watch mode (`node --watch`) |
| `npm run start` | Start server |
| `npm run seed` | Re-seed demo database |

---

## Project structure

```text
src/
├── index.js              # Bootstrap, CORS, /health, mount /api/v1
├── config.js             # Env-driven config
├── seed.js               # Demo users + CRM records
├── middleware/auth.js    # JWT + role guards
├── routes/api.js         # REST surface
├── store/db.js           # Read/write JSON persistence
└── data/
    ├── db.json           # Runtime data file
    └── features.js       # Feature registry
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

- Versioned REST API with consistent JSON responses
- JWT middleware + role checks on sensitive user routes
- Auto-seed on empty store for one-command demos
- Feature registry keeps portfolio claims honest and extensible
- CORS configured for local Next.js origins
