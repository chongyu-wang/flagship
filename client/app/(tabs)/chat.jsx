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

const Chat = () => {
  const [sound, setSound] = useState(null);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recording, setRecording] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
    console.log("recording started");
    try {
      await Audio.requestPermissionsAsync();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });


      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);

      setRecording(recording);

      await recording.startAsync();

    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setIsLoading(true);
    try {
      await recording.stopAndUnloadAsync();
      console.log("A");
      const uri = recording.getURI();
      console.log("B");
      setRecording(null);
      console.log("C");

      const result = await speechToText(uri);
      console.log("D");
      const completion = await getCompletion(result.text);
      console.log("E");

      setText(completion.text);
      console.log("F");
    } catch (error) {
      console.error('Failed to stop recording', error);
      Alert.alert('Error', 'Failed to process the recording');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      
      <SafeAreaView className="bg-primary h-full">
        {
        (!isPlaying && !isLoading) ? 
        (
          <View>
            <View style={styles.speechToTextContainer}>
            {recording ? (
              <Button title="Stop Recording" onPress={stopRecording} />
            ) : (
              <Button title="Start Recording" onPress={startRecording} />
            )}
            </View>
            <ChatTextInput
              text={text}
              setText={setText}
              fetchAudio={() => getAudioResponse(text)}
            />
          </View>
        ) :
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