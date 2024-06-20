from flask import Blueprint, request, jsonify, session
from .chat_manager import ChatManager
from .user_manager import UserManager

main = Blueprint('main', __name__)

# Initialize managers
chat_manager = ChatManager()
user_manager = UserManager()

@main.route('/api/login', methods=['POST'])
def handle_login():
    user_data = request.json
    username = user_data.get("username")
    email = user_data.get("email")
    session["username"] = username
    session["email"] = email
    return user_manager.handle_login(username, email)

@main.route('/api/switch_chat/', methods=['POST'])
def switch_chat():
    username = session["username"]
    if not username:
        return 'error no username', 400

    data = request.json
    print(data)
    
    return user_manager.switch_chat(username, data)

@main.route('/api/get_voices', methods=['GET'])
def get_voices():
    return user_manager.get_voices()

@main.route('/text_to_speech', methods=['POST'])
def text_to_speech():
    return chat_manager.text_to_speech()

@main.route('/api/process-audio-chat/', methods=['POST'])
def process_audio_chat():
    username = session.get("username")
    if 'file' not in request.files:
        return 'No file part', 400

    file = request.files['file']


    audio_response = chat_manager.process_audio_chat(username, file)
    return audio_response, 200
