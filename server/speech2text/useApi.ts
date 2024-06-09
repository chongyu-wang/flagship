import { Alert } from 'react-native';

// Function to convert speech to text using the Flask backend server
export const speechToText = async (audioUri: string) => {
    try {
        // Make a POST request to the Flask backend server
        const response = await fetch('http://localhost:3000/api/speech-to-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ audio_url: audioUri }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'An error occurred');
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Error in speechToText:', error);
        Alert.alert('Error', error.message || 'An error occurred');
    }
};
