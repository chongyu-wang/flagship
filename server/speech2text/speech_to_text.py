# # from google.cloud import speech_v1p1beta1 as speech
# import requests

# def process_audio(audio_url):
#     client = speech.SpeechClient()

#     # Fetch the audio file from the URL
#     response = requests.get(audio_url)
#     content = response.content

#     audio = speech.RecognitionAudio(content=content)
#     config = speech.RecognitionConfig(
#         encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
#         sample_rate_hertz=16000,
#         language_code="en-US",
#     )

#     response = client.recognize(config=config, audio=audio)

#     result_text = ""
#     for result in response.results:
#         result_text += result.alternatives[0].transcript

#     return result_text
import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

def speech_to_text(audio_url):
    # Check if API key is not found
    if not OPENAI_API_KEY:
        raise ValueError("No API key found")

    try:
        # Prepare form data for the request
        form_data = {
            'model': 'whisper-1',
        }
        audio_file = {
            'file': ('audio.m4a', requests.get(audio_url).content, 'audio/mp4')
        }

        # Make a POST request to the OpenAI Whisper API
        response = requests.post(
            'https://api.openai.com/v1/audio/transcriptions',
            headers={
                'Authorization': f'Bearer {OPENAI_API_KEY}',
            },
            data=form_data,
            files=audio_file
        )

        # Check for errors in the response
        response.raise_for_status()

        # Return the JSON response
        return response.json()

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return {'error': str(e)}
