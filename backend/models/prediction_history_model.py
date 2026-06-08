from datetime import datetime
from config.database import db


class PredictionHistory(db.Model):
    """
    Model SQLAlchemy untuk tabel 'prediction_history'.
    Menyimpan setiap hasil prediksi yang dilakukan oleh user.
    """
    __tablename__ = 'prediction_history'

    id          = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id     = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Input fitur prediksi
    age         = db.Column(db.Float, nullable=False)
    trestbps    = db.Column(db.Float, nullable=False)
    chol        = db.Column(db.Float, nullable=False)
    thalach     = db.Column(db.Float, nullable=False)
    oldpeak     = db.Column(db.Float, nullable=False)
    cp          = db.Column(db.Integer, nullable=False)
    ca          = db.Column(db.Integer, nullable=False)
    thal        = db.Column(db.Integer, nullable=False)
    exang       = db.Column(db.Integer, nullable=False)

    # Output prediksi
    prediction  = db.Column(db.Integer, nullable=False)   # 0 atau 1
    probability = db.Column(db.Float, nullable=False)     # 0.0 - 100.0

    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Serialisasi data prediksi untuk respons JSON."""
        return {
            'id':          self.id,
            'user_id':     self.user_id,
            'age':         self.age,
            'trestbps':    self.trestbps,
            'chol':        self.chol,
            'thalach':     self.thalach,
            'oldpeak':     self.oldpeak,
            'cp':          self.cp,
            'ca':          self.ca,
            'thal':        self.thal,
            'exang':       self.exang,
            'prediction':  self.prediction,
            'probability': self.probability,
            'created_at':  self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<PredictionHistory id={self.id} user_id={self.user_id}>'
