import jwt
from datetime import datetime, timezone, timedelta
from flask import current_app


class JwtService:
    """
    Service untuk pembuatan dan validasi JSON Web Token (JWT).
    Mengikuti prinsip Single Responsibility — hanya menangani urusan token.
    """

    @staticmethod
    def generate_token(user_id: int, username: str, email: str) -> str:
        """
        Membuat JWT token baru untuk user yang berhasil login.
        
        Args:
            user_id: ID unik user dari database.
            username: Username user.
            email: Email user.
            
        Returns:
            String JWT token yang sudah di-encode.
        """
        payload = {
            'user_id':  user_id,
            'username': username,
            'email':    email,
            'iat':      datetime.now(timezone.utc),
            'exp':      datetime.now(timezone.utc) + timedelta(
                hours=current_app.config.get('JWT_EXPIRY_HOURS', 24)
            ),
        }
        token = jwt.encode(
            payload,
            current_app.config['SECRET_KEY'],
            algorithm='HS256'
        )
        return token

    @staticmethod
    def decode_token(token: str) -> dict:
        """
        Mem-validasi dan mendekode JWT token.
        
        Args:
            token: JWT token string dari header Authorization.
            
        Returns:
            Payload dictionary jika token valid.
            
        Raises:
            jwt.ExpiredSignatureError: Jika token sudah kadaluarsa.
            jwt.InvalidTokenError: Jika token tidak valid / telah dimanipulasi.
        """
        payload = jwt.decode(
            token,
            current_app.config['SECRET_KEY'],
            algorithms=['HS256']
        )
        return payload
