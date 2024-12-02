"""Update Jobs table requester_id and provider_id to VARCHAR(100)

Revision ID: 67c181d26ffa
Revises: 
Create Date: 2024-12-02 14:37:34.759502

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '67c181d26ffa'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Adjust the user_id type in Users and related tables
    with op.batch_alter_table('Users', schema=None) as batch_op:
        batch_op.alter_column('user_id',
                              existing_type=sa.Integer(),
                              type_=sa.String(length=100),
                              existing_nullable=False)

    with op.batch_alter_table('Jobs', schema=None) as batch_op:
        batch_op.drop_constraint('Jobs_ibfk_1', type_='foreignkey')
        batch_op.drop_constraint('Jobs_ibfk_2', type_='foreignkey')
        batch_op.alter_column('requester_id',
                              existing_type=sa.Integer(),
                              type_=sa.String(length=100),
                              existing_nullable=False)
        batch_op.alter_column('provider_id',
                              existing_type=sa.Integer(),
                              type_=sa.String(length=100),
                              existing_nullable=False)
        batch_op.create_foreign_key('Jobs_ibfk_1', 'Users', ['requester_id'], ['user_id'])
        batch_op.create_foreign_key('Jobs_ibfk_2', 'Users', ['provider_id'], ['user_id'])

    with op.batch_alter_table('ConversationParticipants', schema=None) as batch_op:
        batch_op.drop_constraint('ConversationParticipants_ibfk_2', type_='foreignkey')
        batch_op.alter_column('user_id',
                              existing_type=sa.Integer(),
                              type_=sa.String(length=100),
                              existing_nullable=False)
        batch_op.create_foreign_key('ConversationParticipants_ibfk_2', 'Users', ['user_id'], ['user_id'])

    with op.batch_alter_table('Messages', schema=None) as batch_op:
        batch_op.drop_constraint('Messages_ibfk_1', type_='foreignkey')
        batch_op.alter_column('sender_id',
                              existing_type=sa.Integer(),
                              type_=sa.String(length=100),
                              existing_nullable=False)
        batch_op.create_foreign_key('Messages_ibfk_1', 'Users', ['sender_id'], ['user_id'])

    # Make password nullable in Users table
    with op.batch_alter_table('Users', schema=None) as batch_op:
        batch_op.alter_column('password',
                              existing_type=sa.String(length=255),
                              nullable=True)


def downgrade():
    # Revert the user_id type in Users and related tables
    with op.batch_alter_table('Users', schema=None) as batch_op:
        batch_op.alter_column('user_id',
                              existing_type=sa.String(length=100),
                              type_=sa.Integer(),
                              existing_nullable=False)

    with op.batch_alter_table('Jobs', schema=None) as batch_op:
        batch_op.drop_constraint('Jobs_ibfk_1', type_='foreignkey')
        batch_op.drop_constraint('Jobs_ibfk_2', type_='foreignkey')
        batch_op.alter_column('requester_id',
                              existing_type=sa.String(length=100),
                              type_=sa.Integer(),
                              existing_nullable=True)
        batch_op.alter_column('provider_id',
                              existing_type=sa.String(length=100),
                              type_=sa.Integer(),
                              existing_nullable=True)
        batch_op.create_foreign_key('Jobs_ibfk_1', 'Users', ['requester_id'], ['user_id'])
        batch_op.create_foreign_key('Jobs_ibfk_2', 'Users', ['provider_id'], ['user_id'])

    with op.batch_alter_table('ConversationParticipants', schema=None) as batch_op:
        batch_op.drop_constraint('ConversationParticipants_ibfk_2', type_='foreignkey')
        batch_op.alter_column('user_id',
                              existing_type=sa.String(length=100),
                              type_=sa.Integer(),
                              existing_nullable=False)
        batch_op.create_foreign_key('ConversationParticipants_ibfk_2', 'Users', ['user_id'], ['user_id'])

    with op.batch_alter_table('Messages', schema=None) as batch_op:
        batch_op.drop_constraint('Messages_ibfk_1', type_='foreignkey')
        batch_op.alter_column('sender_id',
                              existing_type=sa.String(length=100),
                              type_=sa.Integer(),
                              existing_nullable=False)
        batch_op.create_foreign_key('Messages_ibfk_1', 'Users', ['sender_id'], ['user_id'])

    # Revert password to NOT NULL in Users table
    with op.batch_alter_table('Users', schema=None) as batch_op:
        batch_op.alter_column('password',
                              existing_type=sa.String(length=255),
                              nullable=False)

