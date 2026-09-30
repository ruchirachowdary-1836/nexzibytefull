"""Add one-way user follows."""

import sqlalchemy as sa
from alembic import op

revision = "0037_user_follows"
down_revision = "0036_user_education"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "user_follows",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("follower_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("followed_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.UniqueConstraint("follower_id", "followed_id", name="uq_user_follows_pair"),
        sa.CheckConstraint("follower_id != followed_id", name="ck_user_follows_not_self"),
    )
    op.create_index("ix_user_follows_follower_id", "user_follows", ["follower_id"])
    op.create_index("ix_user_follows_followed_id", "user_follows", ["followed_id"])


def downgrade():
    op.drop_index("ix_user_follows_followed_id", table_name="user_follows")
    op.drop_index("ix_user_follows_follower_id", table_name="user_follows")
    op.drop_table("user_follows")
