# NexziByte TechTalk Backend

A FastAPI and SQLAlchemy backend for the TechTalk community, including JWT role-based access, posts and community interactions, reusable event speakers, summit/founder-meet management, registrations, and an admin dashboard.

## Stack

Python, FastAPI, SQLAlchemy 2, PostgreSQL (or SQLite locally), JWT, and pytest.

## Run locally

1. Create and activate a virtual environment.
2. `pip install -r requirements.txt`
3. Copy `.env.example` to `.env`; set `DB_URL` to a PostgreSQL URL for production.
4. Run `python -m alembic upgrade head` to create/update the schema.
5. `uvicorn app.main:app --reload`
5. Open http://127.0.0.1:8000/docs.

The schema is managed through Alembic migrations. For a new demo database, run `python -m app.seed.seed_data` after migrating.

## API overview

| Area | Core routes | Purpose |
| --- | --- | --- |
| Auth | Neon Auth client + `GET /auth/session` | Account creation, verification, sessions, and Google OAuth |
| Users | `/users`, `/users/me` | Admin management and current profile |
| Content | `/categories`, `/posts` | Category and post lifecycle |
| Community | `/posts/{id}/comments`, `/reactions`, `/save` | Comments, reaction toggle, saved posts |
| Events | `/summits`, `/founder-meets`, `/speakers` | Reusable speaker profiles and event publishing |
| Registrations | `/registrations` | Event registration and cancellation |
| Dashboard | `/dashboard/*` | Admin aggregate statistics |

## Demo data and tests

Run `python -m app.seed.seed_data` for sample content, then `pytest` for the smoke test suite. The seeded admin is `admin@techtalk.dev` with password `AdminPass123`; change it outside local development.

## Deployment

1. Create a Neon PostgreSQL project and copy its pooled connection string.
2. In Render, set `DB_URL` to that connection string and set a long random `JWT_SECRET`.
   Set `CORS_ORIGINS` to the exact origins of any browser clients that will call
   the API (comma-separated if there is more than one). Do not include a path
   or trailing slash.
3. Deploy the `main` branch. The Render start command runs `alembic upgrade head` before Uvicorn starts.
4. After the first successful deploy, run `python -m app.seed.seed_data` once with the same Neon `DB_URL` to load the demo data.

For scheduled admin reports, configure `ADMIN_REPORT_EMAIL` and the UTC hour
`ADMIN_REPORT_HOUR_UTC` (0-23). Reports are sent through the existing Brevo
settings: `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, and `BREVO_SENDER_NAME`.
The admin-only `POST /admin/reports/send-now` endpoint sends a report for the
previous weekly, monthly, or yearly period, or for an explicit date range.

Visitor-pass activation is limited to the UTC date configured in
`VISITOR_PROMOTION_DATE` (`YYYY-MM-DD`). The pass must be approved and linked
to the signed-in, email-verified user; its server-enforced session expires ten
minutes after activation.

After Render deploys the service, API documentation is available at
`https://techtalk-backend-shob.onrender.com/docs`.

### Clerk Google sign-in

Google sign-in is provided by Clerk in the frontend. Configure
`VITE_CLERK_PUBLISHABLE_KEY` on the frontend service and enable Google in the
Clerk Dashboard under SSO Connections. The FastAPI email/password JWT flow
remains available for backend-protected API requests.
