import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import React, { useRef, useState } from 'react';
import CustomButton from './CustomButton';
import DateInput from './DatePicker';

export default function QuestionForm({ question, isLastQuestion, setAnswers, setSurveyPhase, onNextQuestion, onSubmit, displayDate }) {
    const userInput = useRef('');
    const textInputRef = useRef(null);
    const [selectedGender, setSelectedGender] = useState('male');
    const [selectedAge, setSelectedAge] = useState(18);

    const handlePress = () => {
        let newAnswer = '';
        if (!displayDate ) {
            newAnswer = userInput.current;
            userInput.current = '';
            textInputRef.current.clear();
        }

        

        if (isLastQuestion) {
            onSubmit(newAnswer, setAnswers, setSurveyPhase);
        } else {
            onNextQuestion(newAnswer, setAnswers);
        }
    };

    const renderInput = () => {
        if (question === "What is your gender?") {
            return (
                <View style={{ alignItems: 'center', width: '100%', color: 'white' }}>
                    <Picker
                        selectedValue={selectedGender}
                        onValueChange={(itemValue) => setSelectedGender(itemValue)}
                        style={{ height: 50, width: 250, color: 'white', marginBottom: 100 }}
                    >
                        <Picker.Item label="Male" value="male" />
                        <Picker.Item label="Female" value="female" />
                        <Picker.Item label="Other" value="other" />
                    </Picker>
                </View>
            );
        } else if (question === "What is your age?") {
            return (
                <View style={{ alignItems: 'center', width: '100%', color: 'white' }}>
                    <Picker
                        selectedValue={selectedAge}
                        onValueChange={(itemValue) => setSelectedAge(itemValue)}
                        style={{ height: 50, width: 250, ColorValue: 'white', marginBottom: 100 }}
                        themeVariant={'dark'}
                        color={'#ffffff'}
                    >
                        {Array.from({ length: 82 }, (_, i) => i + 18).map(age => (
                            <Picker.Item key={age} label={age.toString()} value={age} />
                        ))}
                    </Picker>
                </View>
            );
        } else {
            return (
                <TextInput
                    className="border p-2 rounded-2xl border-secondary text-white w-4/5"
                    multiline
                    ref={textInputRef}
                    onChangeText={text => userInput.current = text}
                />
            );
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="w-full justify-center items-center min-h-[70vh] px-4">
                <View className="w-full mb-4">
                    <Text className="text-lg mb-2 text-white">{question}</Text>
                    {displayDate ?
                        (<DateInput>

                        </DateInput>) :
                        (<TextInput
                            className="border p-2 rounded border-secondary text-white"
                            multiline
                            ref={textInputRef}
                            onChangeText={text => userInput.current = text}
                        />)
                    }
                </View>
                <CustomButton
                    title={isLastQuestion ? "Submit" : "Next"}
                    handlePress={handlePress}
                    containerStyles="w-3/5 mt-12"
                />
            </View>
        </TouchableWithoutFeedback>
    );
};



