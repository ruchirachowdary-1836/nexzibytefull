"""Merge the Neon Auth identity and registration migration branches."""

revision = "0018_merge_neon_auth_and_registration_heads"
down_revision = ("0017_registration_passes", "0013_neon_auth_identity")
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
