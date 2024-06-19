import base64
from flask import Blueprint, request, jsonify, session, redirect
from speech2text.speech_to_text import speech_to_text
from .controllers.audio_controller import process_audio_controller, text_to_speech_controller, list_voice_names
from .controllers.question_controller import generate_questions_controller
from .controllers.conversation_controller import mimic_conversation_controller, get_gpt_response
from db import Database
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


class User:
    def __init__(self, username, system_content):
        self.username = username
        self.messages = []
        self.system_content = system_content

        self.messages.append({
            "role": "system",
            "content": system_content
        })

    def get_system_content(self):
        for m in self.messages:
            if m["role"] == "system":
                return m["content"]
        return None
            
    def update_system_content(self, new_system_content):
        # save messages to database
        # TODO 

        self.messages.clear()
        self.messages.append({
            "role": "system",
            "content": new_system_content
        })
        self.system_content = new_system_content
        print("successfully updated the system_content")

    def append_to_messages(self, message_content):
        self.messages.append(message_content)
        print("appended to messages")

    def get_latest_message(self):
        return self.messages[-1]
    
users = {}


@main.route('/api/login', methods=['POST'])
def handle_login():
    user_data = request.json
    username = user_data.get("username")
    email = user_data.get("email")
    print("*"*180)
    print(username)
    print(email)
    print("*"*180)
    if username is None:
        print("error username not provided")
        return 'error username not provided', 400
    session['username'] = username
    session['email'] = email
    print("successfully logged user to backend")

    database.get_user_by_username(username)

    user_chat_system = database.get_users_current_voice_system(username)
    # print(user_chat_system)

    if user_chat_system is None:
        user_chat_system = database.insert_users_current_voice_system(username)

    print("c")

    session['chat_system'] = user_chat_system

    user = User(username, system_content=user_chat_system["system_prompt"])
    users[username] = user
    print(user.messages)

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
    
    cur_user = users[username]

    if system_prompt != cur_user.system_content:
        cur_user.update_system_content(system_prompt)
        print("a"*180)
        print(system_prompt)
        print(cur_user.system_content)
    
    cur_user.append_to_messages({
        "role": "user",
        "content": text_data
    })
    
    # Save user message
    database.save_message(username=username, voice_system_name=voice_system_name, message_content=text_data, user_sent_this=True)
    # Get the ChatGPT text response
    text_response = get_gpt_response(cur_user.messages)
    # Save system message
    database.save_message(username=username, voice_system_name=voice_system_name, message_content=text_response, user_sent_this=False)

    cur_user.append_to_messages({
        "role": "assistant",
        "content": text_response
    })



    # Convert the ChatGPT text response to speech
    audio = text_to_speech_controller(text_response, voice_id, platform="elevenlabs")
    audio_base64 = base64.b64encode(audio).decode('utf-8')
    
    return jsonify({'audio': audio_base64, 'text_response': text_response})


# @main.route('/text_to_speech', methods=['POST'])
# def handle_text_to_speech():
#     if session['username'] is None:
#         return 'error no username', 401
#     if not session['chat_system']:
#         return 'error no chat system', 401
    
#     username = session['username']
#     system_prompt = session['chat_system']['system_prompt']
#     voice_id = session['chat_system']['voice_url']
#     voice_system_name = session['chat_system']['voicename']

    
#     text_data = request.json.get('text')
#     if not text_data:
#         print("no text data provided")
#         return 'no text data provided', 402
    
#     # Save user message
#     database.save_message(username=username, voice_system_name=voice_system_name, message_content=text_data, user_sent_this=True)
#     # Get the ChatGPT text response
#     text_response = get_gpt_response(text_data, username, system_prompt)
#     # Save system message
#     database.save_message(username=username, voice_system_name=voice_system_name, message_content=text_response, user_sent_this=False)
#     print(text_response)
#     # Convert the ChatGPT text response to speech
#     audio = text_to_speech_controller(text_response, voice_id, platform="elevenlabs")
#     audio_base64 = base64.b64encode(audio).decode('utf-8')
    
#     return jsonify({'audio': audio_base64, 'text_response': text_response})

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



