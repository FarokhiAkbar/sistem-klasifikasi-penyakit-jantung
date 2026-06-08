from flask import Blueprint, request, jsonify, g
from services.auth_service import AuthService
from models.user_model import User
from middleware.jwt_required import jwt_required

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    """Endpoint registrasi akun baru. POST /api/auth/register"""
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'Data tidak valid.'}), 400

    response, status = AuthService.register(data)
    return jsonify(response), status


@auth_bp.route('/login', methods=['POST'])
def login():
    """Endpoint login user. POST /api/auth/login"""
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'Data tidak valid.'}), 400

    response, status = AuthService.login(data)
    return jsonify(response), status


@auth_bp.route('/me', methods=['GET'])
@jwt_required
def get_current_user():
    """
    Endpoint untuk mengambil data user yang sedang login.
    Digunakan oleh frontend untuk session persistence saat page refresh.
    GET /api/auth/me
    """
    user_id = g.current_user.get('user_id')
    user = User.query.get(user_id)

    if not user:
        return jsonify({'success': False, 'message': 'User tidak ditemukan.'}), 404

    return jsonify({
        'success': True,
        'user': user.to_dict(),
    }), 200
