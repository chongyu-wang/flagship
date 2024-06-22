from flask import Blueprint, request, jsonify, session
from .chat_manager import ChatManager
from .user_manager import UserManager
from .cache import voice_systems_cache, messages_cache, update_messages, update_user_voice_system, append_cache_messages, get_cache_messages, get_cache_voice_system

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

    update_cache(username)

    return user_manager.handle_login(username, email)

@main.route('/api/switch_chat/', methods=['POST'])
def switch_chat():
    username = session["username"]
    if not username:
        return 'error no username', 400

    data = request.json
    
    user_manager.switch_chat(username, data)
    update_cache(username)

    return 'success', 200

@main.route('/api/get_voices', methods=['GET'])
def get_voices():
    return user_manager.get_voices()


@main.route('/api/process-audio-chat/', methods=['POST'])
def process_audio_chat():
    username = session.get("username")
    if 'file' not in request.files:
        return 'No file part', 400

    if username not in voice_systems_cache or username not in messages_cache:
        print("username still not in cache")
        update_cache(username)

    audio_file = request.files['file']
    user_voice_system = get_cache_voice_system(username)
    messages = get_cache_messages(username)

    user_text_transcription = chat_manager.get_text_from_speech(audio_file)
    chat_manager.add_message_to_database(username, user_voice_system, user_text_transcription, True)
    append_cache_messages(username, user_text_transcription, True)

    gpt_response = chat_manager.get_gpt_response(user_voice_system, messages)
    chat_manager.add_message_to_database(username, user_voice_system, gpt_response, False)
    append_cache_messages(username, gpt_response, False)

    audio_response = chat_manager.get_speech_from_text(user_voice_system, gpt_response)

    response = jsonify({'audio': audio_response, 'text_response': gpt_response})
    return response, 200


@main.route('/text_to_speech', methods=['POST'])
def text_to_speech():
    return chat_manager.text_to_speech()


def update_cache(username):
    user_voice_system = chat_manager.get_voice_system(username)
    user_messages = chat_manager.get_user_messages(username, user_voice_system)

    update_user_voice_system(username, user_voice_system)
    update_messages(username, user_messages)
