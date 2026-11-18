"""Add guest_ai_calls table for the free AI analyses of visitors without an account

Only ADDS a table; existing users, favorites and artworks are untouched.

Revision ID: b7e1c2d3f4a5
Revises: a1b2c3d4e5f6
Create Date: 2026-11-18 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = 'b7e1c2d3f4a5'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'guest_ai_calls',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('ip_hash', sa.String(length=64), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_guest_ai_calls_ip_hash', 'guest_ai_calls', ['ip_hash'])
    op.create_index('ix_guest_ai_calls_created_at', 'guest_ai_calls', ['created_at'])


def downgrade():
    op.drop_index('ix_guest_ai_calls_created_at', table_name='guest_ai_calls')
    op.drop_index('ix_guest_ai_calls_ip_hash', table_name='guest_ai_calls')
    op.drop_table('guest_ai_calls')
