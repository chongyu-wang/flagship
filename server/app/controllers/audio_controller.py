import os
import sys
# from google.cloud import storage
from werkzeug.utils import secure_filename


# Add the project root to PYTHONPATH
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

# Use relative imports
# from speech2text.speech_to_text import process_audio as google_process_audio
from speech2text.speech_to_text import speech_to_text
from text2speech.text_to_speech import stream_audio_from_text

# def save_audio_file_to_gcs(audio_data, bucket_name, destination_blob_name):
#     storage_client = storage.Client()
#     bucket = storage_client.bucket(bucket_name)
#     blob = bucket.blob(destination_blob_name)
#     blob.upload_from_file(audio_data, content_type=audio_data.content_type)
#     public_url = blob.public_url
#     return public_url

def process_audio_controller(audio_data):
    # Directly use the local audio file instead of uploading to GCS
    audio_url = f'path_to_audio_files/{secure_filename(audio_data.filename)}'
    text = speech_to_text(audio_url)
    return text

# def process_audio_controller(audio_data):
#     bucket_name = 'your-bucket-name'
#     destination_blob_name = f'audio_files/{secure_filename(audio_data.filename)}'
#     audio_url = save_audio_file_to_gcs(audio_data, bucket_name, destination_blob_name)
#     text = speech_to_text(audio_url)
#     return text


def text_to_speech_controller(text_data):
    return stream_audio_from_text(text_data)

# test = text_to_speech_controller("hello this is a test audio!!!!!")

# print(type(test))



