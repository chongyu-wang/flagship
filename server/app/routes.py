import base64
from flask import Blueprint, request, jsonify, session, redirect
from speech2text.speech_to_text import speech_to_text
from .controllers.audio_controller import process_audio_controller, text_to_speech_controller, list_voice_names
from .controllers.question_controller import generate_questions_controller
from .controllers.conversation_controller import mimic_conversation_controller, get_gpt_response
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

# current_dir = os.path.dirname(os.path.abspath(__file__))

# audio_file_path = os.path.join(current_dir, 'Tate_30_Seconds.mp3')

# print(audio_file_path)

base_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(base_dir, '../db/systems.db')



def get_db_connection():
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

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

    conn = get_db_connection()

    user_chat_system = conn.execute(
        "SELECT voice_id, voice_system FROM users WHERE username = ?",
        (username,)
    ).fetchone()



    if user_chat_system is None:
        conn.execute(
            '''
            INSERT INTO users (username, voice_id, voice_system) VALUES (?, 
            (SELECT voice_id FROM voices LIMIT 1),
            (SELECT content FROM systems LIMIT 1))
            ''',
        )
        conn.commit()
        

    user_chat_system = conn.execute(
        "SELECT voice_id, voice_system FROM users WHERE username = ?",
        (username,)
    ).fetchone()

    user_chat_system = dict(user_chat_system)
    session['chat_system'] = user_chat_system

    conn.close()
    

    return 'successfully logged user to backend', 200


@main.route('/api/switch_chat/', methods=['POST'])
def switch_chat():
    conn = get_db_connection()
    username = session.get('username')
    if username is None:
        return 'error no username', 400
    
    
    data = request.json
    voice_name = data['voice_name']

    voice = conn.execute(
    """
        SELECT V.voice_id as voice_id, S.content as voice_system FROM voices V INNER JOIN systems S
        ON V.name = S.name
        WHERE V.name = ?
    """,
    (voice_name,)
    ).fetchone()

    print(voice)

    voice = dict(voice)

    print(voice)

    conn.execute(
        '''
            UPDATE users SET voice_id = ?, voice_system = ?
            WHERE
            username = ?
        ''',
        (voice['voice_id'], voice['voice_system'], username,)
    )

    session['chat_system'] = voice

    print("a")

    return 'success', 200

@main.route('/api/get_voices', methods=['GET'])
def get_voices():
    conn = get_db_connection()
    voices = conn.execute(
        "SELECT name FROM voices"
    ).fetchall()

    return jsonify({"data":[dict(v)["name"] for v in voices]})


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



@main.route('/text_to_speech', methods=['POST'])
def handle_text_to_speech():
    if session['username'] is None:
        return 'error no username', 401
    if not session['chat_system']:
        return 'error no chat system', 401
    
    print("*"*80)
    print(session['chat_system'])
    print("*"*190)
    
    system_prompt = session['chat_system']['voice_system']
    voice_id = session['chat_system']['voice_id']
    username = session['username']
    

    text_data = request.json.get('text')
    
    # Get the ChatGPT text response
    text_response = get_gpt_response(text_data, username, system_prompt)

    # Convert the ChatGPT text response to speech
    audio = text_to_speech_controller(text_response, voice_id)
    audio_base64 = base64.b64encode(audio).decode('utf-8')
    
    return jsonify({'audio': audio_base64, 'text_response': text_response})



@main.route('/api/speech-to-text', methods=['POST'])
def api_speech_to_text():
    if 'file' not in request.files:
        return 'No file part', 400
    
    # audio_file2 = open(audio_file_path, "rb")
    # print("audio_file_type: ", type(audio_file))

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

    # Process the file as needed
    # For example, save it or pass it to a speech-to-text service

    # return jsonify({'message': 'File received successfully'}), 200


    # logging.debug('Received request for speech-to-text')
    # audio_url = request.json.get('audio_url')
    # logging.debug(f'Audio URL: {audio_url}')
    # if not audio_url:
    #     logging.error('No audio URL provided')
    #     return jsonify({'error': 'No audio URL provided'}), 400

    # try:
    #     result = speech_to_text(audio_url)
    #     logging.debug(f'Result: {result}')
    #     return jsonify(result)
    # except Exception as e:
    #     logging.error(f'Error processing audio: {e}')
    #     return jsonify({'error': str(e)}), 500

