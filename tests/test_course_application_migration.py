from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, inspect, text

from app.config import settings


def test_upgrade_from_0018_merge_head_adds_pass_and_email_fields(
    tmp_path, monkeypatch
):
    database_path = tmp_path / "migration-test.db"
    monkeypatch.setattr(settings, "database_url", None)
    monkeypatch.setattr(settings, "db_url", f"sqlite:///{database_path.as_posix()}")

    engine = create_engine(settings.db_url)
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
                "VALUES ('0018_merge_heads')"
            )
        )
        connection.execute(
            text(
                "CREATE TABLE course_applications ("
                "id INTEGER PRIMARY KEY, "
                "user_id INTEGER, "
                "course_id VARCHAR(120) NOT NULL, "
                "course_title VARCHAR(200) NOT NULL, "
                "name VARCHAR(120) NOT NULL, "
                "email VARCHAR(255) NOT NULL, "
                "phone VARCHAR(40) NOT NULL, "
                "interest_role VARCHAR(150), "
                "experience_level VARCHAR(120), "
                "notes TEXT, "
                "status VARCHAR(30) NOT NULL, "
                "email_sent_at DATETIME, "
                "created_at DATETIME NOT NULL)"
            )
        )
        connection.execute(
            text("CREATE TABLE registrations (id INTEGER PRIMARY KEY, email_sent_at DATETIME)")
        )
        connection.execute(
            text("CREATE TABLE pass_requests (id INTEGER PRIMARY KEY, email_sent_at DATETIME)")
        )

    config = Config("alembic.ini")
    config.set_main_option("path_separator", "os")
    config.config_file_name = None
    try:
        command.upgrade(config, "head")
        with engine.connect() as connection:
            columns = {
                column["name"]
                for column in inspect(connection).get_columns("course_applications")
            }
            other_tables = {
                table: {
                    column["name"]
                    for column in inspect(connection).get_columns(table)
                }
                for table in ("registrations", "pass_requests")
            }
            indexes = {
                index["name"]
                for index in inspect(connection).get_indexes("course_applications")
            }
            revision = connection.execute(
                text("SELECT version_num FROM alembic_version")
            ).scalar_one()
            static_tables = {
                "static_courses",
                "static_speakers",
                "static_internships",
                "static_founder_meets",
                "static_events",
                "static_articles",
                "static_testimonials",
                "static_faqs",
            }
            created_tables = set(inspect(connection).get_table_names())

        assert revision == "0028_static_faqs"
        assert static_tables <= created_tables
        assert {"pass_id", "qr_data", "issued_at"} <= columns
        assert {
            "email_sent_at",
            "email_last_attempt_at",
            "email_pass_id",
            "email_delivery_status",
        } <= columns
        for table_columns in other_tables.values():
            assert {
                "email_sent_at",
                "email_last_attempt_at",
                "email_pass_id",
                "email_delivery_status",
            } <= table_columns
        assert {
            "ix_course_applications_pass_id",
            "ix_course_applications_qr_data",
        } <= indexes
    finally:
        engine.dispose()
