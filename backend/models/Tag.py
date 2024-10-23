from app import db

class Tag(db.Model):
    __tablename__ = 'Tag'

    tag_id = db.Column(db.Integer, primary_key=True)
    tag_name = db.Column(db.String(100), nullable=False)

    def __init__(self, tag_name):
        self.tag_name = tag_name