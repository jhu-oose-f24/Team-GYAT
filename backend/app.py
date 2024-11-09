import pymysql
import os
pymysql.install_as_MySQLdb()

from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from api import register_routes
from models import db
from models.Tag import Tag
from models.login import service_provider

def seed_tags():
    predefined_tags = ["Tutoring", "Cleaning", "Shopping", "Dorm Service", "Other"]
    for tag_name in predefined_tags:
        existing_tag = Tag.query.filter_by(tag_name=tag_name).first()
        if not existing_tag:
            tag = Tag(tag_name=tag_name)
            db.session.add(tag)
    db.session.commit()

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    # Database configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('JAWSDB_URL') or os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)

    # Register routes and blueprints
    register_routes(app)
    app.register_blueprint(service_provider.create_blueprint(), url_prefix='/sso')



    @app.route('/')
    def home():
        return "Welcome to Task Market!"

    with app.app_context():
        db.create_all()
        seed_tags()

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
