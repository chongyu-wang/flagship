from flask import Blueprint, request, jsonify
from .controllers.audio_controller import process_audio_controller, text_to_speech_controller
from .controllers.question_controller import generate_questions_controller
from .controllers.conversation_controller import mimic_conversation_controller

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
    audio = text_to_speech_controller(text_data)
    return jsonify({'audio': audio})

