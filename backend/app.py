import pymysql
pymysql.install_as_MySQLdb()

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect

from api import register_routes
from models import db

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

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
