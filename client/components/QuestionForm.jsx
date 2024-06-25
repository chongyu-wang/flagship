import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from './CustomButton';

export default function QuestionForm({ question, isLastQuestion, setAnswers, setSurveyPhase, surveyPhase, onNextQuestion, onSubmit, displayDate }) {
    const userInput = useRef('');
    const textInputRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handlePress = () => {
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






