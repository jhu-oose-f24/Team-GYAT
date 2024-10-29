from app import db

class Job(db.Model):
    __tablename__ = 'Jobs'

    job_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(400), nullable = False)
    status = db.Column(db.Enum('open', 'accepted', 'provider_done', 'requester_approved', 'finished'))
    price = db.Column(db.Float, nullable=False)
    smart_contract_address = db.Column(db.String(255))
    image = db.Column(db.String(255), nullable=True, default='images/default_image.jpg')
    tag_name = db.Column(db.String(100), nullable=False)


    # foreign keys to reference users
    requester_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'))
    provider_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'))

    def __init__(self, provider_id, title, description, status, price, tag_name, smart_contract_address, image):
        self.provider_id = provider_id
        self.requester_id = None
        self.title = title
        self.description = description
        self.status = status
        self.price = price
        self.tag_name = tag_name
        self.smart_contract_address = smart_contract_address
        self.image = image if image else 'images/default_image.jpg'

    def get_job_details(self) -> str:
        return f'Job ID: {self.job_id}, Title: {self.title}, Description: {self.description}, Price: {self.price}, Status: {self.status}, Tag: {self.tag}, Image: {self.image}'

    def get_provider_id(self):
        return self.provider_id

    def get_requester_id(self):
        return self.requester_id

    def update_job_status(self, status: str) -> None:
        self.status = status
