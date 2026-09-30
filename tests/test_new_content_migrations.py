from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, inspect, text

from app.config import settings
from pathlib import Path


def test_new_migrations_only_create_pricing_and_contact_tables(tmp_path, monkeypatch):
    database_path = tmp_path / "isolated-content-contact.db"
    database_url = f"sqlite:///{database_path.as_posix()}"
    monkeypatch.setattr(settings, "database_url", None)
    monkeypatch.setattr(settings, "db_url", database_url)
    engine = create_engine(database_url)
    with engine.begin() as connection:
        connection.execute(
            text(
                "CREATE TABLE alembic_version "
                "(version_num VARCHAR(32) NOT NULL PRIMARY KEY)"
            )
        )
        connection.execute(
            text(
                "INSERT INTO alembic_version (version_num) "
                "VALUES ('0030_visitor_trial_session')"
            )
        )
        connection.execute(
            text(
                "CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT, "
                "role VARCHAR(20) NOT NULL)"
            )
        )
        connection.execute(
            text("INSERT INTO users VALUES (1, 'keep@example.com', 'user')")
        )

    repository_root = Path(__file__).resolve().parents[1]
    config = Config(str(repository_root / "alembic.ini"))
    config.set_main_option("script_location", str(repository_root / "alembic"))
    config.set_main_option("sqlalchemy.url", database_url)
    config.config_file_name = None
    try:
        command.upgrade(config, "head")
        with engine.connect() as connection:
            tables = set(inspect(connection).get_table_names())
            revision = connection.execute(
                text("SELECT version_num FROM alembic_version")
            ).scalar_one()
            user = connection.execute(
                text("SELECT id, email, role FROM users WHERE id=1")
            ).one()
            role_default = {
                column["name"]: column
                for column in inspect(connection).get_columns("users")
            }["role"]["default"]
            pricing_columns = {
                column["name"]
                for column in inspect(connection).get_columns("static_pricing_tiers")
            }
            contact_columns = {
                column["name"]
                for column in inspect(connection).get_columns("contact_inquiries")
            }
        assert revision == "0037_user_follows"
        assert {
            "static_pricing_tiers",
            "contact_inquiries",
            "user_experiences",
            "user_education",
            "user_follows",
        } <= tables
        assert user == (1, "keep@example.com", "user")
        assert role_default == "'user'"
        assert {"source_key", "payload_json", "sort_order", "updated_at"} <= pricing_columns
        user_column_names = {
            column["name"] for column in inspect(engine).get_columns("users")
        }
        assert "current_company" in user_column_names
        assert {
            "name",
            "email",
            "phone",
            "subject",
            "message",
            "submitted_at",
            "status",
        } <= contact_columns
    finally:
        engine.dispose()
