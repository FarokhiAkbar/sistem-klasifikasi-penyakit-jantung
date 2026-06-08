import pandas as pd
from services.model_loader import ModelLoader

class PredictionService:
    @staticmethod
    def predict(data):
        """
        Melakukan prediksi penyakit jantung berdasarkan input data.
        
        Args:
            data (dict): Data input dari request JSON.
            
        Returns:
            tuple: (prediction (int), probability (float))
        """
        model = ModelLoader.get_model()
        if not model:
            raise Exception("Model ML belum siap atau gagal dimuat.")

        # Ekstrak data persis sesuai urutan yang digunakan saat training di notebook
        # Urutan: thal, cp, ca, thalach, oldpeak, chol, age, trestbps, exang
        feature_names = [
            "thal", "cp", "ca", "thalach", "oldpeak", 
            "chol", "age", "trestbps", "exang"
        ]
        
        # Buat dictionary berurutan, cast ke float/int jika perlu
        feature_dict = {}
        for feat in feature_names:
            val = data.get(feat, 0)
            feature_dict[feat] = float(val) if feat == 'oldpeak' else int(val)
        
        # Konversi ke DataFrame (karena saat training menggunakan Pandas DataFrame)
        df = pd.DataFrame([feature_dict])
        
        # Lakukan prediksi (0 atau 1)
        prediction = model.predict(df)[0]
        
        # Ambil probabilitas (berupa array persentase [prob_0, prob_1])
        probabilities = model.predict_proba(df)[0]
        # Kita ambil probabilitas dari kelas yang diprediksi
        probability_percentage = round(float(probabilities[prediction]) * 100, 2)
        
        return int(prediction), probability_percentage
