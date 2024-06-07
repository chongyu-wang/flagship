import base64
from flask import Blueprint, request, jsonify
from .controllers.audio_controller import process_audio_controller, text_to_speech_controller
from .controllers.question_controller import generate_questions_controller
from .controllers.conversation_controller import mimic_conversation_controller, get_gpt_response

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

