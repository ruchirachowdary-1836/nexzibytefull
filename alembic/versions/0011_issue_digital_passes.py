"""Add issued pass credentials to pass requests."""
from alembic import op
import sqlalchemy as sa

revision = "0011_issue_digital_passes"
down_revision = "0010_republish_official_founder_meets"
branch_labels = None
depends_on = None

def upgrade():
    op.add_column("pass_requests", sa.Column("pass_id", sa.String(length=40), nullable=True))
    op.add_column("pass_requests", sa.Column("qr_data", sa.String(length=255), nullable=True))
    op.add_column("pass_requests", sa.Column("issued_at", sa.DateTime(), nullable=True))
    op.create_index("ix_pass_requests_pass_id", "pass_requests", ["pass_id"], unique=True)
    op.create_unique_constraint("uq_pass_requests_qr_data", "pass_requests", ["qr_data"])

def downgrade():
    op.drop_constraint("uq_pass_requests_qr_data", "pass_requests", type_="unique")
    op.drop_index("ix_pass_requests_pass_id", table_name="pass_requests")
    op.drop_column("pass_requests", "issued_at")
    op.drop_column("pass_requests", "qr_data")
    op.drop_column("pass_requests", "pass_id")
