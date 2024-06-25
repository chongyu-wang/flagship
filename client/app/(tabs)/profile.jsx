import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from "@expo/vector-icons";
import { getCurrentUser, signOut } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import { getVoiceNames, switchUserVoiceSystem } from '../../hooks/useApi';
import { router } from 'expo-router';

const Profile = () => {
  const [curUser, setCurUser] = useState("");
  const [currentVoice, setCurrentVoice] = useState("");
  const [voiceNames, setVoiceNames] = useState([]);

  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getCurrentUser();
      setCurUser(result.username);
    };
    const fetchVoiceNames = async () => {
      const result = await getVoiceNames();
      console.log(result)
      setVoiceNames(result.map(voice => ({
        ...voice,
        color: getRandomColor()
      })));
    }
    fetchUser();
    fetchVoiceNames();
  }, []);

  const getRandomColor = () => {
    const colors = [
      '#36454F', // Charcoal
      '#023020', // Dark Green
      '#301934', // Dark Purple
      '#343434', // Jet Black
      '#1B1212', // Licorice
      '#28282B', // Matte Black
      '#191970', // Midnight Blue
      '#353935', // Onyx
      '#6A5ACD', // Slate Blue
      '#483D8B', // Dark Slate Blue
      '#4B0082', // Indigo
      '#8A2BE2', // Blue Violet
      '#7B68EE', // Medium Slate Blue
      '#4169E1', // Royal Blue
      '#4682B4', // Steel Blue
      '#5F9EA0', // Cadet Blue
      '#008B8B', // Dark Cyan
      '#2E8B57', // Sea Green
      '#2F4F4F', // Dark Slate Gray
      '#1E90FF', // Dodger Blue
      '#556B2F', // Dark Olive Green
      '#8B4513', // Saddle Brown
      '#A52A2A', // Brown
      '#800000', // Maroon
    ];     
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  const handleNamePress = async(name) => {
    await switchUserVoiceSystem(name);
    setCurrentVoice(name);
  }

  const logOut = async() => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace("/sign-in");
  }

  return (
    <SafeAreaView className="bg-primary h-full p-6">
      <View className="w-full flex-row justify-between items-center mb-8">
        <View className="flex-row items-center">
          <AntDesign name="user" size={32} color={"#A9A9A9"} />
          <Text className="text-slate-300 text-2xl font-bold ml-2">{curUser}</Text>
        </View>
        <TouchableOpacity onPress={logOut} className="rounded-3xl">
          <Text className="text-slate-500 text-lg mx-2">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-slate-300 text-lg mb-4">Current Voice System: <Text className="text-white font-semibold">{currentVoice}</Text></Text>
      <ScrollView className="w-full" contentContainerStyle={{ alignItems: 'center' }}>
        <View className="w-full flex-row flex-wrap justify-between">
          {voiceNames.map(voice => (
            <TouchableOpacity
              key={voice.id} onPress={() => handleNamePress(voice.voicename)}
              className={`my-2 border-2 rounded-3xl w-[48%] p-4 items-center h-[48%] justify-center
              ${voice.voicename === currentVoice ? "border-blue-500": "border-slate-500"}`}
              style={{backgroundColor: voice.color}}
            >
              <Text className={`${voice.voicename === currentVoice ? "text-blue-500": "text-white"} text-lg font-medium`}>{voice.voicename}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile;





