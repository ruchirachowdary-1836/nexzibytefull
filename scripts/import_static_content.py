"""Import frontend static catalogs into isolated static_* tables.

Run migrations separately first, then pass an explicit SQLite URL:
python scripts/import_static_content.py --database-url sqlite:///./static-content-local.db --dry-run
"""

import argparse
import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import Session

from app.models import (
    StaticArticle,
    StaticCourse,
    StaticEvent,
    StaticFaq,
    StaticFounderMeet,
    StaticInternship,
    StaticPricingTier,
    StaticSpeaker,
    StaticTestimonial,
)


MODEL_BY_CATALOG = {
    "courses": StaticCourse,
    "speakers": StaticSpeaker,
    "internships": StaticInternship,
    "founder_meets": StaticFounderMeet,
    "events": StaticEvent,
    "articles": StaticArticle,
    "testimonials": StaticTestimonial,
    "faqs": StaticFaq,
    "pricing": StaticPricingTier,
}
ALLOWED_TABLES = {model.__tablename__ for model in MODEL_BY_CATALOG.values()}


def export_frontend_content() -> dict:
    result = subprocess.run(
        ["node", str(ROOT / "scripts" / "export_frontend_static_content.mjs")],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return json.loads(result.stdout)


def import_content(session: Session, catalogs: dict, dry_run: bool = False) -> dict:
    bind = session.get_bind()
    if bind.dialect.name != "sqlite":
        raise ValueError("Static content import is restricted to SQLite for this staged run.")

    existing_tables = set(inspect(bind).get_table_names())
    missing_tables = ALLOWED_TABLES - existing_tables
    if missing_tables:
        raise RuntimeError(
            "Run Alembic migrations through head before importing; missing tables: "
            + ", ".join(sorted(missing_tables))
        )

    summary = {}
    for catalog_name, model in MODEL_BY_CATALOG.items():
        counts = {"inserted": 0, "updated": 0, "skipped": 0}
        for row in catalogs.get(catalog_name, []):
            source_key = row["source_key"]
            if len(source_key) > 255:
                raise ValueError(f"Source key exceeds 255 characters in {catalog_name}.")
            payload_json = row["payload"]
            current = (
                session.query(model)
                .filter(model.source_key == source_key)
                .one_or_none()
            )
            if current is None:
                counts["inserted"] += 1
                if not dry_run:
                    session.add(
                        model(
                            source_key=source_key,
                            payload_json=payload_json,
                            sort_order=row["sort_order"],
                            updated_at=datetime.utcnow(),
                        )
                    )
            elif (
                current.payload_json == payload_json
                and current.sort_order == row["sort_order"]
            ):
                counts["skipped"] += 1
            else:
                counts["updated"] += 1
                if not dry_run:
                    current.payload_json = payload_json
                    current.sort_order = row["sort_order"]
                    current.updated_at = datetime.utcnow()
        summary[model.__tablename__] = counts

    if dry_run:
        session.rollback()
    else:
        session.commit()
    return summary


def validate_database_url(database_url: str) -> None:
    parsed = urlparse(database_url)
    if parsed.scheme != "sqlite":
        raise ValueError(
            "Only local SQLite URLs are accepted; production and remote databases are disabled."
        )
    if parsed.netloc not in ("", "localhost"):
        raise ValueError("Network-hosted SQLite URLs are not accepted.")
    if parsed.path.startswith(("//", "\\\\")):
        raise ValueError("Network-share SQLite paths are not accepted.")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--database-url",
        required=True,
        help="Explicit local SQLite URL; no application .env/default URL is read.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print insert/update/skip counts without writing any rows.",
    )
    args = parser.parse_args()
    validate_database_url(args.database_url)

    catalogs = export_frontend_content()
    engine = create_engine(args.database_url)
    try:
        with Session(engine) as session:
            summary = import_content(session, catalogs, dry_run=args.dry_run)
        print("DRY RUN (no rows written)" if args.dry_run else "IMPORT COMPLETE")
        for table_name, counts in summary.items():
            print(
                f"{table_name}: inserted={counts['inserted']} "
                f"updated={counts['updated']} skipped={counts['skipped']}"
            )
        return 0
    except (RuntimeError, ValueError) as exc:
        print(f"Import aborted: {exc}", file=sys.stderr)
        return 2
    finally:
        engine.dispose()


if __name__ == "__main__":
    raise SystemExit(main())
