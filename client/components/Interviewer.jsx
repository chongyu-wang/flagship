import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from './CustomButton';

export default function Interviewer({ question, isLastQuestion, setAnswers, setSurveyPhase, surveyPhase, onNextQuestion, onSubmit, displayDate }) {
    const userInput = useRef('');
    const textInputRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handlePress = () => {
      // play the audio recording of the question first
      // allow user to record using start record and stop record button
      // send the audio file along with the text transcription to the backend
      // and proceed to next question
        let newAnswer = '';
        if (displayDate) {
            newAnswer = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
        } else {
            newAnswer = userInput.current;
            userInput.current = '';
            textInputRef.current.clear();
        }

        if (isLastQuestion) {
            onSubmit(newAnswer, setAnswers, setSurveyPhase);
        } else {
            console.log(newAnswer);
            onNextQuestion(newAnswer, setAnswers);
        }
    }

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        setShowDatePicker(Platform.OS === 'ios');
        setSelectedDate(currentDate);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="w-full justify-center items-center min-h-[70vh] px-4">
                <View className="w-full mb-4">
                    <Text className="text-lg mb-2 text-white">{question}</Text>
                    {displayDate ? (
                        <View>
                            <Button onPress={() => setShowDatePicker(true)} title="Show Date Picker" />
                            {showDatePicker && (
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    display="default"
                                    onChange={onDateChange}
                                />
                            )}
                        </View>
                    ) : (
                        <TextInput
                            className={`border p-2 rounded-2xl border-secondary text-white ${surveyPhase === 1 && "h-40"}`}
                            multiline
                            ref={textInputRef}
                            onChangeText={text => userInput.current = text}
                            numberOfLines={surveyPhase === 1 ? 4 : 1}
                        />
                    )}
                </View>
                <CustomButton
                    title={isLastQuestion ? "Submit" : "Next"}
                    handlePress={handlePress}
                    containerStyles="w-3/5 mt-8"
                />
            </View>
        </TouchableWithoutFeedback>
    );
}


// import React, { useState, useEffect } from 'react';
// import { View, TextInput, Keyboard, TouchableWithoutFeedback, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
// import { Audio } from 'expo-av';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Buffer } from 'buffer';
// import { saveAnswerToDb, sendAudio, fetchAudio } from '../hooks/useApi';
// import TypingText from './TypingText';
// import LottieView from 'lottie-react-native';

// import { LogBox } from 'react-native';

// // Ignore log notifications:
// LogBox.ignoreLogs(['Warning: ...']);
// LogBox.ignoreAllLogs();

// const Interviewer = ({ username, question }) => {
//   const [sound, setSound] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [recording, setRecording] = useState(null);
//   const [audioUri, setAudioUri] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);

//   useEffect(() => {
//     const playQuestion = async () => {
//       const base64Audio = await fetchAudio(question);
//       await playAudio(base64Audio);
//     };

//     playQuestion();

//     return () => {
//       if (recording) {
//         recording.stopAndUnloadAsync();
//       }
//       sound?.unloadAsync();
//     };
//   }, []);

//   const playAudio = async (base64Audio) => {
//     const uri = `data:audio/mp3;base64,${base64Audio}`;
//     setIsPlaying(true);

//     try {
//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: false,
//         playsInSilentModeIOS: true,
//       });

//       const { sound } = await Audio.Sound.createAsync(
//         { uri },
//         { shouldPlay: true }
//       );

//       setSound(sound);

//       sound.setOnPlaybackStatusUpdate((status) => {
//         if (status.didJustFinish) {
//           setIsPlaying(false);
//           setIsRecording(true); // Allow recording only after the question has been played
//         }
//       });
//     } catch (error) {
//       console.error("Error playing audio", error);
//     }
//   };

//   // Real-time speech to text recording logic
//   const startRecording = async () => {
//     try {
//       await Audio.requestPermissionsAsync();
//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//       });

//       const { recording } = await Audio.Recording.createAsync(
//         Audio.RecordingOptionsPresets.HIGH_QUALITY
//       );

//       setRecording(recording);
//     } catch (err) {
//       console.error('Failed to start recording', err);
//     }
//   };

//   const stopRecording = async () => {
//     setIsRecording(false);
//     setIsLoading(true);

//     try {
//       await recording.stopAndUnloadAsync();
//       const uri = recording.getURI();
//       setAudioUri(uri);
//       setRecording(null);

//       if (uri) {
//         const textTranscript = await sendAudio(uri);
//         await saveAnswerToDb(username, question, textTranscript);
//         console.log("SUCCESS!");
//       }
//     } catch (err) {
//       console.error("ERROR stopping recording", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // UI Rendering Logic
//   // isLoading
//   // isPlaying
//   // isRecording
//   return (

//       <SafeAreaView className="bg-primary h-full">
//         <TouchableOpacity onPress={startRecording} className="mb-8 border-2 border-slate-500">
//           <Text className="text-white">start recording</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={stopRecording} className="border-2 border-slate-500">
//           <Text className="text-white">stop recording</Text>
//         </TouchableOpacity>
//         {isRecording ? (
//           <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
//             <LottieView style={{ flex: 1, width: "70%", height: "70%" }} source={require("../assets/lottie/RecordingAnimation.json")} autoPlay loop />
//           </View>
//         ) : isLoading ? (
//           <LottieView style={{ flex: 1 }} source={require("../assets/lottie/ChatLoadingAnimation.json")} autoPlay loop />
//         ) : (
//           <TypingText text1={"You are now talking to an ai."} text2={"Please be sure to have your audio on."} text3={"Answer as much as you'd like and be yourself!"} time1={3000} time2={4000} time3={6000} />
//         )}
//       </SafeAreaView>
//   );
// };

// export default Interviewer;
