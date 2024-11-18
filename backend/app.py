import pymysql
pymysql.install_as_MySQLdb()

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect

from api import register_routes
from models import db
from models.Tag import Tag

GOOGLE_CLIENT_ID = '122127252195-02c10jh336ucqb3d80pma4galdafg6dg.apps.googleusercontent.com'
def seed_tags():
    predefined_tags = ["Tutoring", "Cleaning", "Shopping", "Dorm Service", "Other"]
    
    # Check if the tags already exist to avoid duplicates
    for tag_name in predefined_tags:
        existing_tag = Tag.query.filter_by(tag_name=tag_name).first()
        if not existing_tag:
            tag = Tag(tag_name=tag_name)
            db.session.add(tag)
    db.session.commit()

def create_app():
    app = Flask(__name__)
    CORS(app)
    # db configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:team-gyat@127.0.0.1/task-market-db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # associate db with app
    db.init_app(app)

    # register endpoints
    register_routes(app)
    with app.app_context():
        db.create_all()  
        seed_tags()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
