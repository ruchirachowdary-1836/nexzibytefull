# Database design

The complete relationship diagram source is available in [`docs/schema.dbml`](docs/schema.dbml), ready to import into dbdiagram.io.

`users` own `posts`, `comments`, `reactions`, saved posts, and registrations. `posts` belong to `categories`; category and post removal is archival rather than destructive. `reactions` and `saved_posts` each enforce one row per user and post.

`speakers` are reusable profiles. `summit_speakers` and `founder_meet_speakers` are many-to-many links, allowing the same speaker to appear at multiple event types without duplication.

`registrations` use a polymorphic `event_type` plus `event_id` model. This keeps one registration table for both event types; application validation verifies the referenced event exists, and a composite unique constraint prevents duplicate registration.

Key status fields: users have `is_active`; posts have draft/published plus archival; events have `is_published` and upcoming/past status; registrations have registered/cancelled status.

## PostgreSQL deployment

Use a hosted PostgreSQL database such as Neon for deployment. Set its connection string in `.env` locally and as `DB_URL` in Render:

```env
DB_URL=postgresql://user:password@your-neon-host/neondb?sslmode=require
```

The Render startup command applies Alembic migrations automatically. The demo seeder is for disposable development databases only.

## Frontend static-content catalogs

Frontend course, speaker, internship, founder-meet, event, article, testimonial, and FAQ snapshots are stored in the isolated `static_*` tables created by revisions `0021` through `0028`. Each row preserves the source object as JSON, with a stable source key and display order. The importer writes only these eight tables; it does not modify users, registrations, applications, pass requests, or existing content tables.

To preview or import, first use a disposable/local SQLite database already migrated through revision `0028_static_faqs`, then pass its URL explicitly:

```powershell
python scripts/import_static_content.py --database-url sqlite:///./static-content-local.db --dry-run
python scripts/import_static_content.py --database-url sqlite:///./static-content-local.db
```

The importer refuses non-SQLite URLs and does not read `.env` or the application's default database URL. The dry run reports expected inserts/updates/skips without writing rows. Re-running the real import is idempotent. Do not point it at production; production import has not been authorized or run.

`python -m app.seed.seed_data` is a separate demo seeder that creates sample users and registrations. Do not use it to import website content.
