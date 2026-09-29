"""Create isolated static testimonial catalog."""

import sqlalchemy as sa
from alembic import op

revision = "0027_static_testimonials"
down_revision = "0026_static_articles"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "static_testimonials",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("source_key", sa.String(length=255), nullable=False),
        sa.Column("payload_json", sa.JSON(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_static_testimonials_source_key", "static_testimonials", ["source_key"], unique=True)


def downgrade():
    op.drop_index("ix_static_testimonials_source_key", table_name="static_testimonials")
    op.drop_table("static_testimonials")
