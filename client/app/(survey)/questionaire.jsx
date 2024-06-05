import { View, Text, TextInput, Button, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useRef } from 'react';
import CustomButton from '../../components/CustomButton';
import { useGlobalContext } from '../../context/GlobalProvider';
import ProgressDisplay from '../../components/ProgressDisplay';
import { router } from 'expo-router';
import { SERVER_IP } from '@env';

export default function Questionaire() {
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
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};
