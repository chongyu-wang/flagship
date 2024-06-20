import os
import io
from openai import OpenAI
import requests
from dotenv import load_dotenv
import json
import logging

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
PLAY_HT_API_KEY = os.getenv('PLAY_HT_API_KEY')
PLAY_HT_USER_ID = os.getenv('PLAY_HT_USER_ID')
ELEVEN_LABS_API_KEY = "sk_442f43baa26c76f3860f0c8569d7a46c890b34139a3d117f"
client = OpenAI(api_key=OPENAI_API_KEY)


class SpeechProcessor:
    def __init__(self):
        self.name = "SearchProcessor"

    def speech_to_text(self, file):
        # Check if API key is not found
        if not OPENAI_API_KEY:
            raise ValueError("No API key found")

        try:
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
            return transcription

        except requests.exceptions.RequestException as e:
            print(f"Error: {e}")
            return {'error': str(e)}
        
    def list_voices(self):
        url = "https://api.play.ht/api/v2/voices"

        headers = {
            "AUTHORIZATION": PLAY_HT_API_KEY,
            "X-USER-ID": PLAY_HT_USER_ID
        }

        response = requests.get(url, headers=headers)

        print(response.text)

        res = {"data": []}

        for r in dict(response).keys():
            res["data"].append(r)

        return res
    
    def list_voices_from_11labs(self):
        url = "https://api.elevenlabs.io/v1/voices"

        headers = {"xi-api-key": ELEVEN_LABS_API_KEY}

        response = requests.request("GET", url, headers=headers)

        text_data = response.text

        json_text = json.loads(text_data)
        json_voices = json_text["voices"]

        cloned_voices = [voice for voice in json_voices if voice["category"] == "cloned"]

        for voice in cloned_voices:
            print("name: ", voice["name"])
            print("voice_id: ", voice["voice_id"])
            print("\n")

    def stream_audio_from_11labs(self, text):
        url = "https://api.elevenlabs.io/v1/text-to-speech/1fSexxEUhRlhWVGVMVxm"

        payload = {
            "text": text,
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.85,
                "style": 0,
                "use_speaker_boost": True
            }
        }
        headers = {
            "xi-api-key": ELEVEN_LABS_API_KEY,
            "Content-Type": "application/json"
        }

        response = requests.request("POST", url, json=payload, headers=headers)

        return response.content
    
    def stream_audio_from_text(self, text, voice_id):
        logging.info("Streaming audio from play.ht")
        url = "https://api.play.ht/api/v2/tts/stream"

        payload = {
            "text": text,
            "voice": voice_id,
            "output_format": "mp3"
        }
        headers = {
            "accept": "audio/mpeg",
            "content-type": "application/json",
            "AUTHORIZATION": "e02224a1bd224bd9a1d93b14598c0aea",
            "X-USER-ID": "BiSrSjpYVPM7ieJ9MjD2PzITvbj2"
        }

        response = requests.post(url, json=payload, headers=headers)

        return response.content