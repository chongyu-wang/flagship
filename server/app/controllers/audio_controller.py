import os
from google.cloud import storage
from werkzeug.utils import secure_filename
from speech2text.speech_to_text import process_audio as google_process_audio

def save_audio_file_to_gcs(audio_data, bucket_name, destination_blob_name):
    # Initialize a storage client
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    # Upload the audio data
    blob.upload_from_file(audio_data, content_type=audio_data.content_type)

    # Get the public URL for the file
    public_url = blob.public_url

    return public_url

def process_audio_controller(audio_data):
    # Save the uploaded audio file to Google Cloud Storage
    bucket_name = 'your-bucket-name'
    destination_blob_name = f'audio_files/{secure_filename(audio_data.filename)}'
    audio_url = save_audio_file_to_gcs(audio_data, bucket_name, destination_blob_name)

    # Process the audio file using Google Cloud Speech-to-Text
    text = google_process_audio(audio_url)

    return text



