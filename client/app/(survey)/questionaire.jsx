import { View, Text, TextInput, Button, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import CustomButton from '../../components/CustomButton';
import { useGlobalContext } from '../../context/GlobalProvider';
import { ProgressBar } from 'react-native-paper';
import { router } from 'expo-router';
// import { SERVER_IP } from '@env';

const SERVER_IP = "35.2.221.249";
// TODO: Replace with your actual server IP address

const questions = [
  "Can you describe your childhood and any memorable events or experiences?",
  "What is the most significant achievement in your life so far, and why?",
//   "Have you faced any major challenges or obstacles, and how did you overcome them?",
//   "What was a pivotal moment or turning point in your career or personal life?",
//   "Can you tell me about a time when you had to make a difficult decision?",
//   "What are some of the happiest moments you’ve experienced?",
//   "Have there been any life-changing events that shaped who you are today?",
//   "What important lessons have you learned from your relationships and interactions with others?",
//   "How have your beliefs or values evolved over time, and what influenced these changes?",
//   "Can you share a story about a person who had a significant impact on your life?"
];

const Questionaire = () => {
    const user = useGlobalContext();

    const [answers, setAnswers] = useState(Array(questions.length).fill(''));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [responseData, setResponseData] = useState('');

    const handleNextQuestion = () => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = currentAnswer;
        setAnswers(newAnswers);
        setCurrentAnswer('');

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // All questions answered, handle form submission
            const username = user.user.username;
            const jsonData = {
                username: username,
                prompt: "help me guage this peron's personality",
                questionaire: questions.map((question, index) => ({
                    question: question,
                    answer: newAnswers[index]
                }))
            };
            // console.log(JSON.stringify(jsonData));
            // Alert.alert("Submitted Answers", JSON.stringify(jsonData));
            // Here you would handle the actual saving of answers, e.g., sending them to an API


            setResponseData("Querying...");
            fetch(`http://${SERVER_IP}:3000/chatgpt`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ input: jsonData }),
            })
            .then((response) => {
                console.log('Response:', response);
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Data:', data);
                setResponseData(data.response);
                // setChatLog(prevChatLog => [...prevChatLog, { user: "gpt", message: data.response }]);
            })
            .catch((error) => {
                console.error('Error:', error);
            })
            .finally(() => {
                // router.replace("/home");
                console.log("A");
            });
            
        }

    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView className="bg-primary h-full">
                <View className="w-full justify-center items-center min-h-[85vh] px-4">
                    <Text className="text-2xl font-bold mb-4 text-white">Questionnaire {responseData}</Text>
                    <View className="w-full mb-4">
                        <Text className="text-lg mb-2 text-white">{questions[currentQuestionIndex]}</Text>
                        <TextInput
                            className="border p-2 rounded border-secondary text-white"
                            multiline
                            value={currentAnswer}
                            onChangeText={setCurrentAnswer}
                        />
                    </View>
                    <CustomButton title={(currentQuestionIndex == questions.length - 1) ? "Submit" : "Next"} handlePress={handleNextQuestion} containerStyles="w-3/5 mt-8"/>
                    <ProgressBar 
                        progress={currentQuestionIndex / questions.length} 
                        color={"#FF0000"} 
                        style={{ width: '100%', marginBottom: 20 }} 
                    />
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default Questionaire;


