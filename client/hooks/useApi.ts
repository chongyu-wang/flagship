import { Alert } from 'react-native';

// Function to convert speech to text using the Flask backend server

const SERVER_IP = '35.1.63.103'

export const registerUserToBackend = async(username : string, email: string) => {
  console.log("registering user with username: ", username);
  try {
    const response = await fetch(`http://${SERVER_IP}:3000/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, email: email})
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || 'An error occured');
    }
  } catch (error: any) {
    console.log(error);
  }
}

export const switchUserVoiceSystem = async( voiceName: string) => {
  console.log("switching voice to: ", voiceName);
  try {
    const response = await fetch(`http://${SERVER_IP}:3000/api/switch_chat/`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ voice_name: voiceName})
    });

    console.log("gggggggggggggggggggggggggggg");

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || 'An error occured');
    }
  } catch (error: any) {
    console.log(error);
  }
}

export const getVoiceNames = async() => {
  console.log("getting voice names");
  try {
    const response = await fetch(`http://${SERVER_IP}:3000/api/get_voices`);
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || 'An error occurred');
    }

    const result = await response.json()
    return result.data;
  } catch (error: any) {
    console.log(error);
  }
}

export const getUsersCurrentVoiceSystem = async() => {
  console.log("getting user current voice system");
}

export const speechToText = async (audioUri: string) => {
    console.log(audioUri);
    try {
        const response = await fetch(`http://${SERVER_IP}:3000/api/speech-to-text`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ audio_url: audioUri }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'An error occurred');
        }

        const result = await response.json();
        return result;

    } catch (error: any) {
        if (error instanceof SyntaxError) {
            console.error('Response was not JSON:', error);
            Alert.alert('Error', 'Received non-JSON response from server');
        } else {
            console.error('Error in speechToText:', error);
            Alert.alert('Error', error.message || 'An error occurred');
        }
    }
};

// Function to get a completion from ChatGPT using the transcribed text
export const getCompletion = async (prompt: string) => {
    try {
        const response = await fetch(`http://${SERVER_IP}:3000/api/chat-completion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'An error occurred');
        }

        const result = await response.json();
        return result;

    } catch (error: any) {
        if (error instanceof SyntaxError) {
            console.error('Response was not JSON:', error);
            Alert.alert('Error', 'Received non-JSON response from server');
        } else {
            console.error('Error in getCompletion:', error);
            Alert.alert('Error', error.message || 'An error occurred');
        }
    }
};


export const fetchAudio = async (text: string) => {
    console.log("fetching audio");
    console.log(SERVER_IP);
    try {
      const response = await fetch(`http://${SERVER_IP}:3000/text_to_speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const responseData = await response.json();
      const base64Audio = responseData.audio;

      return base64Audio;

    } catch (error) {
      console.error('Error fetching audio:', error);
    }
  };

export const sendAudio = async (uri: string): Promise<string | void> => {
  console.log("aaaaa");
    if (uri) {
      try {
        const fileType = 'audio/mpeg';
  
        const formData = new FormData();
        formData.append('file', {
          uri: uri,
          name: 'audio.mp3',
          type: fileType
        } as any);
  
        const fetchResponse = await fetch(`http://${SERVER_IP}:3000/api/speech-to-text`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (!fetchResponse.ok) {
          throw new Error(`HTTP error! status: ${fetchResponse.status}`);
        }
  
        const data = await fetchResponse.json();
        console.log(data.transcription);
        return data.transcription;

      } catch (error) {
        console.error('Error:', error);
      } finally {
      }
    }
};
  