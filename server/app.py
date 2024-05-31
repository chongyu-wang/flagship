import os
from flask import Flask, request, jsonify, send_file
from config import Config
from google.cloud import speech
import openai
import requests
import io

app = Flask(__name__)
app.config.from_object(Config)

# Initialize Google Cloud Speech client
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = Config.GOOGLE_APPLICATION_CREDENTIALS
speech_client = speech.SpeechClient()

# ChatGPT setup
openai.api_key = Config.CHATGPT_API_KEY

@app.route('/process_audio', methods=['POST'])
def process_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']

    # Step 1: Send the audio to Google Cloud Speech-to-Text API
    audio_content = audio_file.read()
    audio = speech.RecognitionAudio(content=audio_content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="en-US"
    )
    
    response = speech_client.recognize(config=config, audio=audio)
    if not response.results:
        return jsonify({'error': 'Could not transcribe audio'}), 400

    transcription = response.results[0].alternatives[0].transcript

    # Step 2: Send the transcription to ChatGPT
    chatgpt_response = openai.Completion.create(
        model="text-davinci-003",
        prompt=transcription,
        max_tokens=150
    )
    chatgpt_text = chatgpt_response.choices[0].text.strip()

    # Step 3: Send the ChatGPT response to Play.ht API
    play_ht_response = requests.post(
        "https://play.ht/api/v1/convert",
        json={
            "voice": "en_us_male",
            "content": [chatgpt_text]
        },
        headers={
            "Authorization": f"Bearer {Config.PLAY_HT_API_KEY}",
            "X-User-ID": Config.PLAY_HT_USER_ID
        }
    )
    if play_ht_response.status_code != 200:
        return jsonify({'error': 'Could not generate audio'}), 500

    audio_url = play_ht_response.json().get('audio_url')
    if not audio_url:
        return jsonify({'error': 'No audio URL returned'}), 500

    audio_data = requests.get(audio_url).content
    audio_stream = io.BytesIO(audio_data)

    return send_file(
        audio_stream,
        mimetype='audio/mpeg',
        as_attachment=True,
        download_name='response.mp3'
    )

if __name__ == '__main__':
    app.run(debug=True)
