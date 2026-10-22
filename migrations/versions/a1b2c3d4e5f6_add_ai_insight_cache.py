"""Add ai_insight cache column to exhibits

Adds a nullable Text column to cache the AI curator analysis per artwork,
so repeated views are served from the DB instead of spending a new (paid)
inference call. This migration only ADDS a column — it does not drop or
modify any existing data (users, favorites, and artworks are untouched).

Revision ID: a1b2c3d4e5f6
Revises: 4f477e527595
Create Date: 2026-10-22 20:10:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = '4f477e527595'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('exhibits', schema=None) as batch_op:
        batch_op.add_column(sa.Column('ai_insight', sa.Text(), nullable=True))


def downgrade():
    with op.batch_alter_table('exhibits', schema=None) as batch_op:
        batch_op.drop_column('ai_insight')
