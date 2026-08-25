# Database design

The complete relationship diagram source is available in [`docs/schema.dbml`](docs/schema.dbml), ready to import into dbdiagram.io.

`users` own `posts`, `comments`, `reactions`, saved posts, and registrations. `posts` belong to `categories`; category and post removal is archival rather than destructive. `reactions` and `saved_posts` each enforce one row per user and post.

`speakers` are reusable profiles. `summit_speakers` and `founder_meet_speakers` are many-to-many links, allowing the same speaker to appear at multiple event types without duplication.

`registrations` use a polymorphic `event_type` plus `event_id` model. This keeps one registration table for both event types; application validation verifies the referenced event exists, and a composite unique constraint prevents duplicate registration.

Key status fields: users have `is_active`; posts have draft/published plus archival; events have `is_published` and upcoming/past status; registrations have registered/cancelled status.

## MySQL Workbench

Import [`database/mysql_workbench_schema.sql`](database/mysql_workbench_schema.sql) in MySQL Workbench using **File > Open SQL Script**, then execute it. It creates the `nexzibyte_techtalk` database and all application tables, relationships, indexes, and uniqueness rules.

To run the API against that database, install the updated dependencies and set `DB_URL` in `.env`:

```env
DB_URL=mysql+pymysql://root:your-password@localhost:3306/nexzibyte_techtalk
```

After importing, you may run `python -m app.seed.seed_data` to add the project’s demo data.
