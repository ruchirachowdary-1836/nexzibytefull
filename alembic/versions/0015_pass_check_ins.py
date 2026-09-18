"""Add durable pass check-ins."""
from alembic import op
import sqlalchemy as sa

revision = "0015_pass_check_ins"
down_revision = "0014_security_hardening"
branch_labels = None
depends_on = None


def upgrade():
    if sa.inspect(op.get_bind()).has_table("check_ins"):
        return
    op.create_table(
        "check_ins",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("pass_request_id", sa.Integer(), sa.ForeignKey("pass_requests.id"), nullable=False),
        sa.Column("pass_id", sa.String(length=40), nullable=False),
        sa.Column("nonce", sa.String(length=64), nullable=False),
        sa.Column("checked_in_at", sa.DateTime(), nullable=False),
        sa.Column("operator_user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.UniqueConstraint("pass_request_id"),
        sa.UniqueConstraint("nonce"),
    )
    op.create_index("ix_check_ins_pass_request_id", "check_ins", ["pass_request_id"])
    op.create_index("ix_check_ins_pass_id", "check_ins", ["pass_id"])


def downgrade():
    op.drop_index("ix_check_ins_pass_id", table_name="check_ins")
    op.drop_index("ix_check_ins_pass_request_id", table_name="check_ins")
    op.drop_table("check_ins")
