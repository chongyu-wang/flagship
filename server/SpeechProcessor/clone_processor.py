import requests
from dotenv import load_dotenv
import os

load_dotenv()

class CloneProcessor:
    def __init__(self):
        self.api_key = os.getenv("ELEVEN_LABS_API_KEY")

    def process_clone(self, name):
        url = "https://api.elevenlabs.io/v1/voices/add"
        # Open the file in binary mode
        with open('kanye_west.mp3', 'rb') as f:
            files = {
                "files": ('kanye_west.mp3', f, 'audio/mpeg'),  # Provide the filename and content type
                "name": (None, name)  # Include the name field as part of the files dictionary
            }
            headers = {
                "xi-api-key": self.api_key
            }
            response = requests.post(url, files=files, headers=headers)

        print(response.text)



# url = "https://api.elevenlabs.io/v1/voices/add"
# headers = {
#     'xi-api-key': api_key,
#     'Content-Type': "multipart/form-data"
# }

# with open(file_path, 'rb') as audio_file:
#     files = {'file': audio_file}
#     response = requests.post(url, headers=headers, files=files)

# if response.status_code == 200:
#     print('File linked successfully:', response.json())
# else:
#     print('Error linking file:', response.status_code, response.text)