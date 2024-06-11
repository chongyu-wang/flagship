import base64
from flask import Blueprint, request, jsonify
from speech2text.speech_to_text import speech_to_text
from .controllers.audio_controller import process_audio_controller, text_to_speech_controller
from .controllers.question_controller import generate_questions_controller
from .controllers.conversation_controller import mimic_conversation_controller, get_gpt_response
import logging
from openai import OpenAI
from dotenv import load_dotenv
import os
import io

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

client = OpenAI(api_key=OPENAI_API_KEY)

main = Blueprint('main', __name__)

current_dir = os.path.dirname(os.path.abspath(__file__))

audio_file_path = os.path.join(current_dir, 'Tate_30_Seconds.mp3')

print(audio_file_path)

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
    text_data = request.json.get('text')
    
    # Get the ChatGPT text response
    text_response = get_gpt_response(text_data)

    # Convert the ChatGPT text response to speech
    audio = text_to_speech_controller(text_response)
    audio_base64 = base64.b64encode(audio).decode('utf-8')
    
    return jsonify({'audio': audio_base64, 'text_response': text_response})



@main.route('/api/speech-to-text', methods=['POST'])
def api_speech_to_text():
    if 'file' not in request.files:
        return 'No file part', 400
    
    audio_file2 = open(audio_file_path, "rb")
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

