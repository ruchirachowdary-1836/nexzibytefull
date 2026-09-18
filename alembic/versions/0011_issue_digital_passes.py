"""Add issued pass credentials to pass requests."""
from alembic import op
import sqlalchemy as sa

revision = "0011_issue_pass_qr"
down_revision = "0010_official_events"
branch_labels = None
depends_on = None

def upgrade():
    inspector = sa.inspect(op.get_bind())
    columns = {column["name"] for column in inspector.get_columns("pass_requests")}
    if "pass_id" not in columns:
        op.add_column("pass_requests", sa.Column("pass_id", sa.String(length=40), nullable=True))
    if "qr_data" not in columns:
        op.add_column("pass_requests", sa.Column("qr_data", sa.String(length=255), nullable=True))
    if "issued_at" not in columns:
        op.add_column("pass_requests", sa.Column("issued_at", sa.DateTime(), nullable=True))
    if "ix_pass_requests_pass_id" not in {index["name"] for index in inspector.get_indexes("pass_requests")}:
        op.create_index("ix_pass_requests_pass_id", "pass_requests", ["pass_id"], unique=True)

def downgrade():
    op.drop_constraint("uq_pass_requests_qr_data", "pass_requests", type_="unique")
    op.drop_index("ix_pass_requests_pass_id", table_name="pass_requests")
    op.drop_column("pass_requests", "issued_at")
    op.drop_column("pass_requests", "qr_data")
    op.drop_column("pass_requests", "pass_id")
