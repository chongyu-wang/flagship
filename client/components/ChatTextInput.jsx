import { View, Text, TextInput } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'

const ChatTextInput = ({text, setText, fetchAudio}) => {
  return (
    <View className="w-full justify-center items-center min-h-[85vh] px-4">

        {/* {isLoading && (
            <Text className="text-white">Loading...</Text>
        )} */}

        <TextInput
        className="bg-black text-gray-400 p-4 rounded-xl mb-4 w-full h-40 border-2 border-gray-200"
        placeholder="You are talking to Alan Watts. Say hi!!!"
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
  )
}

export default ChatTextInput