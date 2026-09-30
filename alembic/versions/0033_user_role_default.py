"""Give the user role a database-side default."""

import sqlalchemy as sa
from alembic import op

revision = "0033_user_role_default"
down_revision = "0032_contact_inquiries"
branch_labels = None
depends_on = None


def upgrade():
    if op.get_bind().dialect.name == "sqlite":
        with op.batch_alter_table("users") as batch_op:
            batch_op.alter_column(
                "role",
                existing_type=sa.String(length=20),
                existing_nullable=False,
                server_default="user",
            )
    else:
        op.alter_column(
            "users",
            "role",
            existing_type=sa.String(length=20),
            existing_nullable=False,
            server_default="user",
        )


def downgrade():
    if op.get_bind().dialect.name == "sqlite":
        with op.batch_alter_table("users") as batch_op:
            batch_op.alter_column(
                "role",
                existing_type=sa.String(length=20),
                existing_nullable=False,
                server_default=None,
            )
    else:
        op.alter_column(
            "users",
            "role",
            existing_type=sa.String(length=20),
            existing_nullable=False,
            server_default=None,
        )
