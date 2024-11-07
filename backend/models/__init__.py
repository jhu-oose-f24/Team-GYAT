from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from models.Job import Job
from models.User import User
from models.Conversation import Conversation, ConversationParticipants, Message
from models.login import JHUServiceProvider
