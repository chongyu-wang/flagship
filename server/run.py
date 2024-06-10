from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)



from flask import Flask, request, jsonify
from speech2text.speech_to_text import speech_to_text
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/api/speech-to-text', methods=['POST'])
def api_speech_to_text():
    logging.debug('Received request for speech-to-text')
    audio_url = request.json.get('audio_url')
    logging.debug(f'Audio URL: {audio_url}')
    if not audio_url:
        logging.error('No audio URL provided')
        return jsonify({'error': 'No audio URL provided'}), 400

    try:
        result = speech_to_text(audio_url)
        logging.debug(f'Result: {result}')
        return jsonify(result)
    except Exception as e:
        logging.error(f'Error processing audio: {e}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)
