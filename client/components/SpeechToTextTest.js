// client/components/SpeechToTextTest.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { speechToText } from '../hooks/useApi';  // Adjust the import path based on your project structure

const SpeechToTextTest = () => {
    const [audioUrl, setAudioUrl] = useState('');
    const [transcription, setTranscription] = useState('');

    const handleTranscription = async () => {
        try {
            const result = await speechToText(audioUrl);
            if (result.error) {
                Alert.alert('Error', result.error);
            } else {
                setTranscription(result.text || 'Transcription not available');
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'An error occurred');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Enter Audio URL:</Text>
            <TextInput
                style={styles.input}
                value={audioUrl}
                onChangeText={setAudioUrl}
                placeholder="https://example.com/audio.m4a"
            />
            <Button title="Get Transcription" onPress={handleTranscription} />
            {transcription ? (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultLabel}>Transcription:</Text>
                    <Text style={styles.resultText}>{transcription}</Text>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    resultContainer: {
        marginTop: 16,
    },
    resultLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultText: {
        fontSize: 16,
    },
});

export default SpeechToTextTest;
