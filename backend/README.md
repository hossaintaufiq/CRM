# Nexus CRM Backend (Express / Node)

## Quick start

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

API: http://127.0.0.1:8001  
Health: http://127.0.0.1:8001/health  
Features catalog: http://127.0.0.1:8001/api/v1/modules/features

## Seed accounts

| Email | Password | Role |
|---|---|---|
| admin@nexus.crm | Admin123! | Admin |
| sales@nexus.crm | Sales123! | Sales |

## Frontend

```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8001
NEXT_PUBLIC_USE_DEMO_API=false
```

See `FEATURE_MATRIX.md` for live / partial / stub / needs_external.
