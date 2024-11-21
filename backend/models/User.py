from models import db

class User(db.Model):
    __tablename__ = 'Users'

    user_id = db.Column(db.String(100), primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    fullname = db.Column(db.String(100), nullable=False)
    year = db.Column(db.String(4), nullable=True)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(255), nullable=False)

    # declare relationships to jobs requested and provided
    jobs_requested = db.relationship('Job', foreign_keys='Job.requester_id', backref='requester', lazy=True)
    jobs_provided = db.relationship('Job', foreign_keys='Job.provider_id', backref='provider', lazy=True)

    def __init__(self, user_id, username, fullname, year, email, password):
        self.user_id = user_id
        self.username = username
        self.fullname = fullname
        self.year = year
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
