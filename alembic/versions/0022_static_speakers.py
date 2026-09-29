"""Create isolated static speaker catalog."""

import sqlalchemy as sa
from alembic import op

revision = "0022_static_speakers"
down_revision = "0021_static_courses"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "static_speakers",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("source_key", sa.String(length=255), nullable=False),
        sa.Column("payload_json", sa.JSON(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_static_speakers_source_key", "static_speakers", ["source_key"], unique=True)


def downgrade():
    op.drop_index("ix_static_speakers_source_key", table_name="static_speakers")
    op.drop_table("static_speakers")
