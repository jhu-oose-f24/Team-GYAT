import re
from flask import Blueprint, request, jsonify
from models import db
from models.Conversation import Message
from datetime import datetime, timezone

message_bp = Blueprint('message_bp', __name__)

# Create a new message
@message_bp.route('/messages', methods=['POST'])
def create_message():
    data = request.get_json()
    try:
        new_message = Message(
            text=data['text'],
            sender_id=data['sender_id'],
            conversation_id=data['conversation_id']
        )
        db.session.add(new_message)
        db.session.commit()
        return jsonify({"message": "Message created successfully", "message_id": new_message.message_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
# Get all messages in a conversation
@message_bp.route('/conversations/<int:conversation_id>/messages', methods=['GET'])
def get_messages_in_conversation(conversation_id):
    messages = Message.query.filter_by(conversation_id=conversation_id).order_by(Message.created_at).all()
    result = [{
        'message_id': message.message_id,
        'text': message.text,
        'created_at': message.created_at,
        'sender_id': message.sender_id,
        'conversation_id': message.conversation_id
    } for message in messages]
    return jsonify(result)

# Get a single message by message_id
@message_bp.route('/messages/<int:message_id>', methods=['GET'])
def get_message(message_id):
    message = Message.query.get(message_id)
    if not message:
        return jsonify({"error": "Message not found"}), 404
    message_data = {
        'message_id': message.message_id,
        'text': message.text,
        'created_at': message.created_at,
        'sender_id': message.sender_id,
        'conversation_id': message.conversation_id
    }
    return jsonify(message_data)