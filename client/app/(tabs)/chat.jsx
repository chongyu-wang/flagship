import React, { useState, useEffect } from 'react';
import { View, TextInput, Keyboard, TouchableWithoutFeedback, Text, Button, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import { Buffer } from 'buffer';
import { speechToText, getCompletion, fetchAudio } from '../../hooks/useApi';
// import { fetchAudio } from '../../hooks/audioProcessing';
import TypingText from '../../components/TypingText';
import ChatTextInput from '../../components/ChatTextInput';
// import ChatAnimation from '../../components/ChatAnimation';
import LottieView from 'lottie-react-native';

import {LogBox} from 'react-native';

// Ignore log notification by message:
LogBox.ignoreLogs(['Warning: ...']);

// Ignore all log notifications:
LogBox.ignoreAllLogs();



const SERVER_IP = '35.2.213.35';

const Chat = () => {
  const [sound, setSound] = useState(null);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

  const getAudioResponse = async (text) => {
    setText('');
    try {
      setIsLoading(true);
      const base64Audio = await fetchAudio(text);

      playAudio(base64Audio);
    } catch (error) {
      console.error('Error fetching audio:', error);
      setIsLoading(false);
    }
  };

  const playAudio = async (base64Audio) => {
    const audioBuffer = Buffer.from(base64Audio, 'base64');
    const uri = `data:audio/mp3;base64,${base64Audio}`;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,

      })
    } catch {
      console.log("error setting");
    }

    const { sound } = await Audio.Sound.createAsync(
       { uri },
       { shouldPlay: true }
    );
    setSound(sound);
    setIsLoading(false);
    setIsPlaying(true); // Set isPlaying to true when the audio starts

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setIsPlaying(false);
        sound.unloadAsync();
      }
    });
  };

  //added for real time speech to text
  const startRecording = async () => {
    setIsRecording(true);
    console.log("recording started");
    try {
      await Audio.requestPermissionsAsync();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });


      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);

      console.log(recording);

      console.log("*********");

      setRecording(recording);

      // await recording.startAsync();

    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsLoading(true);
  
    console.log("START RECORDING");
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioUri(uri);
      setRecording(null);
    
      if (uri) {
        const fileType = 'audio/mpeg';
        const response = await fetch(uri);
        const blob = await response.blob();
    
        const formData = new FormData();
        formData.append('file', {
          uri: uri,
          name: 'audio.mp3',
          type: fileType
        });
    
        fetch(`http://${SERVER_IP}:3000/api/speech-to-text`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => response.json())
        .then(data => {
          console.log(data.transcription);
          getAudioResponse(data.transcription);
        })
        .catch(error => {
          console.error('Error:', error);
        })
        .finally(() => {
          // setIsLoading(false);
        });
      }
    } catch (err) {
      console.error("ERROR", err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} onPressIn={startRecording} onPressOut={stopRecording}>
      
      <SafeAreaView className="bg-primary h-full">
        {
        (!isPlaying && !isLoading && !isRecording) ? 
        (
          <View className="items-center justify-content">
            {/* <View style={styles.speechToTextContainer}>
            {recording ? (
              <Button title="Stop Recording" onPress={stopRecording} />
            ) : (
              <Button title="Start Recording" onPress={startRecording} />
            )}
            </View> */}
            {/* <ChatTextInput
              text={text}
              setText={setText}
              fetchAudio={() => getAudioResponse(text)}
            /> */}
            <Text className="text-white">Hold the Screen to Chat</Text>
          </View>
        ) :
        isRecording ?
         (<LottieView style={{flex: 1}} source={require("../../assets/lottie/RecordingAnimation.json")} autoPlay loop/>):
        isLoading ?
        (
          <TypingText/>
        ) :
        (
        <LottieView style={{flex: 1}} source={require("../../assets/lottie/VoiceChatAnimation.json")} autoPlay loop/>
        )
        }
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  innerContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '85vh',
    paddingHorizontal: 16,
  },
  loadingText: {
    color: 'white',
  },
  textInput: {
    backgroundColor: '#000',
    color: '#7b7b8b',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    width: '100%',
    height: 160,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  speechToTextContainer: {
    marginTop: 20,
    width: '100%',
  },
});

export default Chat;