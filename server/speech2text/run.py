from flask import Flask, request, jsonify
from speech_to_text import speech_to_text

app = Flask(__name__)

@app.route('/api/speech-to-text', methods=['POST'])
def api_speech_to_text():
    audio_url = request.json.get('audio_url')
    if not audio_url:
        return jsonify({'error': 'No audio URL provided'}), 400

    try:
        result = speech_to_text(audio_url)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)
