from flask import Blueprint, request, jsonify
from config.database import db
from models.user_model import User
from models.prediction_history_model import PredictionHistory

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    if data and data.get('username') == 'admin' and data.get('password') == 'admin123':
        return jsonify({"success": True, "token": "admin-secret-token"}), 200
    return jsonify({"success": False, "message": "Kredensial tidak valid"}), 401

@admin_bp.route('/stats', methods=['GET'])
def get_stats():
    total_users = User.query.count()
    total_predictions = PredictionHistory.query.count()
    high_risk_count = PredictionHistory.query.filter_by(prediction=1).count()
    
    return jsonify({
        "success": True,
        "data": {
            "total_users": total_users,
            "total_predictions": total_predictions,
            "high_risk_count": high_risk_count
        }
    }), 200

@admin_bp.route('/activities', methods=['GET'])
def get_activities():
    # 10 recent predictions
    recent_preds = PredictionHistory.query.order_by(PredictionHistory.created_at.desc()).limit(10).all()
    # 10 recent users
    recent_users = User.query.order_by(User.created_at.desc()).limit(10).all()
    
    return jsonify({
        "success": True,
        "data": {
            "predictions": [p.to_dict() for p in recent_preds],
            "users": [u.to_dict() for u in recent_users]
        }
    }), 200
