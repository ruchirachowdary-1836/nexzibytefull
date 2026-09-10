"""Add course applications."""
from alembic import op
import sqlalchemy as sa

revision = '0004_course_applications'
down_revision = '0003_newsletter_subscribers'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'course_applications',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('course_id', sa.String(length=120), nullable=False),
        sa.Column('course_title', sa.String(length=200), nullable=False),
        sa.Column('name', sa.String(length=120), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=40), nullable=False),
        sa.Column('interest_role', sa.String(length=150), nullable=True),
        sa.Column('experience_level', sa.String(length=120), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=30), nullable=False, server_default='submitted'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
    )
    op.create_index('ix_course_applications_user_id', 'course_applications', ['user_id'])
    op.create_index('ix_course_applications_course_id', 'course_applications', ['course_id'])
    op.create_index('ix_course_applications_email', 'course_applications', ['email'])


def downgrade():
    op.drop_index('ix_course_applications_email', table_name='course_applications')
    op.drop_index('ix_course_applications_course_id', table_name='course_applications')
    op.drop_index('ix_course_applications_user_id', table_name='course_applications')
    op.drop_table('course_applications')
