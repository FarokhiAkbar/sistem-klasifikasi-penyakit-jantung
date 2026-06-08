import warnings
# Sembunyikan peringatan versi sklearn — model .pkl dibuat dengan versi lebih baru
# tetapi fungsinya tetap berjalan normal
warnings.filterwarnings(
    "ignore",
    message=".*InconsistentVersionWarning.*",
    category=UserWarning
)
warnings.filterwarnings(
    "ignore",
    category=UserWarning,
    module="sklearn"
)

from flask import Flask, jsonify
from flask_cors import CORS
from config.settings import Config
from config.database import db
from routes.prediction_routes import prediction_bp
from routes.auth_routes import auth_bp
from routes.dashboard_routes import dashboard_bp
from services.model_loader import ModelLoader



from extensions import socketio

def create_app():
    """Factory function untuk membuat instance aplikasi Flask lengkap dengan Auth & DB."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inisialisasi SQLAlchemy dengan app
    db.init_app(app)
    socketio.init_app(app)

    # Aktifkan CORS agar bisa diakses oleh Frontend React (localhost:5173)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Buat semua tabel di database jika belum ada
    with app.app_context():
        # Import model agar SQLAlchemy mengenali tabel-tabel yang perlu dibuat
        from models.user_model import User
        from models.prediction_history_model import PredictionHistory
        db.create_all()
        print("[OK] Database tables created/verified successfully.")

    # Pre-load model Machine Learning saat startup (Singleton Pattern)
    try:
        ModelLoader.get_instance()
    except Exception as e:
        print(f"⚠️  Failed to load ML model on startup: {e}")

    # Register Blueprints / Routes
    app.register_blueprint(prediction_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    
    from routes.admin_routes import admin_bp
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "healthy",
            "model_loaded": ModelLoader.is_loaded()
        }), 200

    return app


if __name__ == '__main__':
    app = create_app()
    socketio.run(app, debug=True, port=5000, allow_unsafe_werkzeug=True)
