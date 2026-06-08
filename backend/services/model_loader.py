import joblib
from config.settings import Config

class ModelLoader:
    """Singleton class untuk memuat model Machine Learning hanya sekali."""
    _instance = None
    _model = None

    @classmethod
    def get_instance(cls):
        """Mengembalikan instance singleton."""
        if cls._instance is None:
            cls._instance = cls()
            cls._instance._load_model()
        return cls._instance

    def _load_model(self):
        """Memuat model dari disk."""
        try:
            self._model = joblib.load(Config.MODEL_PATH)
            print(f"Model berhasil dimuat dari {Config.MODEL_PATH}")
        except Exception as e:
            print(f"Error memuat model: {e}")
            raise e

    @classmethod
    def get_model(cls):
        """Mengambil instance model ML."""
        instance = cls.get_instance()
        return instance._model

    @classmethod
    def is_loaded(cls):
        """Mengecek apakah model sudah dimuat."""
        return cls._model is not None
