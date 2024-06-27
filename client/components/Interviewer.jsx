import React, { useState, useEffect } from 'react';
import { View, TextInput, Keyboard, TouchableWithoutFeedback, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Buffer } from 'buffer';
import { saveAnswerToDb, sendAudio, fetchAudio } from '../hooks/useApi';
import TypingText from './TypingText';
import LottieView from 'lottie-react-native';

import { LogBox } from 'react-native';

// Ignore log notifications:
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const Interviewer = ({ username, question, isLastQuestion, onNextQuestion, onSubmit }) => {
  const [sound, setSound] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const playQuestion = async () => {
      const base64Audio = await fetchAudio(question);
      await playAudio(base64Audio);
    };

    playQuestion();

    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      sound?.unloadAsync();
    };
  }, []);

  const playAudio = async (base64Audio) => {
    const uri = `data:audio/mp3;base64,${base64Audio}`;
    setIsPlaying(true);

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );

      setSound(sound);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          setIsRecording(true); // Allow recording only after the question has been played
        }
      });
    } catch (error) {
      console.error("Error playing audio", error);
    }
  };

  // Real-time speech to text recording logic
  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsLoading(true);

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioUri(uri);
      setRecording(null);

      if (uri) {
        const textTranscript = await sendAudio(uri);
        await saveAnswerToDb(username, question, textTranscript);
        console.log("SUCCESS!");
      }
    } catch (err) {
      console.error("ERROR stopping recording", err);
    } finally {
        console.log("entering finally")
        setIsLoading(false);
        if (isLastQuestion) {
            onSubmit("Filler");
        } else {
            onNextQuestion("Filler");
        }
    }
  };

  // UI Rendering Logic
  // isLoading
  // isPlaying
  // isRecording
  return (

      <SafeAreaView className="bg-primary h-full">
        <TouchableOpacity onPress={startRecording} className="mb-8 border-2 border-slate-500">
          <Text className="text-white">start recording</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={stopRecording} className="border-2 border-slate-500">
          <Text className="text-white">stop recording</Text>
        </TouchableOpacity>
        {/* {isRecording ? (
          <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
            //<LottieView style={{ flex: 1, width: "70%", height: "70%" }} source={require("../assets/lottie/RecordingAnimation.json")} autoPlay loop />
          </View>
        ) : isLoading ? (
          /<LottieView style={{ flex: 1 }} source={require("../assets/lottie/ChatLoadingAnimation.json")} autoPlay loop />
        ) : (
          <TypingText text1={"You are now talking to an ai."} text2={"Please be sure to have your audio on."} text3={"Answer as much as you'd like and be yourself!"} time1={3000} time2={4000} time3={6000} />
        )} */}
      </SafeAreaView>
  );
};

export default Interviewer;
