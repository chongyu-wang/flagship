# PLAYHT API
# UserID: "BiSrSjpYVPM7ieJ9MjD2PzITvbj2"
# SecretKey: e02224a1bd224bd9a1d93b14598c0aea

# chatGPT API KEY
# sk-proj-PADSaMfnraCdxvk1vSekT3BlbkFJfiXBwgJPrCL8FZKEnFnG

from flask import Flask, request, Response, jsonify
# from flask_cors import CORS
from pyht import Client, TTSOptions, Format
# from google.cloud import speech
# import openai
import requests
from openAI import Gpt

gpt = Gpt()

app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# Initialize PlayHT API with your credentials
client = Client("BiSrSjpYVPM7ieJ9MjD2PzITvbj2", "e02224a1bd224bd9a1d93b14598c0aea")

class Audio:
    def __init__(self):
        self.text = ""
    def setText(self, newText):
        self.text = newText
    def getText(self):
        return self.text
    
audio = Audio()

@app.route('/post-audio', methods=["POST"])
def post_audio():
    data = request.json
    text = data.get('text', 'Hello, this is a default text')
    audio.setText(text)
    return Response(status=200)  # Return a response to indicate success

@app.route('/stream-audio')
def stream_audio():
    def generate():
        text = audio.getText()
        
        options = TTSOptions(
            voice="s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json",
            sample_rate=44_100,
            format=Format.FORMAT_MP3,
            speed=1,
        )
        
        # Must use turbo voice engine for the best latency
        for chunk in client.tts(text=text, voice_engine="PlayHT2.0-turbo", options=options):
            yield chunk

    return Response(generate(), mimetype='audio/mpeg')



# ***STARTER CODE***
@app.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    audio_uri = request.json.get('audioUri')
    client = speech.SpeechClient()

    audio = speech.RecognitionAudio(uri=audio_uri)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="en-US",
    )

    response = client.recognize(config=config, audio=audio)
    transcript = " ".join([result.alternatives[0].transcript for result in response.results])

    return jsonify({"transcript": transcript})

@app.route('/chatgpt', methods=['POST'])
def chatgpt():
    try:
        print("Request received")
        prompt = request.json.get('input')
        print("Prompt:", prompt)
        gptPrompt = ""
        for key, value in prompt.items():
            gptPrompt += str(key)
            gptPrompt += str(value)
        
        print(gptPrompt)
        
        # Check the format of the prompt
        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400
        
        # Call to your GPT function
        response = gpt.getResponse(gptPrompt)
        print("Response from GPT:", response)
        
        # Extract the text from the response
        text = response
        print("Extracted Text:", text)
        
        return jsonify({"response": text})
    
    except Exception as e:
        print("Error occurred:", str(e))
        return jsonify({"error": str(e)}), 500



@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    text = request.json.get('text')
    response = requests.post(
        'https://play.ht/api/v1/convert',
        json={"text": text, "voice": "en_us", "speed": 1},
        headers={"Authorization": f"Bearer YOUR_PLAY_HT_API_KEY"}
    )
    audio_url = response.json().get('audioUrl')
    return jsonify({"audioUrl": audio_url})




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)







