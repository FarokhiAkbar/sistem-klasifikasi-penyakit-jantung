from datetime import datetime
from config.database import db


class User(db.Model):
    """
    Model SQLAlchemy untuk tabel 'users'.
    Merepresentasikan pengguna terdaftar di sistem.
    """
    __tablename__ = 'users'

    id            = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name     = db.Column(db.String(100), nullable=False)
    email         = db.Column(db.String(100), unique=True, nullable=False)
    username      = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at    = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relasi one-to-many ke riwayat prediksi
    predictions = db.relationship('PredictionHistory', backref='user', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        """Serialisasi data user (tanpa password_hash) untuk respons JSON."""
        return {
            'id':         self.id,
            'full_name':  self.full_name,
            'email':      self.email,
            'username':   self.username,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<User {self.username}>'
