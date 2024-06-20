import base64
from flask import jsonify, request
from openai import OpenAI
import os
from db import Database
from Models import ModelB
from SpeechProcessor import SpeechProcessor
 

class ChatManager:
    def __init__(self):
        self.model_b = ModelB()
        self.speech_processor = SpeechProcessor()
        self.database = Database()
        
    def process_audio_chat(self, username, file):
        text_transcription = self.speech_processor.speech_to_text(file)
        voice_system = self.database.get_users_current_voice_system(username)

        voice_url = voice_system.get("voice_url")
        
        text_response = self.model_b.get_chatgpt_response(username, text_transcription, voice_system)

        audio_response = self.speech_processor.stream_audio_from_text(text_response, voice_url)
        audio_base64 = base64.b64encode(audio_response).decode('utf-8')

        return jsonify({'audio': audio_base64, 'text_response': text_response})


