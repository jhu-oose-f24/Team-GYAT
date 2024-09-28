import pymysql
pymysql.install_as_MySQLdb()

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect

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

if __name__ == '__main__':
    app.run(debug=True)

