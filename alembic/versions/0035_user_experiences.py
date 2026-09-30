"""Store user work experience."""

import sqlalchemy as sa
from alembic import op

revision = "0035_user_experiences"
down_revision = "0034_user_current_company"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "user_experiences",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.String(length=160), nullable=False),
        sa.Column("company", sa.String(length=160), nullable=False),
        sa.Column("start_date", sa.Date(), nullable=False),
        sa.Column("end_date", sa.Date(), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_user_experiences_user_id", "user_experiences", ["user_id"])


def downgrade():
    op.drop_index("ix_user_experiences_user_id", table_name="user_experiences")
    op.drop_table("user_experiences")
