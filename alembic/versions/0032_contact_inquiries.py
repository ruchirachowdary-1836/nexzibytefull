"""Store public contact form inquiries."""

import sqlalchemy as sa
from alembic import op

revision = "0032_contact_inquiries"
down_revision = "0031_static_pricing"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "contact_inquiries",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=40), nullable=True),
        sa.Column("subject", sa.String(length=200), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("submitted_at", sa.DateTime(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="new"),
    )
    op.create_index("ix_contact_inquiries_email", "contact_inquiries", ["email"])
    op.create_index(
        "ix_contact_inquiries_submitted_at", "contact_inquiries", ["submitted_at"]
    )


def downgrade():
    op.drop_index(
        "ix_contact_inquiries_submitted_at", table_name="contact_inquiries"
    )
    op.drop_index("ix_contact_inquiries_email", table_name="contact_inquiries")
    op.drop_table("contact_inquiries")
