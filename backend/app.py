import pymysql
import os
import logging
pymysql.install_as_MySQLdb()
from flask_login import LoginManager
from flask import Flask, request
from flask_cors import CORS
from config import Config
from models import db
from api import register_routes
from models.Tag import Tag
from models.login import sp
from api.login_routes import login_bp
from api.user_routes import user_bp
from models.User import User

def seed_tags():
    predefined_tags = ["Tutoring", "Cleaning", "Shopping", "Dorm Service", "Other"]
    for tag_name in predefined_tags:
        existing_tag = Tag.query.filter_by(tag_name=tag_name).first()
        if not existing_tag:
            tag = Tag(tag_name=tag_name)
            db.session.add(tag)
    db.session.commit()

def create_app():
    app = Flask(__name__, static_folder='static')
    CORS(app)
    app.config.from_object(Config)

    # Database configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('JAWSDB_URL') or os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)

    # Register routes and blueprints
    register_routes(app)
    login_manager= LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'login_bp.login'
    app.register_blueprint(sp.create_blueprint(), url_prefix='/saml')

    logging.basicConfig(level=logging.DEBUG)
    app.logger.setLevel(logging.DEBUG)
    @app.route('/')
    def home():
        return "Welcome to Task Market!"
    @app.before_request
    def log_request_info():
        logging.debug("Request Headers: %s", request.headers)
        logging.debug("Request Body: %s", request.get_data())
        logging.debug("Form Data: %s", request.form)

    @login_manager.user_loader
    def load_user(user_id):
        # Loads the user from the database
        return User.query.get(int(user_id))

    @app.errorhandler(Exception)
    def handle_exception(e):
        app.logger.exception("Unhandled Exception: %s", e)
        return "Internal Server Error", 500
    
    with app.app_context():
        db.create_all()
        seed_tags()
        print("Registered Routes:", flush=True)
        for rule in app.url_map.iter_rules():
            print(f"{rule.endpoint}: {rule.rule}", flush=True)

    return app

app = create_app()

if __name__ == '__main__':
    print(app.url_map)
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
