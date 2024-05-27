# PLAYHT API
# UserID: "BiSrSjpYVPM7ieJ9MjD2PzITvbj2"
# SecretKey: e02224a1bd224bd9a1d93b14598c0aea

# chatGPT API KEY
# sk-proj-PADSaMfnraCdxvk1vSekT3BlbkFJfiXBwgJPrCL8FZKEnFnG

from flask import Flask, request, Response
# from flask_cors import CORS
from pyht import Client, TTSOptions, Format

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)







