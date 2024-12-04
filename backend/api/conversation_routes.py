from flask import Blueprint, request, jsonify
from models import db
from models.Conversation import Conversation, ConversationParticipants, Message
from datetime import datetime, timezone

conversation_bp = Blueprint('conversation_bp', __name__)


@conversation_bp.route('/test', methods=['GET'])
def test_route():
    return jsonify({"message": "Test route works!"})

# Create a new conversation
@conversation_bp.route('/conversations', methods=['POST'])
def create_conversation():
    data = request.get_json()
    participant_ids = data.get('participant_ids')
    if not participant_ids or len(participant_ids) < 2:
        return jsonify({"error": "A conversation requires at least two participants"}), 400
    try:
        # Check if a conversation already exists with the same participants
        existing_conversation = (
            db.session.query(Conversation)
            .join(ConversationParticipants)
            .filter(ConversationParticipants.user_id.in_(participant_ids))
            .group_by(Conversation.conversation_id)
            .having(db.func.count(ConversationParticipants.user_id) == len(participant_ids))
            .first()
        )
        if existing_conversation:
            # Conversation already exists, return its ID
            return jsonify({"message": "Conversation already exists", "conversation_id": existing_conversation.conversation_id}), 200

        # Create a new conversation if no existing one is found
        new_conversation = Conversation(participants=[])
        db.session.add(new_conversation)
        db.session.commit()

        # Add participants to the new conversation
        for user_id in participant_ids:
            participant = ConversationParticipants(conversation_id=new_conversation.conversation_id, user_id=user_id)
            db.session.add(participant)
        db.session.commit()

        return jsonify({"message": "Conversation created successfully", "conversation_id": new_conversation.conversation_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@conversation_bp.route('/users/<int:user_id>/conversations', methods=['GET'])
def get_conversations_for_user(user_id):
    conversations = (
        db.session.query(Conversation)
        .join(ConversationParticipants)
        .filter(ConversationParticipants.user_id == user_id)
        .all()
    )
    result = [
        {
            "conversation_id": conversation.conversation_id,
            "created_at": conversation.created_at,
            "updated_at": conversation.updated_at,
            "participants": [
                {"user_id": participant.user_id, "fullname": participant.fullname}  # Use 'fullname' instead of 'full_name'
                for participant in conversation.participants
            ]
        }
        for conversation in conversations
    ]
    return jsonify(result)

# Get all messages in a conversation
@conversation_bp.route('/conversations/<int:conversation_id>/messages', methods=['GET'])
def get_messages_in_conversation(conversation_id):
    messages = Message.query.filter_by(conversation_id=conversation_id).order_by(Message.created_at).all()
    result = [{
        'message_id': message.message_id,
        'text': message.text,
        'created_at': message.created_at,
        'sender_id': message.sender_id
    } for message in messages]
    return jsonify(result)

# Add a participant to an existing conversation
@conversation_bp.route('/conversations/<int:conversation_id>/participants', methods=['POST'])
def add_participant(conversation_id):
    data = request.get_json()
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID is required to add a participant"}), 400
    conversation = Conversation.query.get(conversation_id)
    if not conversation:
        return jsonify({"error": "Conversation not found"}), 404
    if any(p.user_id == user_id for p in conversation.participants):
        return jsonify({"error": "User is already a participant in this conversation"}), 400
    try:
        participant = ConversationParticipants(conversation_id=conversation_id, user_id=user_id)
        db.session.add(participant)
        db.session.commit()
        return jsonify({"message": "Participant added successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Remove a participant from a conversation
@conversation_bp.route('/conversations/<int:conversation_id>/participants/<int:user_id>', methods=['DELETE'])
def remove_participant(conversation_id, user_id):
    conversation = Conversation.query.get(conversation_id)
    if not conversation:
        return jsonify({"error": "Conversation not found"}), 404
    participant = ConversationParticipants.query.filter_by(conversation_id=conversation_id, user_id=user_id).first()
    if not participant:
        return jsonify({"error": "User is not a participant in this conversation"}), 404
    try:
        db.session.delete(participant)
        db.session.commit()
        return jsonify({"message": "Participant removed successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Get participants of a conversation
@conversation_bp.route('/conversations/<int:conversation_id>/participants', methods=['GET'])
def get_participants(conversation_id):
    participants = (
        db.session.query(ConversationParticipants.user_id)
        .filter(ConversationParticipants.conversation_id == conversation_id)
        .all()
    )
    participant_ids = [p[0] for p in participants]
    return jsonify(participant_ids)