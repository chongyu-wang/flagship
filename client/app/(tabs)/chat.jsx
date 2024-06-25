import React, { useState, useEffect } from 'react';
import { View, TextInput, Keyboard, TouchableWithoutFeedback, Text, Button, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import { Buffer } from 'buffer';
import { sendAudioToGetResponse } from '../../hooks/useApi';
// import { fetchAudio } from '../../hooks/audioProcessing';
import TypingText from '../../components/TypingText';
import ChatTextInput from '../../components/ChatTextInput';
// import ChatAnimation from '../../components/ChatAnimation';
import LottieView from 'lottie-react-native';
import ChatBottomList from '../../components/ChatBottomList';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {LogBox} from 'react-native';
// import { get } from 'http';

// Ignore log notification by message:
LogBox.ignoreLogs(['Warning: ...']);

// Ignore all log notifications:
LogBox.ignoreAllLogs();



// const SERVER_IP = '35.2.213.35';

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
        const audioResponse = await sendAudioToGetResponse(uri);
        await playAudio(audioResponse);
      }
    } catch (err) {
      console.error("ERROR", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPressIn={startRecording} onPressOut={stopRecording}>
      <SafeAreaView className="bg-primary h-full">
          {
          (!isPlaying && !isLoading && !isRecording) ? 
          (
            <TypingText
              text1={"Hold the Screen to Chat."}
              text2={"Release When Done Talking.."}
              text3={"Hold the Screen to Chat..."}
              time1={3000}
              time2={3000}
              time3={3000}
            />
          ) :
          isRecording ?
          (
            <View style={{justifyContent: "center", alignItems: "center", flex:1}}>
            <LottieView style={{flex: 1, width: "70%" , height: "70%"}} source={require("../../assets/lottie/RecordingAnimation.json")} autoPlay loop/>
            </View>
          ):
          isLoading ?
          (
            <LottieView style={{flex: 1}} source={require("../../assets/lottie/ChatLoadingAnimation.json")} autoPlay loop/>
          ) :
          (
            <LottieView style={{flex: 1}} source={require("../../assets/lottie/VoiceChatAnimation.json")} autoPlay loop/>
          )
          }
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Chat;