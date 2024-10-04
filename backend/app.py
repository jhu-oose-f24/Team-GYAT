import pymysql
pymysql.install_as_MySQLdb()

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect

# global db instance
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # db configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:team-gyat@127.0.0.1/task-market-db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # associate db with app
    db.init_app(app)

    # register endpoints
    register_routes(app)

    return app

def register_routes(app):
    # import model classes 
    from models.User import User
    from models.Job import Job

    @app.route('/', methods=['GET'])
    def main():
        # verify table creation
        inspector = inspect(db.engine)
        return jsonify(inspector.get_table_names())

    @app.route('/users', methods=['POST'])
    def create_user():
        data = request.get_json()
        try:
            new_user = User(username=data['username'], email=data['email'], password=data['password'])
            db.session.add(new_user)
            db.session.commit()
            return jsonify({"message": "User created successfully", "user_id": new_user.user_id}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    @app.route('/jobs', methods=['POST'])
    def create_job():
        data = request.get_json()
        try:
            new_job = Job(
                title=data['title'],
                status=data['status'],
                price=data['price'],
                smart_contract_address=data.get('smart_contract_address', None),
                provider_id=data['provider_id']
            )
            db.session.add(new_job)
            db.session.commit()
            return jsonify({"message": "Job created successfully", "job_id": new_job.job_id}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
