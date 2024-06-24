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
      setVoiceNames(result);
    }
    fetchUser();
    fetchVoiceNames();
  }, []);

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
              className={`my-2 border-0 rounded-3xl w-[48%] p-4 items-center bg-gray-800 h-[48%] justify-center
              ${voice.voicename === currentVoice ? "border-blue-500": "border-slate-500"}`}
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



