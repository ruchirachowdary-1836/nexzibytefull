"""Link application users to Neon Auth identities."""
from alembic import op
import sqlalchemy as sa

revision = "0013_neon_auth_identity"
down_revision = "0012_auth_pass_policy"
branch_labels = None
depends_on = None


def upgrade():
    inspector = sa.inspect(op.get_bind())
    columns = {column["name"] for column in inspector.get_columns("users")}
    if "neon_auth_user_id" not in columns:
        op.add_column("users", sa.Column("neon_auth_user_id", sa.String(length=128), nullable=True))
        op.create_index("ix_users_neon_auth_user_id", "users", ["neon_auth_user_id"], unique=True)


def downgrade():
    inspector = sa.inspect(op.get_bind())
    columns = {column["name"] for column in inspector.get_columns("users")}
    if "neon_auth_user_id" in columns:
        op.drop_index("ix_users_neon_auth_user_id", table_name="users")
        op.drop_column("users", "neon_auth_user_id")
