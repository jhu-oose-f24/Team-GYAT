from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'Users'

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    
    # Relationships to Job
    jobs_provided = db.relationship('Job', foreign_keys='Job.provider_id', backref='provider', lazy=True)
    jobs_requested = db.relationship('Job', foreign_keys='Job.requester_id', backref='requester', lazy=True)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

    def get_user_id(self):
        return self.user_id

    def get_provided_jobs(self):
        return self.jobs_provided

    def get_requested_jobs(self):
        return self.jobs_requested

    def set_provided_jobs(self, job):
        self.jobs_provided.append(job)

    def set_requested_jobs(self, job):
        self.jobs_requested.append(job)