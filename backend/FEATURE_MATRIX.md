# Nexus CRM — Feature Matrix (TypeScript Express backend)

Backend runtime: **TypeScript + Node.js + Express** (`backend/src/**/*.ts`).

Status legend:
- **live** — implemented and runnable
- **partial** — basic support exists
- **stub** — scaffold only
- **needs_external** — needs third-party credentials

See live counts via:
`GET /api/v1/modules/features/summary`

Frontend catalog UI: `/features`

## Seed accounts
- `admin@nexus.crm` / `Admin123!`
- `sales@nexus.crm` / `Sales123!`

## Run
```bash
cd backend
npm install
npm run dev
```
