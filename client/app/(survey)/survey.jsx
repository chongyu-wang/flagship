import { Redirect } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import ProgressDisplay from '../../components/ProgressDisplay';
import QuestionForm from '../../components/QuestionForm';
import { 
    handleUserDataSubmit, 
    handleQuestionnaireSubmit, 
    userDataQuestions,
    questionnaireQuestions,
    registerAnswer
} from './surveyHelper'

export default function Survey() {
    const [answers, setAnswers] = useState([]);
    const [surveyPhase, setSurveyPhase] = useState(0);

    if (surveyPhase === 2) {
        return (
            <Redirect href="/home" />
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
            />

            <ProgressDisplay
                firstCheckpointCompletion={surveyPhase === 1 ? userDataQuestions.length : answers.length}
                firstCheckpointMax={userDataQuestions.length}
                secondCheckpointCompletion={surveyPhase === 1 ? answers.length : 0}
                secondCheckpointMax={questionnaireQuestions.length}
            />
        </SafeAreaView>
    );
};