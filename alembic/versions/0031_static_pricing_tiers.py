"""Create the isolated pricing catalog."""

import sqlalchemy as sa
from alembic import op

revision = "0031_static_pricing"
down_revision = "0030_visitor_trial_session"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "static_pricing_tiers",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("source_key", sa.String(length=255), nullable=False, unique=True),
        sa.Column("payload_json", sa.JSON(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index(
        "ix_static_pricing_tiers_source_key",
        "static_pricing_tiers",
        ["source_key"],
        unique=True,
    )


def downgrade():
    op.drop_index(
        "ix_static_pricing_tiers_source_key", table_name="static_pricing_tiers"
    )
    op.drop_table("static_pricing_tiers")
