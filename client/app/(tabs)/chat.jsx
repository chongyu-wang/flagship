import React, { useState } from 'react';
import { View, TextInput, Keyboard, TouchableWithoutFeedback, Text } from 'react-native';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import { Buffer } from 'buffer';

const SERVER_IP = '10.0.0.82';

const Chat = () => {
  const [sound, setSound] = useState(null);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchAudio = async () => {
    setText('');
    console.log(SERVER_IP);
    try {
      setIsLoading(true);
      const response = await fetch(`http://${SERVER_IP}:3000/text_to_speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const responseData = await response.json();
      const base64Audio = responseData.audio;

      playAudio(base64Audio);
    } catch (error) {
      console.error('Error fetching audio:', error);
      setIsLoading(false);
    }
  };

  const playAudio = async (base64Audio) => {
    const audioBuffer = Buffer.from(base64Audio, 'base64');
    const uri = `data:audio/mp3;base64,${base64Audio}`;

    const { sound } = await Audio.Sound.createAsync(
       { uri },
       { shouldPlay: true }
    );
    setSound(sound);
    setIsLoading(false);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  };

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="bg-primary h-full">
        <View className="w-full justify-center items-center min-h-[85vh] px-4">

            {isLoading && (
                <Text className="text-white">Loading...</Text>
            )}

            <TextInput
              className="bg-black text-gray-400 p-4 rounded-xl mb-4 w-full h-40 border-2 border-gray-200"
              placeholder="You are talking to an ai. Say hi!!!"
              placeholderTextColor="#7b7b8b"
              value={text}
              onChangeText={setText}
              multiline={true}
              numberOfLines={4}
            />

          <CustomButton
            title="Get Audio Response"
            handlePress={fetchAudio}
            containerStyles="w-3/5 mt-8"
          />

        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Chat;


