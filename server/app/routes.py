from flask import Blueprint, request, jsonify, session
import json
import os
import random
from .chat_manager import ChatManager
from .user_manager import UserManager
from .cache import voice_systems_cache, messages_cache, update_messages, update_user_voice_system, append_cache_messages, get_cache_messages, get_cache_voice_system
import io
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


    user_info =  user_manager.handle_login(username, email)
    update_cache(username)
    return user_info

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


@main.route('/api/speech-to-text/', methods=['POST'])
def handle_speech_to_text():
    print("a"*180)
    if 'file' not in request.files:
        return 'No file or username part', 400
    
    audio_file = request.files['file']
    print(audio_file)
    print(type(audio_file))
    
    # user_text_transcription = chat_manager.get_text_from_speech(audio_file)
    # print(user_text_transcription)

    # audio_file = io.BufferedReader(io.BytesIO(audio_file.read()))
    
    # print(audio_file)

    file_type = "m4a"
    file_buffered_reader = io.BufferedReader(io.BytesIO(audio_file.read()))
    file_bytes = file_buffered_reader.read()  # Read the entire content into bytes
    content_type = "audio/m4a"
    file = ("temp." + file_type, file_bytes, content_type)

    print(file)

    filename = "saved_audio." + file_type
    # Write the bytes to a file in the current directory
    with open(filename, "wb") as f:
        f.write(file_bytes)
    

    return jsonify({"transcription": user_text_transcription}), 200



@main.route('/api/text_to_speech/', methods=['POST'])
def text_to_speech():
    text_data = request.json.get('text')
    print(text_data)
    print(type(text_data))
    audio_base64 = chat_manager.get_default_speech_from_text(text_data)
    return jsonify({'audio': audio_base64, 'text_response': text_data}), 200


def update_cache(username):
    user_voice_system = chat_manager.get_voice_system(username)
    user_messages = chat_manager.get_user_messages(username, user_voice_system)

    update_user_voice_system(username, user_voice_system)
    update_messages(username, user_messages)


@main.route('/api/generate-questions/', methods=["POST"])
def generate_questions():
    # Get the JSON data from the request
    data = json.loads(request.data)
    submitData = data["submitData"]
    responses = submitData["responses"]
    username = submitData["username"]
    for response in responses:
        question = response["question"]
        answer = response["answer"]
        user_manager.save_answer(username=username,question=question,answer=answer)
    submitData = json.dumps(submitData)
    print(submitData)

    # survey_questions = user_manager.get_survey_questions(submitData=submitData)
    # print(survey_questions)
    # survey_questions = json.loads(survey_questions)

    test_questions = {"questions": ["what is your biggest goal and why?", "How many times can a woodchuck sell grass?", "That concludes the questions"]}

    return jsonify(test_questions), 200

@main.route('/api/save-answer-to-db/', methods=['POST'])
def save_answer_to_db():
    data = json.loads(request.data)
    username, question, answer = data.get("username"), data.get("question"), data.get("answer")
    if not username or not question or not answer:
        return "MISSING SOME SHIT DAWG", 400
    
    user_manager.save_answer(username=username, question=question, answer=answer)

    return 'Success', 200


@main.route('/api/process-clone/', methods=['POST'])
def process_clone():
    data = json.loads(request.data)
    username = data.get("username")
    responses = user_manager.get_user_response_for_training(username)
    system_prompt = user_manager.get_system_prompt_from_response(responses)

@main.route('/api/clone-voice')
def clone_voice():
    pass



