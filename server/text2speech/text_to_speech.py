import requests
import os
from dotenv import load_dotenv
import sqlite3
import json

load_dotenv()

PLAY_HT_API_KEY = os.getenv('PLAY_HT_API_KEY')
PLAY_HT_USER_ID = os.getenv('PLAY_HT_USER_ID')

voices = {
  "Andrew Tate": {
    "id": "s3://voice-cloning-zero-shot/76e35797-7bb5-48e6-bff8-3e2b0e41b7d6/enhanced/manifest.json",
    "name": "Andrew Tate",
    "type": "instant",
    "gender": "male",
    "voice_engine": "PlayHT2.0"
  },
  "Joe Biden": {
    "id": "s3://voice-cloning-zero-shot/4b5693de-7825-494b-b239-7f8be077db11/original/manifest.json",
    "name": "Joe Biden",
    "type": "instant",
    "gender": "male",
    "voice_engine": "PlayHT2.0"
  },
  "Alan Watts": {
    "id": "s3://voice-cloning-zero-shot/be9e7cb8-47eb-4116-b522-7d01e859d538/original/manifest.json",
    "name": "Alan Watts",
    "type": "instant",
    "gender": "male",
    "voice_engine": "PlayHT2.0"
  },
  "Scarlett Johansson": {
    "id": "s3://voice-cloning-zero-shot/6700c054-d804-494c-ba1c-2189e8c48809/original/manifest.json",
    "name": "Scarlett Johansson",
    "type": "instant",
    "gender": "female",
    "voice_engine": "PlayHT2.0"
  },
  "Michael Jordan": {
    "id": "s3://voice-cloning-zero-shot/8be62a78-3ea5-4e36-9cb8-e8907f1babb3/original/manifest.json",
    "name": "Michael Jordan",
    "type": "instant",
    "gender": "male",
    "voice_engine": "PlayHT2.0"
  }
}

base_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(base_dir, '../db/systems.db')

def get_db_connection():
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn



def list_voices():
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
    



def create_instant_voice_clone():
    url = "https://api.play.ht/api/v2/cloned-voices/instant"

    headers = {
        "accept": "application/json",
        "content-type": "multipart/form-data",
        "AUTHORIZATION": PLAY_HT_API_KEY,
        "X-USER-ID": PLAY_HT_USER_ID,
    }

    # Get the current directory of the script
    current_directory = os.path.dirname(os.path.abspath(__file__))

    # Define the path to the audio file
    audio_file_path = os.path.join(current_directory, 'Tate_30_Seconds.mp3')

    # Open the audio file in binary mode
    with open(audio_file_path, 'rb') as audio_file:
        audio_content = audio_file.read()

    json = {
        'voice_name': 'sales-voice'
    }

    response = requests.post(url, headers=headers, data=json)

    print(response.text)

def stream_audio_from_text(text, voice_id):
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

    # print(response.content)


    return response.content

def list_voices_from_11labs():
    url = "https://api.elevenlabs.io/v1/voices"

    headers = {"xi-api-key": "sk_442f43baa26c76f3860f0c8569d7a46c890b34139a3d117f"}

    response = requests.request("GET", url, headers=headers)

    text_data = response.text

    json_text = json.loads(text_data)
    json_voices = json_text["voices"]

    cloned_voices = [voice for voice in json_voices if voice["category"] == "cloned"]

    for voice in cloned_voices:
        print("name: ", voice["name"])
        print("voice_id: ", voice["voice_id"])
        print("\n")

def stream_audio_from_11labs(text):
    url = "https://api.elevenlabs.io/v1/text-to-speech/qDjKSZnlqTWWtjPnilLS"

    payload = {
        "text": text,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.7,
            "style": 0.3,
            "use_speaker_boost": True
        }
    }
    headers = {
        "xi-api-key": "sk_442f43baa26c76f3860f0c8569d7a46c890b34139a3d117f",
        "Content-Type": "application/json"
    }

    response = requests.request("POST", url, json=payload, headers=headers)

    # print(response.content)

    # output_file_path = "output.mp3"
    # with open(output_file_path, 'wb') as audio_file:
    #     audio_file.write(response.content)

    # print(f"Audio saved to {output_file_path}")

    return response.content





def text_to_speech(text_data):
    # Implement text-to-speech using Play.ht API
    pass

if __name__ == "__main__":
    list_voices_from_11labs()