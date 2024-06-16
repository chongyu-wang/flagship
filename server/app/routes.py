import base64
from flask import Blueprint, request, jsonify, session, redirect
from speech2text.speech_to_text import speech_to_text
from .controllers.audio_controller import process_audio_controller, text_to_speech_controller, list_voice_names
from .controllers.question_controller import generate_questions_controller
from .controllers.conversation_controller import mimic_conversation_controller, get_gpt_response
from db import Database
from utils import upload_to_s3
import base64
import logging
from openai import OpenAI
from dotenv import load_dotenv
import os
import io
import sqlite3

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

client = OpenAI(api_key=OPENAI_API_KEY)

main = Blueprint('main', __name__)

database = Database()


@main.route('/api/login', methods=['POST'])
def handle_login():
    user_data = request.json
    username = user_data.get("username")
    email = user_data.get("email")
    if username is None:
        print("error username not provided")
        return 'error username not provided', 400
    session['username'] = username
    session['email'] = email
    print("successfully logged user to backend")

    user_chat_system = database.get_users_current_voice_system(username)

    if user_chat_system is None:
        user_chat_system = database.insert_users_current_voice_system(username)

    session['chat_system'] = user_chat_system

    return 'successfully logged user to backend', 200


@main.route('/api/switch_chat/', methods=['POST'])
def switch_chat():
    username = session.get('username')
    if username is None:
        return 'error no username', 400
    
    data = request.json
    voice_name = data['voice_name']

    voice = database.update_users_current_voice_system(username, voice_name)

    session['chat_system'] = voice

    return 'success', 200

@main.route('/api/get_voices', methods=['GET'])
def get_voices():
    voices = database.list_voices()

    return jsonify( { "data" : voices } )


@main.route('/text_to_speech', methods=['POST'])
def handle_text_to_speech():
    if session['username'] is None:
        return 'error no username', 401
    if not session['chat_system']:
        return 'error no chat system', 401
    
    username = session['username']
    system_prompt = session['chat_system']['system_prompt']
    voice_id = session['chat_system']['voice_url']
    voice_system_name = session['chat_system']['voicename']

    
    text_data = request.json.get('text')
    if not text_data:
        print("no text data provided")
        return 'no text data provided', 402
    
    # Save user message
    database.save_message(username=username, voice_system_name=voice_system_name, message_content=text_data, user_sent_this=True)
    # Get the ChatGPT text response
    text_response = get_gpt_response(text_data, username, system_prompt)
    # Save system message
    database.save_message(username=username, voice_system_name=voice_system_name, message_content=text_response, user_sent_this=False)

    # Convert the ChatGPT text response to speech
    audio = text_to_speech_controller(text_response, voice_id)
    audio_base64 = base64.b64encode(audio).decode('utf-8')
    
    return jsonify({'audio': audio_base64, 'text_response': text_response})

@main.route('/api/speech-to-text', methods=['POST'])
def api_speech_to_text():
    if 'file' not in request.files:
        return 'No file part', 400

    file = request.files['file']

    print("file", file)

    audio_file = io.BufferedReader(io.BytesIO(file.read()))
    
    print("request_file_type: ", type(audio_file))
    print('Received file:', file.filename)
    print(audio_file)

    file_type = "m4a"
    file_buffered_reader = io.BufferedReader(io.BytesIO(audio_file.read()))
    file_bytes = file_buffered_reader.read()  # Read the entire content into bytes

    content_type="audio/m4a"

    transcription = client.audio.transcriptions.create(
        model="whisper-1",
        file=("temp." + file_type, file_bytes, content_type),
        response_format="text"
        
        )

    print(transcription)
    return jsonify({'transcription': transcription}), 200

@main.route('/api/upload-image', methods=['POST'])
def upload_image():
    try:
        data = request.json
        file_name = data['file_name']
        file_type = data['file_type']
        file_content = data['file_content']  # base64 encoded file content

        file_url = upload_to_s3(file_name, file_type, file_content)
        return jsonify({'file_url': file_url}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main.route('/process_audio', methods=['POST'])
def handle_audio():
    audio_data = request.files['audio']
    text = process_audio_controller(audio_data)
    return jsonify({'text': text})

@main.route('/generate_questions', methods=['POST'])
def handle_generate_questions():
    user_data = request.json
    questions = generate_questions_controller(user_data)
    return jsonify({'questions': questions})

@main.route('/mimic_conversation', methods=['POST'])
def handle_mimic_conversation():
    conversation_data = request.json
    response = mimic_conversation_controller(conversation_data)
    return jsonify({'response': response})



