"""Store user education."""

import sqlalchemy as sa
from alembic import op

revision = "0036_user_education"
down_revision = "0035_user_experiences"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "user_education",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("school", sa.String(length=180), nullable=False),
        sa.Column("degree", sa.String(length=160), nullable=False),
        sa.Column("field", sa.String(length=160), nullable=False),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_user_education_user_id", "user_education", ["user_id"])


def downgrade():
    op.drop_index("ix_user_education_user_id", table_name="user_education")
    op.drop_table("user_education")
