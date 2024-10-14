from app import db

class Job(db.Model):
    __tablename__ = 'Jobs'

    job_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(400), nullable = False)
    status = db.Column(db.Enum('open', 'accepted', 'provider_done', 'requester_approved', 'finished'))
    price = db.Column(db.Float, nullable=False)
    smart_contract_address = db.Column(db.String(255))

    # foreign keys to reference users
    requester_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'))
    provider_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'))

    def __init__(self, provider_id, title, description, status, price, smart_contract_address):
        self.provider_id = provider_id
        self.requester_id = None
        self.title = title
        self.description = description
        self.status = status
        self.price = price
        self.smart_contract_address = smart_contract_address

    def get_job_details(self) -> str:
        return f'Job ID: {self.job_id}, Title: {self.title}, Description: {self.description}, Price: {self.price}'

    def get_provider_id(self) -> str:
        return self.provider_id if self.provider_id else "No provider"

    def get_requester_id(self) -> str:
        return self.requester_id if self.requester_id else "No requester"

    def update_job_status(self, status: str) -> None:
        self.status = status
