import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.7}
        className={`bg-black rounded-3xl min-h-[58px] justify-center items-center border border-white ${containerStyles} $
        {isLoading ? 'opacity-50' : ''}`}
        disable={isLoading}
    >
        <Text className={`text-gray-100 font-psemibold text-lg ${textStyles}`}>
            {title}
        </Text>
    </TouchableOpacity>
  )
}

export default CustomButton;
