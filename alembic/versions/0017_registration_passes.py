"""Add durable event and community registration passes."""
from alembic import op
import sqlalchemy as sa

revision = "0017_registration_passes"
down_revision = "0016_password_resets_email_logs"
branch_labels = None
depends_on = None


def upgrade():
    inspector = sa.inspect(op.get_bind())
    columns = {column["name"] for column in inspector.get_columns("registrations")}
    additions = (
        ("registration_number", sa.String(length=40)),
        ("pass_id", sa.String(length=40)),
        ("qr_data", sa.String(length=1000)),
    )
    for name, column_type in additions:
        if name not in columns:
            op.add_column("registrations", sa.Column(name, column_type, nullable=True))
    indexes = {index["name"] for index in inspector.get_indexes("registrations")}
    if "ix_registrations_registration_number" not in indexes:
        op.create_index("ix_registrations_registration_number", "registrations", ["registration_number"], unique=True)
    if "ix_registrations_pass_id" not in indexes:
        op.create_index("ix_registrations_pass_id", "registrations", ["pass_id"], unique=True)
    if "uq_registrations_qr_data" not in indexes:
        op.create_index("uq_registrations_qr_data", "registrations", ["qr_data"], unique=True)


def downgrade():
    op.drop_index("uq_registrations_qr_data", table_name="registrations")
    op.drop_index("ix_registrations_pass_id", table_name="registrations")
    op.drop_index("ix_registrations_registration_number", table_name="registrations")
    op.drop_column("registrations", "qr_data")
    op.drop_column("registrations", "pass_id")
    op.drop_column("registrations", "registration_number")
