import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React, { useRef } from 'react';
import CustomButton from './CustomButton';

export default function QuestionForm({question, isLastQuestion, currentAnswer, setCurrentAnswer, onNextQuestion, onSubmit}) {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="w-full justify-center items-center min-h-[85vh] px-4">
                    <View className="w-full mb-4">
                        <Text className="text-lg mb-2 text-white">{question}</Text>
                        <TextInput
                            className="border p-2 rounded border-secondary text-white"
                            multiline
                            value={currentAnswer}
                            onChangeText={text => setCurrentAnswer(text)}
                        />
                    </View>
                    <CustomButton 
                        title={isLastQuestion ? "Submit" : "Next"} 
                        handlePress={isLastQuestion ? onSubmit : onNextQuestion} 
                        containerStyles="w-3/5 mt-8"
                    />
                </View>
        </TouchableWithoutFeedback>
    );
};


