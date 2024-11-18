from models import db
from datetime import datetime, timezone
from sqlalchemy import asc
from collections import defaultdict

class ConversationParticipants(db.Model):
    __tablename__ = 'ConversationParticipants'
    conversation_id = db.Column(db.Integer, db.ForeignKey('Conversations.conversation_id'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), primary_key=True)

class Conversation(db.Model):
    __tablename__ = 'Conversations'

    conversation_id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, onupdate=lambda: datetime.now(timezone.utc))

    # Relationship to messages, ordered by created_at
    messages = db.relationship(
        'Message',
        backref='conversation',
        lazy=True,
        order_by=asc("Message.created_at")
    )

    # Many-to-many relationship with users
    participants = db.relationship('User', secondary='ConversationParticipants', backref=db.backref('conversations', lazy='dynamic'))

    def __init__(self, participants):
        self.participants = participants
        self.created_at = datetime.now(timezone.utc)

    def update_timestamp(self):
        self.updated_at = datetime.now(timezone.utc)
        db.session.commit()
    
    def add_message(self, message):
        self.messages.append(message)
        db.session.commit()

    def get_conversation_details(self) -> str:
        participant_ids = [participant.user_id for participant in self.participants]
        return f'Conversation ID: {self.conversation_id}, Participants: {participant_ids}, Created At: {self.created_at}, Messages: {len(self.messages)}'
    
    def add_participant(self, user):
        if user not in self.participants:
            self.participants.append(user)
            db.session.commit()
    
    def remove_participant(self, user):
        if user in self.participants:
            self.participants.remove(user)
            db.session.commit()

    def get_participants(self) -> list:
        return [participant.user_id for participant in self.participants]

    def get_messages(self) -> list:
        return self.messages

    @staticmethod
    def get_ordered_messages(conversation_id):
        return (
            Message.query
            .filter_by(conversation_id=conversation_id)
            .order_by(Message.sender_id, asc(Message.created_at))
            .all()
        )

    @staticmethod
    def get_messages_grouped_by_sender(conversation_id):
        messages = Conversation.get_ordered_messages(conversation_id)  # Access via class name
        grouped_messages = defaultdict(list)

        # Group messages by sender
        for message in messages:
            grouped_messages[message.sender_id].append({
                "message_id": message.message_id,
                "text": message.text,
                "created_at": message.created_at,
                "sender_id": message.sender_id
            })
        
        return grouped_messages

class Message(db.Model):
    __tablename__ = 'Messages'

    message_id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Foreign keys
    sender_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), nullable=False)
    conversation_id = db.Column(db.Integer, db.ForeignKey('Conversations.conversation_id'), nullable=False)

    def __init__(self, text, sender_id, conversation_id, attachment_url=None):
        self.text = text
        self.sender_id = sender_id
        self.conversation_id = conversation_id
        self.created_at = datetime.now(timezone.utc)
    
    def get_sender(self):
        return self.sender_id
    
    def get_conversation_id(self):
        return self.conversation_id
    
    def get_message_details(self) -> str:
        return f'Message ID: {self.message_id}, Text: {self.text}, Sender ID: {self.sender_id}, Created At: {self.created_at}'
