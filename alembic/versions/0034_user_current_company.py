"""Add the current company to professional profiles."""

import sqlalchemy as sa
from alembic import op

revision = "0034_user_current_company"
down_revision = "0033_user_role_default"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("users", sa.Column("current_company", sa.String(length=160), nullable=True))


def downgrade():
    op.drop_column("users", "current_company")
