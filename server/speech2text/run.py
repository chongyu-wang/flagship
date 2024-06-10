from flask import Flask, request, jsonify
from speech_to_text import speech_to_text

app = Flask(__name__)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)
