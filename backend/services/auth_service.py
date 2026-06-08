import re
from typing import Tuple, Dict
from werkzeug.security import generate_password_hash, check_password_hash
from models.user_model import User
from services.jwt_service import JwtService
from config.database import db


class AuthService:
    """
    Service untuk menangani logika bisnis autentikasi.
    Memisahkan logika registrasi dan login dari layer routes (Controller).
    """

    @staticmethod
    def register(data: dict) -> Tuple[Dict, int]:
        """
        Mendaftarkan user baru ke dalam database.

        Args:
            data: Dictionary berisi info registrasi.

        Returns:
            Tuple (response_dict, http_status_code).
        """
        full_name = data.get('full_name', '').strip()
        email = data.get('email', '').strip().lower()
        username = data.get('username', '').strip().lower()
        password = data.get('password', '')
        confirm_password = data.get('confirm_password', '')

        # --- Validasi Input ---
        if len(full_name) < 3:
            return {
                'success': False,
                'message': 'Nama lengkap minimal 3 karakter.'
            }, 400

        if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
            return {
                'success': False,
                'message': 'Format email tidak valid.'
            }, 400

        if len(username) < 4:
            return {
                'success': False,
                'message': 'Username minimal 4 karakter.'
            }, 400

        if len(password) < 8:
            return {
                'success': False,
                'message': 'Password minimal 8 karakter.'
            }, 400

        if not re.search(r'[A-Z]', password):
            return {
                'success': False,
                'message': 'Password harus mengandung huruf besar.'
            }, 400

        if not re.search(r'[a-z]', password):
            return {
                'success': False,
                'message': 'Password harus mengandung huruf kecil.'
            }, 400

        if not re.search(r'[0-9]', password):
            return {
                'success': False,
                'message': 'Password harus mengandung angka.'
            }, 400

        if password != confirm_password:
            return {
                'success': False,
                'message': 'Konfirmasi password tidak cocok.'
            }, 400

        # --- Cek Duplikasi ---
        if User.query.filter_by(email=email).first():
            return {
                'success': False,
                'message': 'Email sudah terdaftar.'
            }, 409

        if User.query.filter_by(username=username).first():
            return {
                'success': False,
                'message': 'Username sudah digunakan.'
            }, 409

        # --- Buat User Baru ---
        new_user = User()
        new_user.full_name = full_name
        new_user.email = email
        new_user.username = username
        new_user.password_hash = generate_password_hash(password)
        
        db.session.add(new_user)
        db.session.commit()

        try:
            from extensions import socketio
            socketio.emit('new_activity', {
                'type': 'new_user',
                'data': new_user.to_dict(),
                'message': f"Pengguna baru terdaftar: {new_user.username}"
            })
        except Exception as e:
            print("SocketIO emit failed:", e)

        return {
            'success': True,
            'message': 'Akun berhasil dibuat. Silakan login.',
        }, 201

    @staticmethod
    def login(data: dict) -> Tuple[Dict, int]:
        """
        Memverifikasi kredensial user dan mengembalikan JWT token.

        Args:
            data: Dictionary berisi identifier dan password.

        Returns:
            Tuple (response_dict, http_status_code).
        """
        identifier = data.get('identifier', '').strip()
        password = data.get('password', '')

        if not identifier or not password:
            return {
                'success': False,
                'message': 'Email/username dan password wajib diisi.'
            }, 400

        # Cari user berdasarkan email atau username
        user = User.query.filter(
            (User.email == identifier.lower()) |
            (User.username == identifier.lower())
        ).first()

        if not user or not check_password_hash(user.password_hash, password):
            return {
                'success': False,
                'message': 'Email/username atau password salah.'
            }, 401

        # Generate JWT Token
        token = JwtService.generate_token(user.id, user.username, user.email)

        return {
            'success': True,
            'message': 'Login berhasil.',
            'token': token,
            'user': user.to_dict(),
        }, 200
