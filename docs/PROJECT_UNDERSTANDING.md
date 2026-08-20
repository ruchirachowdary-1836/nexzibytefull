# TechTalk Backend - Project Understanding

## System summary

1. TechTalk is a community platform for technology content, discussions, and saved learning resources.
2. Users authenticate with JWT tokens; admins manage people, content taxonomy, events, and dashboard data.
3. Authors create drafts and publish posts; community members can comment, react, and save posts.
4. Summits and Founder Meets reuse speaker/founder profiles through many-to-many links.
5. Users can register once per event; dashboard endpoints provide aggregate management data.

## Key decisions

- SQLAlchemy models and Alembic migrations provide PostgreSQL-compatible persistence.
- Registrations use `event_type` plus `event_id`; the application validates the event before writing a row.
- Posts and categories use archival flags to preserve relational history.

## Clarifications to confirm with the manager

- Should event registrations require approval, capacity limits, or a waitlist?
- Is `professional_links` expected as JSON, individual fields, or a free-text URL list?
- Should draft posts and unpublished events be visible to their authors only or to all authenticated users?
- Which roles, if any, should founders and speakers have in addition to admin and user?
