import base64
from flask import Blueprint, request, jsonify
from speech2text.speech_to_text import speech_to_text
from .controllers.audio_controller import process_audio_controller, text_to_speech_controller
from .controllers.question_controller import generate_questions_controller
from .controllers.conversation_controller import mimic_conversation_controller, get_gpt_response
import logging

main = Blueprint('main', __name__)

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

def init_app_routes(app):

    # Configure logging
    logging.basicConfig(level=logging.DEBUG)

    @app.route('/api/speech-to-text', methods=['POST'])
    def api_speech_to_text():
        logging.debug('Received request for speech-to-text')
        audio_url = request.json.get('audio_url')
        logging.debug(f'Audio URL: {audio_url}')
        if not audio_url:
            logging.error('No audio URL provided')
            return jsonify({'error': 'No audio URL provided'}), 400

        try:
            result = speech_to_text(audio_url)
            logging.debug(f'Result: {result}')
            return jsonify(result)
        except Exception as e:
            logging.error(f'Error processing audio: {e}')
            return jsonify({'error': str(e)}), 500

