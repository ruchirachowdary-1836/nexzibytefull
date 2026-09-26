"""Add pass metadata columns to course applications."""

from alembic import op
import sqlalchemy as sa

revision = "0019_course_app_pass_fields"
down_revision = "0018_merge_heads"
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    columns = {column["name"] for column in inspector.get_columns("course_applications")}
    for name, column_type in (
        ("pass_id", sa.String(length=40)),
        ("qr_data", sa.String(length=255)),
        ("issued_at", sa.DateTime()),
    ):
        if name not in columns:
            op.add_column("course_applications", sa.Column(name, column_type, nullable=True))

    indexes = {index["name"] for index in inspector.get_indexes("course_applications")}
    if "ix_course_applications_pass_id" not in indexes:
        op.create_index("ix_course_applications_pass_id", "course_applications", ["pass_id"], unique=True)
    if "ix_course_applications_qr_data" not in indexes:
        op.create_index("ix_course_applications_qr_data", "course_applications", ["qr_data"], unique=True)


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    indexes = {index["name"] for index in inspector.get_indexes("course_applications")}
    if "ix_course_applications_qr_data" in indexes:
        op.drop_index("ix_course_applications_qr_data", table_name="course_applications")
    if "ix_course_applications_pass_id" in indexes:
        op.drop_index("ix_course_applications_pass_id", table_name="course_applications")

    columns = {column["name"] for column in inspector.get_columns("course_applications")}
    for name in ("issued_at", "qr_data", "pass_id"):
        if name in columns:
            op.drop_column("course_applications", name)
