import requests
from google.cloud import speech

def process_audio(audio_url):
    client = speech.SpeechClient()

    # Fetch the audio file from the URL
    response = requests.get(audio_url)
    content = response.content

    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="en-US",
    )

    response = client.recognize(config=config, audio=audio)

    result_text = ""
    for result in response.results:
        result_text += result.alternatives[0].transcript

    return result_text

