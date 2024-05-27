import React, { useState } from 'react';
import { View, TextInput, Keyboard, TouchableWithoutFeedback, ActivityIndicator, Text } from 'react-native';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const Chat = () => {
  const [sound, setSound] = useState(null);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchAudio = async () => {
    try {
      setIsLoading(true);
      await fetch('http://10.10.241.128:3000/post-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const response = await fetch('http://10.10.241.128:3000/stream-audio');
      const uri = response.url;

      playAudio(uri);
    } catch (error) {
      console.error('Error fetching audio:', error);
      setIsLoading(false);
    }
  };

  const playAudio = async (uri) => {
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
              placeholder="Enter text to convert to speech"
              placeholderTextColor="#7b7b8b"
              value={text}
              onChangeText={setText}
              multiline={true}
              numberOfLines={4}
            />

          <CustomButton
            title="Play Audio"
            handlePress={fetchAudio}
            containerStyles="w-3/5 mt-8"
          />

        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Chat;


