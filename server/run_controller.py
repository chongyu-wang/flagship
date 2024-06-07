import sys
import os

# Add the project root to PYTHONPATH
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

# Print the sys.path to debug PYTHONPATH issues
print("PYTHONPATH:", sys.path)

from app.controllers.audio_controller import process_audio_controller

# Example test code to demonstrate usage
def test_process_audio():
    class FileMock:
        def __init__(self, filename):
            self.filename = filename
        def read(self):
            return b'This is a test audio file content'
        @property
        def content_type(self):
            return 'audio/wav'

    # Replace 'your_audio_file.wav' with a real file path if needed
    audio_file = FileMock('your_audio_file.wav')
    
    # Call the process_audio_controller function
    result = process_audio_controller(audio_file)
    print(result)

if __name__ == "__main__":
    test_process_audio()


