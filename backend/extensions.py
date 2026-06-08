from flask_socketio import SocketIO

# Initialize SocketIO instance without app (will be initialized in create_app)
socketio = SocketIO(cors_allowed_origins="*", async_mode='threading')
