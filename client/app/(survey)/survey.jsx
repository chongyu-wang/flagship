import { View } from 'react-native';
import React, { useState, useRef } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import ProgressDisplay from '../../components/ProgressDisplay';
import { router } from 'expo-router';
import { SERVER_IP } from '@env';
import Questionaire from './questionaire';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Survey() {
    const user = useGlobalContext();

    const [answers, setAnswers] = useState(Array(questions.length).fill(''));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useRef('');
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

            handleFormSumbit(jsonData, setResponseData);
        };
    }

        return (
            <SafeAreaView>
                <ProgressDisplay
                    firstCheckpointCompletion={100}
                    firstCheckpointMax={100}
                    secondCheckpointCompletion={100}
                    secondCheckpointMax={100}
                />
                <Questionaire />
            </SafeAreaView>
        );
    };

const personalityQuestions = [
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

const handleFormSumbit = (jsonData, setResponseData) => {

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
};
