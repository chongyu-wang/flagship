import { Alert } from 'react-native';

// Function to convert speech to text using the Flask backend server

const SERVER_IP = '35.1.84.115'

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


export const fetchAudio = async (text: string) => {
    console.log("fetching audio");
    console.log(SERVER_IP);
    try {
      const response = await fetch(`http://${SERVER_IP}:3000/api/text_to_speech/`, {
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

export const sendAudio = async (uri: string, username: string): Promise<string | void> => {
    if (uri) {
      try {
        const fileType = 'audio/mpeg';
  
        const formData = new FormData();
        formData.append('file', {
          uri: uri,
          name: 'audio.mp3',
          type: fileType
        } as any);
  
        const fetchResponse = await fetch(`http://${SERVER_IP}:3000/api/speech-to-text/`, {
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
        console.log("done it");
      }
    }
};  

export const sendAudioToGetResponse = async (uri: string): Promise<string | void> => {
  if (uri) {
    try {
      const fileType = 'audio/mpeg';

      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        name: 'audio.mp3',
        type: fileType
      } as any);

      const response = await fetch(`http://${SERVER_IP}:3000/api/process-audio-chat/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const base64Audio = responseData.audio;

      return base64Audio;

    } catch (error) {
      console.error('Error:', error);
    } finally {
      console.log("done it");
    }
  }
}

export const submitUserData = async (submitData: any): Promise<string[] | void> => {
  console.log(submitData);
  console.log(typeof submitData);
  
  const response = await fetch(`http://${SERVER_IP}:3000/api/generate-questions/`, {
    method: 'POST',
    body: JSON.stringify({ submitData: submitData }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json', // Ensure the content type is set to application/json
    },
  });

  if (!response.ok) {
    throw new Error("RESPONSE NOT OK");
  }

  const responseData = await response.json(); // Await the response JSON
  const questions = responseData.questions; // Access the questions property
  
  console.log(questions);
  return questions;
}

export const saveAnswerToDb = async (username: string, question: string, answer: string): Promise<string | void> => {
  const response = await fetch(`http://${SERVER_IP}:3000/api/save-answer-to-db/`, {
    method: 'POST',
    body: JSON.stringify({username: username, question: question, answer: answer}),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json', // Ensure the content type is set to application/json
    },
  });

  if (!response.ok) {
    console.log("RESPONSE NOT OK DAWG");
    throw new Error("RESPONSE NOT OK");
  }

  const responseData = await response.json();
  console.log(responseData);
}

  