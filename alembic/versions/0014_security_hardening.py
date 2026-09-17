"""Add refresh token, lockout, and audit foundations."""
from alembic import op
import sqlalchemy as sa

revision = '0014_security_hardening'
down_revision = '0013_profile_social_links'
branch_labels = None
depends_on = None

def upgrade():
    inspector = sa.inspect(op.get_bind())
    users = {c['name'] for c in inspector.get_columns('users')}
    for name, typ in [('failed_login_attempts', sa.Integer()), ('locked_until', sa.DateTime())]:
        if name not in users:
            op.add_column('users', sa.Column(name, typ, nullable=True))
    if 'refresh_tokens' not in inspector.get_table_names():
        op.create_table('refresh_tokens',
            sa.Column('id', sa.Integer(), primary_key=True),
            sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False, index=True),
            sa.Column('token_hash', sa.String(128), nullable=False, unique=True, index=True),
            sa.Column('expires_at', sa.DateTime(), nullable=False),
            sa.Column('revoked_at', sa.DateTime()),
            sa.Column('replaced_by_hash', sa.String(128)),
            sa.Column('created_at', sa.DateTime(), nullable=False))
    if 'audit_logs' not in inspector.get_table_names():
        op.create_table('audit_logs',
            sa.Column('id', sa.Integer(), primary_key=True),
            sa.Column('actor_user_id', sa.Integer(), sa.ForeignKey('users.id')),
            sa.Column('action', sa.String(120), nullable=False, index=True),
            sa.Column('resource', sa.String(255)),
            sa.Column('metadata_json', sa.Text()),
            sa.Column('created_at', sa.DateTime(), nullable=False))

def downgrade():
    op.drop_table('audit_logs')
    op.drop_table('refresh_tokens')
    op.drop_column('users', 'locked_until')
    op.drop_column('users', 'failed_login_attempts')
