import React, { useState, useEffect } from 'react';
import { View, TextInput, Keyboard, TouchableWithoutFeedback, Text, Button, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import { Buffer } from 'buffer';
import { speechToText, getCompletion } from '../../hooks/useApi';
import TypingText from '../../components/TypingText';
import ChatTextInput from '../../components/ChatTextInput';
// import ChatAnimation from '../../components/ChatAnimation';
import LottieView from 'lottie-react-native';


const SERVER_IP = '35.3.11.38';

const Chat = () => {
  const [sound, setSound] = useState(null);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recording, setRecording] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchAudio = async () => {
    setText('');
    console.log(SERVER_IP);
    try {
      setIsLoading(true);
      const response = await fetch(`http://${SERVER_IP}:3000/text_to_speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const responseData = await response.json();
      const base64Audio = responseData.audio;

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
      const uri = recording.getURI();
      setRecording(null);

      const result = await speechToText(uri);
      const completion = await getCompletion(result.text);

      setText(completion.text);
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
        {!isPlaying ? (
          <View className="w-full justify-center items-center min-h-[85vh] px-4">

              {isLoading && (
                  <Text className="text-white">Loading...</Text>
              )}
  
              <TextInput
                className="bg-black text-gray-400 p-4 rounded-xl mb-4 w-full h-40 border-2 border-gray-200"
                placeholder="You are talking to Alan Watts. Say hi!!!"
                placeholderTextColor="#7b7b8b"
                value={text}
                onChangeText={setText}
                multiline={true}
                numberOfLines={4}
              />
  
            <CustomButton
              title="Get Audio Response"
              handlePress={fetchAudio}
              containerStyles="w-3/5 mt-8"
            />
  
          {/* SpeechToTextTest component here */}
          <View style={styles.speechToTextContainer}>
            {recording ? (
              <Button title="Stop Recording" onPress={stopRecording} />
            ) : (
              <Button title="Start Recording" onPress={startRecording} />
            )}
          </View>

          </View>
        ) : <TypingText/>}
        
        {
        (!isPlaying && !isLoading) ? 
        (
          <ChatTextInput
            text={text}
            setText={setText}
            fetchAudio={fetchAudio}
          />
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