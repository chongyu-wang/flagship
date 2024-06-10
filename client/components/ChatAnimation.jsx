import { View, Text } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';

export default function ChatAnimation() {
  return (
    <View className="w-full justify-center items-center min-h-[85vh] px-4">
      {/* <Text className="text-gray-100 text-4xl"
      >ChatAnimation</Text> */}
      <LottieView style={{flex: 1}} source={require("../assets/lottie/VoiceChatAnimation.json")} autoPlay loop/>
    </View>
  )
}

