import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React, { useRef } from 'react';
import CustomButton from './CustomButton';

export default function QuestionForm({ question, isLastQuestion, setAnswers, setSurveyPhase, onNextQuestion, onSubmit }) {
    const userInput = useRef('');
    const textInputRef = useRef(null);

    const handlePress = () => {
        const newAnswer = userInput.current;
        userInput.current = '';
        textInputRef.current.clear();

        if (isLastQuestion) {
            onSubmit(newAnswer, setAnswers, setSurveyPhase);
        } else {
            onNextQuestion(newAnswer, setAnswers);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="w-full justify-center items-center min-h-[70vh] px-4">
                <View className="w-full mb-4">
                    <Text className="text-lg mb-2 text-white">{question}</Text>
                    <TextInput
                        className="border p-2 rounded border-secondary text-white"
                        multiline
                        ref={textInputRef}
                        onChangeText={text => userInput.current = text}
                    />
                </View>
                <CustomButton
                    title={isLastQuestion ? "Submit" : "Next"}
                    handlePress={handlePress}
                    containerStyles="w-3/5 mt-8"
                />
            </View>
        </TouchableWithoutFeedback>
    );
};


