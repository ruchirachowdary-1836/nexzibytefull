"""Create isolated static founder-meet catalog."""

import sqlalchemy as sa
from alembic import op

revision = "0024_static_founder_meets"
down_revision = "0023_static_internships"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "static_founder_meets",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("source_key", sa.String(length=255), nullable=False),
        sa.Column("payload_json", sa.JSON(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_static_founder_meets_source_key", "static_founder_meets", ["source_key"], unique=True)


def downgrade():
    op.drop_index("ix_static_founder_meets_source_key", table_name="static_founder_meets")
    op.drop_table("static_founder_meets")
