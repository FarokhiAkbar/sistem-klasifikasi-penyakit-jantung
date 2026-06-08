from flask import Blueprint, request, jsonify, g
from services.prediction_service import PredictionService
from services.recommendation_service import RecommendationService
from middleware.jwt_required import jwt_required
from models.prediction_history_model import PredictionHistory
from config.database import db

# Membuat blueprint untuk rute prediksi
prediction_bp = Blueprint('prediction_routes', __name__)


@prediction_bp.route('/predict', methods=['POST'])
@jwt_required
def predict_heart_disease():
    """
    Endpoint utama untuk prediksi AI.
    Memerlukan JWT token yang valid (user harus login).
    Hasil prediksi otomatis disimpan ke database MySQL.
    """
    try:
        # 1. Ambil data JSON dari request
        data = request.get_json()

        if not data:
            return jsonify({
                "status": "error",
                "message": "Data JSON tidak ditemukan pada body request."
            }), 400

        # 2. Lakukan Prediksi melalui service
        prediction, probability = PredictionService.predict(data)

        # 3. Dapatkan Rekomendasi
        recommendation_data = RecommendationService.get_recommendation(
            prediction=prediction,
            probability=probability,
            input_data=data
        )

        # 4. Simpan hasil ke database MySQL
        current_user = getattr(g, 'current_user', {})
        user_id = current_user.get('user_id')
        
        history_record = PredictionHistory()
        history_record.user_id = user_id
        history_record.age = float(data.get('age', 0))
        history_record.trestbps = float(data.get('trestbps', 0))
        history_record.chol = float(data.get('chol', 0))
        history_record.thalach = float(data.get('thalach', 0))
        history_record.oldpeak = float(data.get('oldpeak', 0))
        history_record.cp = int(data.get('cp', 0))
        history_record.ca = int(data.get('ca', 0))
        history_record.thal = int(data.get('thal', 0))
        history_record.exang = int(data.get('exang', 0))
        history_record.prediction = prediction
        history_record.probability = probability

        db.session.add(history_record)
        db.session.commit()

        try:
            from extensions import socketio
            socketio.emit('new_activity', {
                'type': 'new_prediction',
                'data': history_record.to_dict(),
                'message': f"Prediksi baru: Risiko {'Tinggi' if prediction == 1 else 'Rendah'} ({probability}%)"
            })
            print(f"SocketIO emitted successfully for prediction {prediction}")
        except Exception as e:
            print("SocketIO emit failed:", e)

        # 5. Susun Response
        response = {
            "status": "success",
            "data": {
                "prediction": prediction,
                "probability": probability,
                "explanation": recommendation_data["explanation"],
                "recommendations": recommendation_data["recommendations"]
            }
        }

        return jsonify(response), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
