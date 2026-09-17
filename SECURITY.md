# Security guidance

This document describes the security boundary and the operational expectations
for the TechTalk backend. It is intentionally documentation-only; changes to
authentication, password handling, and database policy must be reviewed
separately and covered by tests.

## Security boundary

- The FastAPI service is the trust boundary for backend data and authorization.
- Clients must use HTTPS and treat access/refresh tokens as secrets.
- PostgreSQL/Neon is the production system of record. Production credentials
  and signing keys belong in the hosting provider's secret store, never in
  source control or browser-exposed variables.
- Alembic migrations are part of the release artifact and must be reviewed
  before production execution.

## Controls currently represented in the codebase

- Passwords are stored as bcrypt hashes, never as plaintext.
- JWT validation and role checks protect authenticated and administrative
  routes.
- Settings are environment-backed (`DB_URL`, `JWT_SECRET`, CORS, SMTP, and
  optional external JWT settings).
- SQLAlchemy parameterization and ORM mapping are used for database access.
- The CI workflow runs static checks, tests with coverage, dependency auditing,
  and an offline Alembic migration render.

## Deployment checklist

Before each production deployment:

1. Set a unique, high-entropy `JWT_SECRET`; do not use the development default.
2. Set `CORS_ORIGINS` to exact trusted origins (not `*`).
3. Use a least-privilege database role and TLS-enabled database URL.
4. Keep SMTP, database, and external identity-provider credentials in the
   platform secret manager.
5. Review the migration SQL and run the migration against a backup/staging
   database before production.
6. Confirm logs and error responses do not contain tokens, passwords, or
   connection strings.
7. Rotate credentials after suspected exposure and invalidate affected sessions
   according to the identity-provider and deployment procedures.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Contact the
repository maintainers through the private security channel configured for the
deployment (or the repository's private security advisory feature), including
an impact summary, affected endpoint/version, reproduction steps, and a safe
contact address. Do not include live credentials or personal data in a report.

We will acknowledge reports when practicable, validate the impact, coordinate a
fix and disclosure timeline, and credit reporters who want attribution.

## Known limitations and follow-up

- This repository still contains development-oriented defaults in settings;
  deployment configuration must override them.
- The CI audit is a dependency signal, not proof that runtime configuration or
  transitive services are secure.
- Rate limiting, centralized audit logging, token revocation, secret rotation,
  and production backup/restore controls are operational follow-up items.
- The offline migration check validates generation of migration SQL; it does
  not apply changes to a live database.
