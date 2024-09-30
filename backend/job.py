from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()
class job(db.Model):
    __tablename__ = 'jobs'

    # Get information of the job
    job_id = db.Column(db.String(80), primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    status = db.Column(db.Enum('open', 'accepted', 'provider_done', 'requester_approved', 'finished'))
    price = db.Column(db.Float, nullable=False)
    smart_contract_address = db.Column(db.String(255))
    provider_id = db.Column(db.String(80), db.ForeignKey('users.user_id'), nullable=False)
    requester_id = db.Column(db.String(80), db.ForeignKey('users.user_id'), nullable=True)

    # Constructor of Job
    def __init__(self, job_id, provider_id, requester_id, title, status, price, smart_contract_address):
        self.job_id = job_id
        self.provider_id = provider_id
        self.requester_id = requester_id
        self.title = title
        self.status = status
        self.price = price
        self.smart_contract_address = smart_contract_address

    # Get job Details 
    def get_job_details(self) -> str:
        return f'Job ID: {self.job_id}, Title: {self.title}, Price: {self.price}'

    # Get provider User Id
    def get_provider_id(self) -> str:
        return self.provider_id if self.provider_id else "No provider"
    # Get requester User Id
    def get_requester_id(self) -> str:
        return self.requester_id if self.requester_id else "No requester"
    # update job status
    def update_job_status(self, status: bool) -> None:
        self.status = status
