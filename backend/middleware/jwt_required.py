from functools import wraps
import jwt
from flask import request, jsonify, g
from services.jwt_service import JwtService


def jwt_required(f):
    """
    Decorator untuk melindungi route agar hanya bisa diakses oleh user yang login.
    
    Cara kerja:
    1. Membaca header 'Authorization: Bearer <token>'
    2. Mendekode dan memvalidasi JWT token.
    3. Menyimpan data user ke flask.g agar bisa diakses di dalam route.
    4. Mengembalikan 401 Unauthorized jika token tidak valid atau tidak ada.
    
    Usage:
        @app.route('/protected')
        @jwt_required
        def protected_route():
            user_id = g.current_user['user_id']
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')

        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]

        if not token:
            return jsonify({
                'success': False,
                'message': 'Login diperlukan untuk melakukan prediksi.'
            }), 401

        try:
            payload = JwtService.decode_token(token)
            g.current_user = payload  # Simpan ke flask.g untuk akses di route
        except jwt.ExpiredSignatureError:
            return jsonify({
                'success': False,
                'message': 'Sesi Anda telah berakhir. Silakan login kembali.'
            }), 401
        except jwt.InvalidTokenError:
            return jsonify({
                'success': False,
                'message': 'Token tidak valid. Silakan login kembali.'
            }), 401

        return f(*args, **kwargs)

    return decorated_function
