from flask import Blueprint, jsonify, g
from middleware.jwt_required import jwt_required
from models.prediction_history_model import PredictionHistory
from models.user_model import User

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/summary', methods=['GET'])
@jwt_required
def get_summary():
    """
    Mengembalikan ringkasan dashboard: total prediksi & prediksi terakhir.
    GET /api/dashboard/summary
    """
    user_id = g.current_user.get('user_id')
    user = User.query.get(user_id)

    if not user:
        return jsonify({'success': False, 'message': 'User tidak ditemukan.'}), 404

    total_predictions = PredictionHistory.query.filter_by(user_id=user_id).count()
    
    last_prediction = PredictionHistory.query.filter_by(user_id=user_id)\
        .order_by(PredictionHistory.created_at.desc()).first()

    return jsonify({
        'success': True,
        'data': {
            'user': user.to_dict(),
            'total_predictions': total_predictions,
            'last_prediction': last_prediction.to_dict() if last_prediction else None,
        }
    }), 200


@dashboard_bp.route('/history', methods=['GET'])
@jwt_required
def get_history():
    """
    Mengembalikan seluruh riwayat prediksi milik user yang sedang login.
    GET /api/dashboard/history
    """
    user_id = g.current_user.get('user_id')

    history = PredictionHistory.query.filter_by(user_id=user_id)\
        .order_by(PredictionHistory.created_at.desc()).all()

    return jsonify({
        'success': True,
        'data': [item.to_dict() for item in history],
        'total': len(history),
    }), 200
