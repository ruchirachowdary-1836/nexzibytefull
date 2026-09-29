from fastapi.testclient import TestClient
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import main as main_module
from app.database import Base, get_db
from app.models import StaticCourse, StaticPricingTier, StaticSpeaker, User
from scripts.import_static_content import import_content, validate_database_url


def sample_catalogs():
    return {
        "courses": [
            {
                "source_key": "courses:fastapi",
                "payload": {"id": "fastapi", "title": "FastAPI", "tags": ["python"]},
                "sort_order": 0,
            }
        ],
        "speakers": [
            {
                "source_key": "speakers:ada",
                "payload": {"id": "ada", "name": "Ada Example", "topics": ["AI"]},
                "sort_order": 0,
            }
        ],
        "internships": [],
        "founder_meets": [],
        "events": [],
        "articles": [],
        "testimonials": [],
        "pricing": [
            {
                "source_key": "mockData.PASSES:student-pass",
                "payload": {"id": "student-pass", "price": "₹99", "priceNum": 99},
                "sort_order": 0,
            }
        ],
        "faqs": [],
    }


def test_static_models_are_new_tables_only():
    assert {
        "static_courses",
        "static_speakers",
        "static_internships",
        "static_founder_meets",
        "static_events",
        "static_articles",
        "static_testimonials",
        "static_faqs",
        "static_pricing_tiers",
    } <= set(Base.metadata.tables)


def test_import_dry_run_then_twice_is_idempotent_and_keeps_users_untouched():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    session_factory = sessionmaker(bind=engine, expire_on_commit=False)
    catalogs = sample_catalogs()
    try:
        with session_factory() as session:
            session.add(User(name="Existing", email="existing@example.test"))
            session.commit()
            users_before = session.query(User).count()

            dry_run = import_content(session, catalogs, dry_run=True)
            assert dry_run["static_courses"] == {
                "inserted": 1,
                "updated": 0,
                "skipped": 0,
            }
            assert session.query(StaticCourse).count() == 0

            first_run = import_content(session, catalogs)
            second_run = import_content(session, catalogs)
            assert first_run["static_courses"]["inserted"] == 1
            assert first_run["static_speakers"]["inserted"] == 1
            assert second_run["static_courses"]["skipped"] == 1
            assert second_run["static_speakers"]["skipped"] == 1
            assert second_run["static_pricing_tiers"]["skipped"] == 1
            assert session.query(StaticCourse).count() == 1
            assert session.query(StaticSpeaker).count() == 1
            assert session.query(StaticPricingTier).count() == 1
            assert session.query(User).count() == users_before

            stored = session.query(StaticCourse).one().payload_json
            assert stored == catalogs["courses"][0]["payload"]
            table_names = set(inspect(engine).get_table_names())
            assert "static_courses" in table_names
    finally:
        engine.dispose()


def test_local_import_rejects_remote_database_urls():
    validate_database_url("sqlite:///./local.db")
    for url, expected in (
        ("postgresql://example.invalid/db", "Only local SQLite URLs"),
        ("sqlite:////server/share/db.sqlite", "Network-share SQLite paths"),
    ):
        try:
            validate_database_url(url)
        except ValueError as exc:
            assert expected in str(exc)
        else:
            raise AssertionError(f"Unsafe database URL was accepted: {url}")


def test_public_static_content_get_endpoint(monkeypatch):
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    session_factory = sessionmaker(bind=engine, expire_on_commit=False)

    def override_db():
        with session_factory() as session:
            yield session

    main_module.app.dependency_overrides[get_db] = override_db
    try:
        with session_factory() as session:
            session.add(
                StaticCourse(
                    source_key="courses:fastapi",
                    payload_json={"id": "fastapi", "title": "FastAPI"},
                    sort_order=0,
                )
            )
            session.add(
                StaticSpeaker(
                    source_key="speakers:ada",
                    payload_json={"id": "ada", "name": "Ada Example"},
                    sort_order=0,
                )
            )
            session.add(
                StaticPricingTier(
                    source_key="mockData.PASSES:student-pass",
                    payload_json={"id": "student-pass", "price": "₹99"},
                    sort_order=0,
                )
            )
            session.commit()

        with TestClient(main_module.app) as client:
            response = client.get("/content/courses")
            assert response.status_code == 200
            assert response.json()[0]["id"] == "fastapi"
            assert response.json()[0]["content_record_id"] == 1
            speakers_response = client.get("/content/speakers")
            assert speakers_response.status_code == 200
            assert speakers_response.json()[0]["name"] == "Ada Example"
            pricing_response = client.get("/content/pricing")
            assert pricing_response.status_code == 200
            assert pricing_response.json()[0]["price"] == "₹99"
            assert client.get("/content/not-a-catalog").status_code == 404
    finally:
        main_module.app.dependency_overrides.pop(get_db, None)
        engine.dispose()
