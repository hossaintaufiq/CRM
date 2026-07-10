# Nexus CRM — Feature Matrix

Generated from `GET /api/v1/modules/features`.

Status legend:
- **live** — implemented and runnable
- **partial** — basic support exists, not full product depth
- **stub** — API/module scaffold only
- **needs_external** — scaffolded; requires third-party credentials/services

---

## DONE (live)

| Feature | Notes |
|---|---|
| Email & Password auth | JWT register/login |
| User Profiles | User CRUD fields |
| Organizations | Org model + workspace settings |
| Employee Directory | `GET /api/v1/users` |
| User Status / Suspend / Remove | Admin endpoints |
| Built-in Roles | Admin, Manager, Sales, HR, Marketing, Finance, Support |
| Executive Dashboard summary | `GET /api/v1/dashboard/summary` |
| KPI Widgets | Returned with dashboard + frontend |
| Recent Activities | `GET /api/v1/activities` |
| Contacts CRUD + bulk delete | Live |
| Companies CRUD | Live |
| Lead Management (add/delete/status/score) | Live |
| Deals / Opportunities / Pipeline stages | Live |
| Task Management (basic CRUD) | Live |
| In-App Notifications + Activity hub | Live |
| REST API + OpenAPI docs | `/docs` |

## PARTIAL

| Feature | What’s missing |
|---|---|
| Password Reset / Email Verification | Token/API exists; needs SMTP to send mail |
| Teams / Departments | Fields on user, not full org charts |
| Invite Members | Creates invited user; email send needs SMTP |
| User Activity / Audit Logs | Model + some writes, no full UI |
| Data Ownership | Owner fields exist; no enforcement engine |
| Sales Dashboard / Live Updates | Shares executive summary; polling only |
| Sales Forecast | Weighted pipeline calc only |
| Drag & Drop Kanban | Stage moves + animation; true DnD later |
| Contact notes/tasks/files | Tasks exist separately |
| Workflow Automation | Simple automation rules CRUD |
| Reporting | Analytics page + summary only |
| Search | Client-side filters |
| Customization | Pipeline prefs live; custom objects not |
| Multi-tenant SaaS | Single org seeded; isolation incomplete |

## STUB (scaffolded, not productized)

Custom Roles/Permissions, Field/Module/Territory permissions, Lead import/export/assign/convert/dedupe, Multiple pipelines, Recurring tasks/dependencies, Marketing automation, Support tickets, Documents, Quotes, Invoices, Products, Advanced analytics (LTV/CAC/churn), GraphQL, Webhooks, Import/Export suite, Mobile apps, GDPR/encryption/backup, HR, Finance, Customer portal, Knowledge base, Forms, Surveys, Inventory, Projects, Time tracking, Collaboration, Localization, BI, Events, Loyalty, Advanced enterprise suite.

## NEEDS EXTERNAL CREDENTIALS / SERVICES

| Feature | Required env vars |
|---|---|
| Google Login | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| Microsoft Login | `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET` |
| Apple Login | `APPLE_CLIENT_ID`, `APPLE_CLIENT_SECRET` |
| GitHub Login | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` |
| Magic Link | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD` |
| Phone OTP | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` |
| SSO | `SSO_METADATA_URL` |
| LDAP / Active Directory | `LDAP_SERVER` |
| AI Insights / AI Features | `OPENAI_API_KEY` |
| Calendar sync | Google/Microsoft OAuth |
| Email system | SMTP + mailbox OAuth |
| Omnichannel (WhatsApp/SMS/etc.) | Twilio (and channel APIs) |
| Subscriptions / payments | `STRIPE_SECRET_KEY` |
| External notifications (Slack/Teams/Push) | SMTP/Twilio + Slack/Teams apps |
| Integrations hub / Ecommerce / Social CRM | Per-provider keys |

Stub OAuth/integration endpoints already exist under:
- `POST /api/v1/auth/oauth/{provider}/start`
- `POST /api/v1/auth/magic-link`
- `POST /api/v1/auth/otp/send`
- `POST /api/v1/auth/sso/start`
- `POST /api/v1/auth/ldap/login`
- `GET /api/v1/modules/{module}`

---

## Honest scope note

A CRM with every item in the 50-category enterprise list is a multi-year platform (Salesforce/HubSpot class). This repo delivers:

1. A **runnable backend** with real auth + core CRM data APIs
2. A **premium frontend** for the core sales workflow
3. A **complete roadmap registry** so every remaining capability is tracked and stubbed

Next build slices should pick modules by priority (auth providers → true DnD → import/export → tickets → email).
