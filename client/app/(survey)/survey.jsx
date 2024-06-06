import { View, Text, TextInput, Button, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalProvider';
import ProgressDisplay from '../../components/ProgressDisplay';
import QuestionForm from '../../components/QuestionForm';
// import { SERVER_IP } from '@env';

const SERVER_IP = "";
// TODO: Replace with your actual server IP address

const userDataQuestions = [
    "What is your name?",
    "What is your gender?",
    "What is your age?"
];

const questionnaireQuestions = [
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

export default function Questionnaire() {
    const [answers, setAnswers] = useState(Array(userDataQuestions.length).fill(''));
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [responseData, setResponseData] = useState('');
    const [surveyPhase, setSurveyPhase] = useState(0);
    const user = useGlobalContext();

    const registerAnswer = () => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = currentAnswer;
        setAnswers(newAnswers);
        setCurrentAnswer('');
    }
    
    const transitionToQuestionnaire = () => {
        setSurveyPhase(1);
        setAnswers(Array(questionnaireQuestions.length).fill(''));
        setCurrentQuestionIndex(0);
    };

    

    const handleNextQuestion = () => {
        registerAnswer();
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handleUserDataSubmit = () => {
        registerAnswer();
        transitionToQuestionnaire();
    };

    const handleQuestionnaireSubmit = () => {
        registerAnswer();
        // All questions answered, handle form submission
        const username = user.user.username;
        const jsonData = {
            username: username,
            prompt: "help me guage this peron's personality",
            questionnaire: questionnaireQuestions.map((question, index) => ({
                question: question,
                answer: answers[index]
            }))
        };

        alert("Submit");
        // console.log(JSON.stringify(jsonData));
        // Alert.alert("Submitted Answers", JSON.stringify(jsonData));
        // Here you would handle the actual saving of answers, e.g., sending them to an API


        // setResponseData("Querying...");
        // fetch(`http://${SERVER_IP}:3000/chatgpt`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ input: jsonData }),
        // })
        //     .then((response) => {
        //         console.log('Response:', response);
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok: ' + response.statusText);
        //         }
        //         return response.json();
        //     })
        //     .then((data) => {
        //         console.log('Data:', data);
        //         setResponseData(data.response);
        //         // setChatLog(prevChatLog => [...prevChatLog, { user: "gpt", message: data.response }]);
        //     })
        //     .catch((error) => {
        //         console.error('Error:', error);
        //     })
        //     .finally(() => {
        //         // router.replace("/home");
        //         console.log("A");
        //     });


    };

    return (
        <SafeAreaView className="bg-primary h-full">

            <ProgressDisplay
                firstCheckpointCompletion={100}
                firstCheckpointMax={100}
                secondCheckpointCompletion={100}
                secondCheckpointMax={100}
            />

            
            <QuestionForm
                question={surveyPhase === 0 ? userDataQuestions[currentQuestionIndex] : questionnaireQuestions[currentQuestionIndex]}
                isLastQuestion={surveyPhase === 0 ? currentQuestionIndex === userDataQuestions.length - 1 : currentQuestionIndex === questionnaireQuestions.length - 1 }
                currentAnswer={currentAnswer}
                setCurrentAnswer={setCurrentAnswer}
                onNextQuestion={handleNextQuestion}
                onSubmit={surveyPhase === 0 ? handleUserDataSubmit : handleQuestionnaireSubmit}
            >
                <Text className="text-2xl font-bold mb-4 text-white">Questionnaire</Text>
            </QuestionForm>
        </SafeAreaView>

    );
};
