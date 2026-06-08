import os

class Config:
    """Konfigurasi dasar aplikasi termasuk JWT dan MySQL."""
    
    # Security
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-key-healthcare-2024'
    JWT_EXPIRY_HOURS = 24  # Token berlaku 24 jam
    
    # CORS
    CORS_HEADERS = 'Content-Type'
    
    # Path model Machine Learning
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    MODEL_PATH = os.path.join(BASE_DIR, 'model', 'random_forest_heart_model.pkl')
    
    # Koneksi MySQL menggunakan PyMySQL
    # Format: mysql+pymysql://<user>:<password>@<host>/<dbname>
    MYSQL_HOST     = os.environ.get('MYSQL_HOST', 'localhost')
    MYSQL_PORT     = int(os.environ.get('MYSQL_PORT', 3306))
    MYSQL_USER     = os.environ.get('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', '')
    MYSQL_DB       = os.environ.get('MYSQL_DB', 'db_heart_prediction')
    
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}"
        f"@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # API Keys
    # Catatan: Set GEMINI_API_KEY di environment variable atau file .env
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
