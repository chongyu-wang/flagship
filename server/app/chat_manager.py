import base64
from flask import jsonify, request
from openai import OpenAI
import os
from Models import ModelB
from SpeechProcessor import SpeechProcessor
from db import Database
 

class ChatManager:
    def __init__(self):
        self.model_b = ModelB()
        self.speech_processor = SpeechProcessor()
        self.database = Database()

    def get_voice_system(self, username):
        voice_system = self.database.get_users_current_voice_system(username)
        return voice_system
    
    def get_gpt_response(self, voice_system, messages):
        text_response = self.model_b.get_chatgpt_response(recieved_messages=messages, system_content=voice_system)
        return text_response
    
    def get_user_messages(self, username, voice_system):
        messages = self.database.get_latest_20_messages(username=username, voicename=voice_system["voicename"])
        return messages
    
    def add_message_to_database(self, username, voice_system, message, user_sent_this):
        self.database.save_message(
            username=username, voice_system_name=voice_system["voicename"],
            message_content=message, user_sent_this=user_sent_this)

    def get_text_from_speech(self, audio_file):
        text_transcription = self.speech_processor.speech_to_text(audio_file)
        return text_transcription

    def get_speech_from_text(self, voice_system, text):
        voice_url = voice_system.get("voice_url")
        voice_engine = voice_system.get("voice_engine")
        audio_response = None

        if voice_engine == "playht":
            audio_response = self.speech_processor.stream_audio_from_text(text, voice_url)
        elif voice_engine == "elevenlabs":
            audio_response = self.speech_processor.stream_audio_from_11labs(text, voice_url)
        else:
            ValueError("invalid voice engine")

        audio_base64 = base64.b64encode(audio_response).decode('utf-8')

        return audio_base64

    def process_audio_chat(self, username, audio_file):
        user_voice_system = self.get_voice_system(username)
        user_text_transcription = self.get_text_from_speech(audio_file)

        self.add_message_to_database(username, user_voice_system, user_text_transcription, True)

        messages = self.get_user_messages(username, user_voice_system)
        gpt_response = self.get_gpt_response(user_voice_system, messages)

        audio_response = self.get_speech_from_text(user_voice_system, gpt_response)

        return jsonify({'audio': audio_response, 'text_response': gpt_response})
    
    def get_default_speech_from_text(self, text):
        audio_response = self.speech_processor.get_default_speech_from_text(text)
        audio_base64 = base64.b64encode(audio_response).decode('utf-8')

        return audio_base64
    































    
    # def process_audio_chat(self, username, file):
    #     text_transcription = self.speech_processor.speech_to_text(file)
    #     voice_system = self.database.get_users_current_voice_system(username)

    #     self.database.save_message(
    #         username=username, voice_system_name=voice_system["voicename"],
    #         message_content=text_transcription, user_sent_this=True)
        
    #     messages = self.database.get_latest_20_messages(username=username, voicename=voice_system["voicename"])
        
    #     text_response = self.model_b.get_chatgpt_response(username=username, recieved_message=messages, system_content=voice_system)

    #     self.database.save_message(
    #         username=username, voice_system_name=voice_system["voicename"],
    #         message_content=text_response, user_sent_this=False)

    #     voice_url = voice_system.get("voice_url")
    #     audio_response = self.speech_processor.stream_audio_from_text(text_response, voice_url)
    #     audio_base64 = base64.b64encode(audio_response).decode('utf-8')

    #     return jsonify({'audio': audio_base64, 'text_response': text_response})


