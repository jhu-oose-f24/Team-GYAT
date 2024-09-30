import pymysql
pymysql.install_as_MySQLdb()

from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect

from Job import Job

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = \
    'mysql://root:team-gyat@127.0.0.1/task-market-db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

@app.route('/')
def main():
    # verify table creation
    inspector = inspect(db.engine)
    return inspector.get_table_names()

@app.route('/jobs', methods=['POST'])
def create_job():
    data = request.get_json()
    new_job = Job(
        title = data['title'],
        status = data['status'],
        price = data['price'],
        smart_contract_address = data.get('smart_contract_address', None),
        requester_id = data['requester_id'],
        provider_id = data['provider_id']
    )

    db.session.add(new_job)
    db.session.commit()
    return jsonify(
            {"message": "Job created successfully", 
             "job_id": new_job.job_id}), 201

if __name__ == '__main__':
    app.run(debug=True)

