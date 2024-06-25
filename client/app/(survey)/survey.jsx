import { Redirect } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import ProgressDisplay from '../../components/ProgressDisplay';
import QuestionForm from '../../components/QuestionForm';
import LottieView from 'lottie-react-native';
import { useGlobalContext } from '../../context/GlobalProvider';
import { getCurrentUser, signOut } from '../../lib/appwrite';
import { 
    userDataQuestions,
} from './surveyHelper'
import { submitUserData } from '../../hooks/useApi';
import Interviewer from '../../components/Interviewer';

// surveyPhase 0: after survey phase 0 is complete send the user basic survey data to model_A_prime and set questions 
// surveyPhase 1: save user answers to questions as well as voice recordings. then submit answers to model_A and voice files to elevenlabs
// await for both system prompt and voice cloning to complete. then register user to the database.
// surverPhase 2: finished
export default function Survey() {
    const [answers, setAnswers] = useState([]);
    const [surveyPhase, setSurveyPhase] = useState(0);
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [curUser, setCurUser] = useState("");
    const [questionnaireQuestions, setQuestionnaireQuestions] = useState(["placeholder"]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchUser = async () => {
          const result = await getCurrentUser();
          setCurUser(result.username);
        };
        fetchUser();
    });

    const registerAnswer = (newAnswer) => {
        return new Promise((resolve) => {
            setAnswers((answers) => {
                const updatedAnswers = [...answers, newAnswer];
                resolve(updatedAnswers);
                return updatedAnswers;
            });
        });
    };
    
    const handleUserDataSubmit = async (newAnswer) => {
        const updatedAnswers = await registerAnswer(newAnswer);
        const submitData = {};
        const submitResponses = userDataQuestions.map((question, index) => ({
            question: question,
            answer: updatedAnswers[index],
        }));
        submitData.username = curUser;
        submitData.responses = submitResponses;
        console.log(submitData);
        setIsLoading(true);
        const newQuestions = await submitUserData(submitData);
        setQuestionnaireQuestions(newQuestions);
        setSurveyPhase(1);
        setAnswers([]);
        setIsLoading(false);
    };
    
    const handleQuestionnaireSubmit = (newAnswer) => {
        registerAnswer(newAnswer);
        setSurveyPhase(2);
    };

    useEffect(() => {
        if (surveyPhase === 2) {
            const timeout = setTimeout(() => {
                setShouldRedirect(true);
            }, 10000);

            return () => clearTimeout(timeout);
        }
    }, [surveyPhase]);

    if (shouldRedirect) {
        return <Redirect href="/home" />;
    }

    if (surveyPhase === 2 || isLoading) {
        return (
            <SafeAreaView className="bg-primary h-full">
                <LottieView style={{flex: 1}} source={require("../../assets/lottie/LoadingAnimation.json")} autoPlay loop />
            </SafeAreaView>
        );
    }

    const questions = surveyPhase === 0 
        ? userDataQuestions
        : questionnaireQuestions; 

    const isLastQuestion = surveyPhase === 0 
        ? answers.length === userDataQuestions.length - 1 
        : answers.length === questionnaireQuestions.length - 1;

    const onSubmit = surveyPhase === 0
        ? handleUserDataSubmit
        : handleQuestionnaireSubmit;

    const onNextQuestion = registerAnswer;

    return (
        <SafeAreaView className="bg-primary h-full">
            <ProgressDisplay
                firstCheckpointCompletion={surveyPhase === 1 ? userDataQuestions.length : answers.length}
                firstCheckpointMax={userDataQuestions.length}
                secondCheckpointCompletion={surveyPhase === 1 ? answers.length : 0}
                secondCheckpointMax={questionnaireQuestions.length}
            />
            {surveyPhase === 0 ? (
                <View>
                <View className="items-center mt-8">
                    <Text className="text-2xl font-bold text-white">Tell us about yourself!</Text>
                </View>
                <QuestionForm
                    question={questions[answers.length]}
                    isLastQuestion={isLastQuestion}
                    setAnswers={setAnswers}
                    setSurveyPhase={setSurveyPhase}
                    onNextQuestion={onNextQuestion}
                    onSubmit={onSubmit}
                    displayDate={surveyPhase === 0 && answers.length === 2}
                    surveyPhase={surveyPhase}
                />
                </View>
            ):
            (<Interviewer
                question={questions[answers.length]}
                username={curUser}
            />)}
        </SafeAreaView>
    );
}; 



